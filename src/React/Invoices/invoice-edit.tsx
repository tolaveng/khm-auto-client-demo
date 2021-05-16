import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container, Grid, Modal, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import { connect } from 'react-redux';
import { RootState } from '../types/root-state';
import { Invoice } from '../types/invoice';
import { InvoiceForm, InvoiceFormProps, INVOICE_FORM } from './invoice-form';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { change, formValueSelector } from 'redux-form';
import { Service } from '../types/service';
import { RoundToTwo } from '../utils/helper';
import { deleteInvoice, findCars, loadCarMakes, loadCarModels, loadInvoice, loadServiceIndices, makeInvoiceFromQuote, makeNewInvoice, saveInvoice } from './actions';
import { Car } from '../types/car';
import { ResponseResult } from '../types/response-result';
import { toast } from 'react-toastify';
import moment from 'moment';
import { InvoicePrint } from './invoice-print';
import { useReactToPrint } from 'react-to-print';
import { ServiceIndex } from '../types/service-index';

interface InvoiceEditStateProps {
    userId: number;
    invoice: Invoice;
    serviceIndices: ServiceIndex[];
    isFailed: boolean;
    carFoundResults: Car[]
    carMakes: string[],
    carModels: string[],
    invoiceDiscount: number,
}

interface InvoiceEditDispatchProps {
    actions: {
        changeField: (form: string, field: string, value: any) => void;
        saveInvoice: (invoice: Invoice, callback: (result: ResponseResult) => void) => void;
        loadInvoice: (invoiceId: number, callback: (invoice: Invoice) => void) => void;
        makeNewInvoice: () => void;
        makeInvoiceFromQuote: (quoteId: number, callback: (invoice: Invoice) => void) => void;
        loadServiceIndices: () => void;
        findCars: (carNo: string, callback: (car: Car[]) => void) => void
        loadCarMakes: () => void;
        loadCarModels: () => void;
        deleteInvoice: (invoiceId: number) => void;
    };
}

type Props = InvoiceEditStateProps & InvoiceEditDispatchProps;


const InvoiceEditComp: React.FC<RouteComponentProps<RequestId> & Props> = (props) => {
    const { userId, invoice, actions, history, serviceIndices, isFailed, carFoundResults, carMakes, carModels, invoiceDiscount } = props;

    const invoicePrintRef = useRef<any>();

    const [initialValue, setInitialValue] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    const [services, setServices] = useState(invoice.services);

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

    useEffect(() => {
        if (invoiceId) {
            actions.loadInvoice(invoiceId, inv => {
                setServices(inv.services);
                setInitialValue(true);
            });
        } else if (quoteId) {
            actions.makeInvoiceFromQuote(quoteId, () => {
                setInitialValue(true);
            });
        } else {
            actions.makeNewInvoice();
            setInitialValue(true);
        }
    }, [invoiceId]);

    useEffect(() => {
        actions.loadServiceIndices();
        actions.loadCarMakes();
        actions.loadCarModels();
    }, []);

    useEffect(() => {
        const total = calculateTotal(services);
        actions.changeField(INVOICE_FORM, 'subTotal', total.subTotal.toFixed(2));
        actions.changeField(INVOICE_FORM, 'gstTotal', total.gstTotal.toFixed(2));
        actions.changeField(INVOICE_FORM, 'amountTotal', total.amountTotal.toFixed(2));
    }, [services, invoiceDiscount]);


    function calculateTotal(services: Service[]) {
        let subTotal = 0;
        let gstTotal = 0;
        let amountTotal = 0;

        services.forEach((service) => {
            subTotal += Number(service.servicePrice) * Number(service.serviceQty);
        });

        amountTotal = subTotal - invoiceDiscount;

        gstTotal = RoundToTwo(amountTotal / (1 + invoice.gst));
        
        return {
            subTotal, gstTotal, amountTotal
        }
    }


    function saveInvoice(formData: InvoiceFormProps, serviceData: Service[], isPrint: boolean): Promise<void> {
        return new Promise(function (resolve, reject) {

            if (!formData || !formData.carNo || !serviceData || serviceData.length == 0) {
                toast.error('Reg No. and a Service are required.');
                reject('Reg No. and a Service are required.');
                return;
            }

            const madeInvoice = makeInvoiceFromForm(formData, serviceData);

            actions.saveInvoice(madeInvoice, (result) => {
                if (result.success) {
                    resolve()
                    if (isPrint) {
                        if (handlePrint)
                            handlePrint()
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
            carModel: formData.model,
            carMake: formData.make,
            carYear: formData.year,
            odo: formData.odo
        };

        return {
            invoiceId: invoice.invoiceId,
            invoiceNo: invoice.invoiceNo,
            invoiceDate: moment(formData.invoiceDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            paymentMethod: Number(formData.paymentMethod),
            gst: invoice.gst,
            note: formData.note,
            odo: formData.odo,
            fullName: formData.fullName,
            phone: formData.phoneNumber,
            email: formData.email,
            company: formData.company,
            abn: formData.abn,
            address: formData.address,

            car: car,
            services: serviceData,
            userId: userId,
            discount: Number(invoiceDiscount) ? Number(invoiceDiscount) : 0,

            modifiedDateTime: new Date().toISOString(),
        };
    }


    function serviceChange(services: Service[]) {
        setServices(services);
    }


    function carSearchHandler(value: string) {
        actions.findCars(value, function (cars: Car[]) {
            setOpenModal(true);
        });
    }

    function carSelectHandler(car: Car) {
        actions.changeField(INVOICE_FORM, 'carNo', car.carNo);
        actions.changeField(INVOICE_FORM, 'odo', car.odo);
        actions.changeField(INVOICE_FORM, 'year', car.carYear);
        actions.changeField(INVOICE_FORM, 'make', car.carMake);
        actions.changeField(INVOICE_FORM, 'model', car.carModel);
        setOpenModal(false);
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
        const total = calculateTotal(invoice.services);
        
        const discountForm = initialValue ? invoiceDiscount : invoice.discount;

        const invoiceForm: InvoiceFormProps = {
            invoiceDate: moment(invoice.invoiceDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            fullName: invoice.fullName? invoice.fullName : '' ,
            phoneNumber: invoice.phone ? invoice.phone : '',
            email: invoice.email ?? '',
            company: invoice.company ?? '',
            abn: invoice.abn ?? '',
            address: invoice.address ?? '',
            carNo: invoice.car?.carNo,
            odo: invoice.car?.odo,
            make: invoice.car?.carMake,
            model: invoice.car?.carModel,
            year: invoice.car?.carYear,
            note: invoice.note,
            paymentMethod: invoice.paymentMethod.toString(),
            subTotal: total.subTotal.toFixed(2),
            discount: Number(discountForm) ? Number(discountForm).toString() : '',
            gstTotal: total.gstTotal.toFixed(2),
            amountTotal: total.amountTotal.toFixed(2),
        };

        return (
            <Grid>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={10}>
                    <InvoiceForm invoice={invoice} initialValues={invoiceForm}
                        onSaveInvoice={saveInvoice} onServiceChange={serviceChange}
                        serviceIndices={serviceIndices}
                        isLoadFailed={isFailed}
                        carSearchHandler={carSearchHandler}
                        carMakes = {carMakes}
                        carModels = {carModels}
                        onDeleteInvoice = {onDeleteInvoice}
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
            {renderForm()}

            {openModal && renderModal()}
            {confirmDeleteModal && renderDeleteModal()}


            <div style={{ display: 'none' }}>
                <InvoicePrint key={moment(invoice.modifiedDateTime, 'YYYY-MM-DD').unix()} invoice={invoice} ref={invoicePrintRef} />
            </div>
        </Container>
    );
};

const selector = formValueSelector(INVOICE_FORM);

const mapStateToProps = (state: RootState): InvoiceEditStateProps => {
    const invoiceDiscount = selector(state, 'discount');
    return {
        userId: state.user.userId,
        invoice: state.invoiceState.invoice,
        serviceIndices: state.serviceIndices,
        isFailed: state.invoiceState.isFailed,
        carFoundResults: state.invoiceState.carFoundResults,
        carMakes: state.invoiceState.carMakes,
        carModels: state.invoiceState.carModels,
        invoiceDiscount: invoiceDiscount,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): InvoiceEditDispatchProps => ({
    actions: {
        changeField: bindActionCreators(change, dispatch),
        saveInvoice: bindActionCreators(saveInvoice, dispatch),
        loadInvoice: bindActionCreators(loadInvoice, dispatch),
        makeNewInvoice: bindActionCreators(makeNewInvoice, dispatch),
        loadServiceIndices: bindActionCreators(loadServiceIndices, dispatch),
        findCars: bindActionCreators(findCars, dispatch),
        loadCarMakes: bindActionCreators(loadCarMakes, dispatch),
        loadCarModels: bindActionCreators(loadCarModels, dispatch),
        deleteInvoice: bindActionCreators(deleteInvoice, dispatch),
        makeInvoiceFromQuote: bindActionCreators(makeInvoiceFromQuote, dispatch),
    },
});

export const InvoiceEditPage = connect(mapStateToProps, mapDispatchToProps)(InvoiceEditComp);
