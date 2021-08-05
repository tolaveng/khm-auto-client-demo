import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container, Grid, Modal, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import { connect } from 'react-redux';
import { RootState } from '../types/root-state';
import { Invoice } from '../types/invoice';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Service } from '../types/service';
import { RoundToTwo } from '../utils/helper';
import { copyInvoice, deleteInvoice, findCars, loadCarMakes, loadCarModels, loadInvoice, loadServiceIndices, makeInvoiceFromQuote, makeNewInvoice, saveInvoice } from './actions';
import { Car } from '../types/car';
import { ResponseResult } from '../types/response-result';
import { toast } from 'react-toastify';
import moment from 'moment';
import { InvoicePrint } from './invoice-print';
import { useReactToPrint } from 'react-to-print';
import { ServiceIndex } from '../types/service-index';
import { InvoiceForm, InvoiceFormProps } from './invoice-form';
import { FormikProps } from 'formik';
import { LoaderSpinner } from '../components/LoaderSpinner';

interface InvoiceEditStateProps {
    isLoading: boolean;
    userId: number;
    invoice: Invoice;
    serviceIndices: ServiceIndex[];
    isFailed: boolean;
    carFoundResults: Car[]
    carMakes: string[],
    carModels: string[]
}

interface InvoiceEditDispatchProps {
    actions: {
        saveInvoice: (invoice: Invoice, callback: (result: ResponseResult) => void) => void;
        loadInvoice: (invoiceId: number) => void;
        makeNewInvoice: () => void;
        makeInvoiceFromQuote: (quoteId: number) => void;
        copyInvoice: (copyId: number) => void;
        loadServiceIndices: (serviceName: string) => void;
        findCars: (carNo: string, callback: (car: Car[]) => void) => void
        loadCarMakes: () => void;
        loadCarModels: () => void;
        deleteInvoice: (invoiceId: number) => void;
    };
}

type Props = InvoiceEditStateProps & InvoiceEditDispatchProps;


const calculateTotal = (services: Service[], invoiceDiscount: number, invoiceGst: number) => {
    let subTotal = 0;
    let gstTotal = 0;
    let amountTotal = 0;

    services.forEach((service) => {
        subTotal += Number(service.servicePrice) * Number(service.serviceQty);
    });

    subTotal = subTotal - invoiceDiscount;
    gstTotal = RoundToTwo(subTotal * invoiceGst/100);
    amountTotal = subTotal + gstTotal;
    
    return {
        subTotal, gstTotal, amountTotal
    }
}

const InvoiceEditComp: React.FC<RouteComponentProps<RequestId> & Props> = (props) => {
    const { isLoading, userId, invoice, actions, history, serviceIndices, isFailed, carFoundResults, carMakes, carModels } = props;

    const invoicePrintRef = useRef<any>();
    let invoiceFormik: FormikProps<InvoiceFormProps>;
    
    const [openModal, setOpenModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    
    const handlePrint = useReactToPrint({
        content: () => invoicePrintRef.current,
        bodyClass: 'print-only',
        documentTitle: 'Invoice-Report-' + moment(invoice.invoiceDate).format('dd-MM-yy')
    });

    if (!userId) {
        history.push('/login');
        return null;
    }
    
    const invoiceId = Number(props.match.params.id) ?? 0;
    const quoteId = Number(props.match.params.quoteId) ?? 0;
    const copyId = Number(props.match.params.copyId) ?? 0;

    useEffect(() => {
        if (invoiceId) {
            actions.loadInvoice(invoiceId);
        } else if (quoteId) {
            actions.makeInvoiceFromQuote(quoteId);
        } else if (copyId) {
            actions.copyInvoice(copyId);
        } else {
            actions.makeNewInvoice();
        }
    }, []);

    useEffect(() => {
        actions.loadServiceIndices('');
        actions.loadCarMakes();
        actions.loadCarModels();
    }, []);

    function saveInvoice(formData: InvoiceFormProps, serviceData: Service[], isPrint: boolean): Promise<void> {
        return new Promise(function (resolve, reject) {

            if (!formData || !formData.carNo || !serviceData || serviceData.length == 0) {
                reject('At least one service is required.');
                return;
            }

            const madeInvoice = makeInvoiceFromForm(formData, serviceData);

            actions.saveInvoice(madeInvoice, (result) => {
                if (result.success) {
                    resolve()
                    if (isPrint) {
                        handlePrint && handlePrint()
                        return;
                    } else {
                        history.push('/invoices');
                        return;
                    }
                } else {
                    toast.error(result.message);
                    reject('Unexpected error');
                }
            });
        });
    }

    function makeInvoiceFromForm(formData: InvoiceFormProps, serviceData: Service[]): Invoice {
        const car: Car = {
            carNo: formData.carNo,
            color: formData.color,
            carModel: formData.model,
            carMake: formData.make,
            carYear: Number(formData.year) ? Number(formData.year) : 0,
            odo: Number(formData.odo) ? Number(formData.odo) : 0
        };

        return {
            invoiceId: invoice.invoiceId,
            invoiceNo: invoice.invoiceNo,
            invoiceDate: moment(formData.invoiceDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            paymentMethod: Number(formData.paymentMethod),
            gst: invoice.gst,
            note: formData.note,
            odo: Number(formData.odo) ? Number(formData.odo) : 0,
            fullName: formData.fullName,
            phone: formData.phoneNumber,
            email: formData.email,
            company: formData.company,
            abn: formData.abn,
            address: formData.address,

            car: car,
            services: serviceData,
            userId: userId,
            discount: Number(formData.discount) ? Number(formData.discount) : 0,

            modifiedDateTime: new Date().toISOString(),
        };
    }

    function carSearchHandler(value: string) {
        actions.findCars(value, function (cars: Car[]) {
            setOpenModal(true);
        });
    }

    function setInvoiceFormik(frm: FormikProps<InvoiceFormProps>) {
        invoiceFormik = frm;
    }

    function carSelectHandler(car: Car) {
        if (invoiceFormik) {
            invoiceFormik.setFieldValue('carNo', car.carNo);
            invoiceFormik.setFieldValue('odo', car.odo ? car.odo : '');
            invoiceFormik.setFieldValue('year', car.carYear ? car.carYear: '');
            invoiceFormik.setFieldValue('color', car.color ? car.color: '');
            invoiceFormik.setFieldValue('make', car.carMake);
            invoiceFormik.setFieldValue('model', car.carModel);
        }
        setOpenModal(false);
    }

    function handlServiceNameChange(value: string) {
        actions.loadServiceIndices(value);
    }

    const onDeleteInvoice = (invoiceId: number) => {
        setConfirmDeleteModal(true);
    }

    const handleDeleteInvoice = async () => {
        setConfirmDeleteModal(false);
        if (invoice && invoice.invoiceId) {
            await actions.deleteInvoice(invoice.invoiceId);
            history.push('/invoice');
        }
    }

    function renderForm() {
        const total = calculateTotal(invoice.services, invoice.discount, invoice.gst);
        
        const invoiceForm: InvoiceFormProps = {
            invoiceDate: moment(invoice.invoiceDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            fullName: invoice.fullName? invoice.fullName : '' ,
            phoneNumber: invoice.phone ? invoice.phone : '',
            email: invoice.email ?? '',
            company: invoice.company ?? '',
            abn: invoice.abn ?? '',
            address: invoice.address ?? '',
            carNo: invoice.car.carNo ? invoice.car.carNo : '',
            color: invoice.car.color ? invoice.car.color : '',
            odo: (invoice.car && invoice.car.odo)? invoice.car.odo.toString() : '',
            make: (invoice.car && invoice.car.carMake)? invoice.car.carMake : '',
            model: (invoice.car && invoice.car.carModel)? invoice.car.carModel : '',
            year: (invoice.car && invoice.car.carYear) ? invoice.car?.carYear.toString() : '',
            note: invoice.note,
            paymentMethod: invoice.paymentMethod.toString(),
            subTotal: total.subTotal.toFixed(2),
            discount: Number(invoice.discount) ? Number(invoice.discount).toString() : '',
            gstTotal: total.gstTotal.toFixed(2),
            amountTotal: total.amountTotal.toFixed(2),
        };

        return (
            <Grid>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={10}>
                    <InvoiceForm
                        setInvoiceFormik={setInvoiceFormik}
                        invoice={invoice}
                        initValues={invoiceForm}
                        onSaveInvoice={saveInvoice}
                        serviceIndices={serviceIndices}
                        isLoadFailed={isFailed}
                        carSearchHandler={carSearchHandler}
                        carMakes = {carMakes}
                        carModels = {carModels}
                        onDeleteInvoice = {onDeleteInvoice}
                        onServiceNameChange = {handlServiceNameChange}
                        />
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        );
    }

    function renderModal() {
        return (<Modal
            onClose={() => setOpenModal(false)}
            //onOpen={() => setOpenModal(true)}
            open={true}
        >
            <Modal.Header>Select a car</Modal.Header>
            <Modal.Content>
                <Modal.Description style={{overflow:'auto', maxHeight: '320px'}}>
                    <Table selectable striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Reg. No</Table.HeaderCell>
                                <Table.HeaderCell>ODO</Table.HeaderCell>
                                <Table.HeaderCell>Year</Table.HeaderCell>
                                <Table.HeaderCell>Color</Table.HeaderCell>
                                <Table.HeaderCell>Make</Table.HeaderCell>
                                <Table.HeaderCell>Model</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                carFoundResults.map((car) =>
                                    <Table.Row key={car.carNo} onClick={() => carSelectHandler(car)} style={{ cursor: 'pointer' }}>
                                        <Table.Cell>{car.carNo}</Table.Cell>
                                        <Table.Cell>{car.odo}</Table.Cell>
                                        <Table.Cell>{car.carYear}</Table.Cell>
                                        <Table.Cell>{car.color}</Table.Cell>
                                        <Table.Cell>{car.carMake}</Table.Cell>
                                        <Table.Cell>{car.carModel}</Table.Cell>
                                    </Table.Row>
                                )
                            }
                        </Table.Body>
                    </Table>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpenModal(false)}>Close</Button>
            </Modal.Actions>
        </Modal>);
    }

    function renderDeleteModal() {
        return (<Modal
            onClose={() => setConfirmDeleteModal(false)}
            //onOpen={() => setConfirmDeleteModal(true)}
            open={confirmDeleteModal}
        >
            <Modal.Header>Delete Invoice</Modal.Header>
            <Modal.Content>
                <Modal.Description style={{overflow:'auto', maxHeight: '320px'}}>
                    <span>Are you sure to delete this invoice?</span>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => handleDeleteInvoice()} negative color='red'>DELETE</Button>
                <Button onClick={() => setConfirmDeleteModal(false)}>No</Button>
            </Modal.Actions>
        </Modal>);
    }

    return (
        <Container fluid>
            <HeaderLine label={invoice.invoiceNo ? 'Edit Invoice' : 'New Invoice'} />
            {isLoading && <LoaderSpinner />}
            {!isLoading && renderForm()}

            {openModal && renderModal()}
            {confirmDeleteModal && renderDeleteModal()}


            <div style={{ display: 'none' }}>
                <InvoicePrint key={moment(invoice.modifiedDateTime, 'YYYY-MM-DD').unix()} invoice={invoice} ref={invoicePrintRef} />
            </div>
        </Container>
    );
};


const mapStateToProps = (state: RootState): InvoiceEditStateProps => {
    return {
        isLoading: state.invoiceState.isLoading,
        userId: state.user.userId,
        invoice: state.invoiceState.invoice,
        serviceIndices: state.serviceIndices,
        isFailed: state.invoiceState.isFailed,
        carFoundResults: state.invoiceState.carFoundResults,
        carMakes: state.invoiceState.carMakes,
        carModels: state.invoiceState.carModels,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): InvoiceEditDispatchProps => ({
    actions: {
        saveInvoice: bindActionCreators(saveInvoice, dispatch),
        loadInvoice: bindActionCreators(loadInvoice, dispatch),
        makeNewInvoice: bindActionCreators(makeNewInvoice, dispatch),
        copyInvoice: bindActionCreators(copyInvoice, dispatch),
        loadServiceIndices: bindActionCreators(loadServiceIndices, dispatch),
        findCars: bindActionCreators(findCars, dispatch),
        loadCarMakes: bindActionCreators(loadCarMakes, dispatch),
        loadCarModels: bindActionCreators(loadCarModels, dispatch),
        deleteInvoice: bindActionCreators(deleteInvoice, dispatch),
        makeInvoiceFromQuote: bindActionCreators(makeInvoiceFromQuote, dispatch),
    },
});

export const InvoiceEditPage = connect(mapStateToProps, mapDispatchToProps)(InvoiceEditComp);
