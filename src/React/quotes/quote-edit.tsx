import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Container, Grid, Modal, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import { connect } from 'react-redux';
import { RootState } from '../types/root-state';
import { Quote } from '../types/quote';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Service } from '../types/service';
import { RoundToTwo } from '../utils/helper';
import { deleteQuote, findCars, loadCarMakes, loadCarModels, loadQuote, loadServiceIndices, makeNewQuote, saveQuote } from './actions';
import { Car } from '../types/car';
import { ResponseResult } from '../types/response-result';
import { toast } from 'react-toastify';
import moment from 'moment';
import { QuotePrint } from './quote-print';
import { useReactToPrint } from 'react-to-print';
import { ServiceIndex } from '../types/service-index';
import { QuoteForm, QuoteFormProps } from './quote-form';
import { FormikProps } from 'formik';
import { LoaderSpinner } from '../components/LoaderSpinner';

interface QuoteEditStateProps {
    isLoading: boolean;
    userId: number;
    quote: Quote;
    serviceIndices: ServiceIndex[];
    isFailed: boolean;
    carFoundResults: Car[]
    carMakes: string[],
    carModels: string[]
}

interface QuoteEditDispatchProps {
    actions: {
        saveQuote: (quote: Quote, callback: (result: ResponseResult) => void) => void;
        loadQuote: (quoteId: number) => void;
        makeNewQuote: () => void;
        loadServiceIndices: (serviceName: string) => void;
        findCars: (carNo: string, callback: (car: Car[]) => void) => void
        loadCarMakes: () => void;
        loadCarModels: () => void;
        deleteQuote: (quoteId: number) => void;
    };
}

type Props = QuoteEditStateProps & QuoteEditDispatchProps;


const calculateTotal = (services: Service[], quoteDiscount: number) => {
    let subTotal = 0;
    let amountTotal = 0;

    services.forEach((service) => {
        subTotal += Number(service.servicePrice) * Number(service.serviceQty);
    });

    amountTotal = subTotal - quoteDiscount;

    return {
        subTotal, amountTotal
    }
}

const QuoteEditComp: React.FC<RouteComponentProps<RequestId> & Props> = (props) => {
    const { isLoading, userId, quote, actions, history, serviceIndices, isFailed, carFoundResults, carMakes, carModels } = props;

    const quotePrintRef = useRef<any>();
    let quoteFormik: FormikProps<QuoteFormProps>;
    
    const [openModal, setOpenModal] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
    
    const handlePrint = useReactToPrint({
        content: () => quotePrintRef.current,
        bodyClass: 'print-only',
        documentTitle: 'Quote-Report-' + moment(quote.quoteDate).format('dd-MM-yy')
    });

    if (!userId) {
        history.push('/login');
        return null;
    }

    const quoteId = Number(props.match.params.id) ?? 0;

    useEffect(() => {
        if (quoteId) {
            actions.loadQuote(quoteId);
        } else {
            actions.makeNewQuote();
        }
    }, [quoteId]);

    useEffect(() => {
        actions.loadServiceIndices('');
        actions.loadCarMakes();
        actions.loadCarModels();
    }, []);


    function saveQuote(formData: QuoteFormProps, serviceData: Service[], isPrint: boolean): Promise<void> {
        return new Promise(function (resolve, reject) {

            if (!formData || !formData.carNo || !serviceData || serviceData.length == 0) {
                reject('At least one service is required.');
                return;
            }

            const madeQuote = makeQuoteFromForm(formData, serviceData);

            actions.saveQuote(madeQuote, (result) => {
                if (result.success) {
                    resolve()
                    if (isPrint) {
                        handlePrint && handlePrint()
                        return;
                    } else {
                        history.push('/quotes');
                        return;
                    }
                } else {
                    toast.error(result.message);
                    reject('Unexpected error');
                }
            });
        });
    }

    function makeQuoteFromForm(formData: QuoteFormProps, serviceData: Service[]): Quote {
        const car: Car = {
            carNo: formData.carNo,
            carModel: formData.model,
            carMake: formData.make,
            carYear: formData.year,
            odo: formData.odo
        };

        return {
            quoteId: quote.quoteId,
            quoteDate: moment(formData.quoteDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
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
            discount: Number(formData.discount) ? Number(formData.discount) : 0,

            modifiedDateTime: new Date().toISOString(),
        };
    }

    function carSearchHandler(value: string) {
        actions.findCars(value, function (cars: Car[]) {
            setOpenModal(true);
        });
    }

    function setQuoteFormik(frm: FormikProps<QuoteFormProps>) {
        quoteFormik = frm;
    }

    function carSelectHandler(car: Car) {
        if (quoteFormik) {
            quoteFormik.setFieldValue('carNo', car.carNo);
            quoteFormik.setFieldValue('odo', car.odo);
            quoteFormik.setFieldValue('year', car.carYear);
            quoteFormik.setFieldValue('make', car.carMake);
            quoteFormik.setFieldValue('model', car.carModel);
        }
        setOpenModal(false);
    }

    function handlServiceNameChange(value: string) {
        actions.loadServiceIndices(value);
    }

    const onDeleteQuote = (quoteId: number) => {
        setConfirmDeleteModal(true);
    }

    const handleDeleteQuote = async () => {
        setConfirmDeleteModal(false);
        if (quote && quote.quoteId) {
            await actions.deleteQuote(quote.quoteId);
            history.push('/quote');
        }
    }

    function renderForm() {
        const total = calculateTotal(quote.services, quote.discount);
        
        const quoteForm: QuoteFormProps = {
            quoteDate: moment(quote.quoteDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            fullName: quote.fullName? quote.fullName : '' ,
            phoneNumber: quote.phone ? quote.phone : '',
            email: quote.email ?? '',
            company: quote.company ?? '',
            abn: quote.abn ?? '',
            address: quote.address ?? '',
            carNo: quote.car.carNo ? quote.car.carNo : '',
            odo: (quote.car && quote.car.odo)? quote.car.odo : 0,
            make: (quote.car && quote.car.carMake)? quote.car.carMake : '',
            model: (quote.car && quote.car.carModel)? quote.car.carModel : '',
            year: (quote.car && quote.car.carYear) ? quote.car?.carYear : 0,
            note: quote.note,
            subTotal: total.subTotal.toFixed(2),
            discount: Number(quote.discount) ? Number(quote.discount).toString() : '',
            amountTotal: total.amountTotal.toFixed(2),
        };

        return (
            <Grid>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={10}>
                    <QuoteForm
                        setQuoteFormik={setQuoteFormik}
                        quote={quote}
                        initValues={quoteForm}
                        onSaveQuote={saveQuote}
                        serviceIndices={serviceIndices}
                        isLoadFailed={isFailed}
                        carSearchHandler={carSearchHandler}
                        carMakes = {carMakes}
                        carModels = {carModels}
                        onDeleteQuote = {onDeleteQuote}
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
            <Modal.Header>Delete Quote</Modal.Header>
            <Modal.Content>
                <Modal.Description style={{overflow:'auto', maxHeight: '320px'}}>
                    <span>Are you sure to delete this quote?</span>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => handleDeleteQuote()} negative color='red'>DELETE</Button>
                <Button onClick={() => setConfirmDeleteModal(false)}>No</Button>
            </Modal.Actions>
        </Modal>);
    }

    return (
        <Container fluid>
            <HeaderLine label={quote.quoteId ? 'Edit Quote' : 'New Quote'} />
            {isLoading && <LoaderSpinner />}
            {!isLoading && renderForm()}

            {openModal && renderModal()}
            {confirmDeleteModal && renderDeleteModal()}


            <div style={{ display: 'none' }}>
                <QuotePrint key={moment(quote.modifiedDateTime, 'YYYY-MM-DD').unix()} quote={quote} ref={quotePrintRef} />
            </div>
        </Container>
    );
};


const mapStateToProps = (state: RootState): QuoteEditStateProps => {
    return {
        isLoading: state.quoteState.isLoading,
        userId: state.user.userId,
        quote: state.quoteState.quote,
        serviceIndices: state.serviceIndices,
        isFailed: state.quoteState.isFailed,
        carFoundResults: state.quoteState.carFoundResults,
        carMakes: state.quoteState.carMakes,
        carModels: state.quoteState.carModels,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): QuoteEditDispatchProps => ({
    actions: {
        saveQuote: bindActionCreators(saveQuote, dispatch),
        loadQuote: bindActionCreators(loadQuote, dispatch),
        makeNewQuote: bindActionCreators(makeNewQuote, dispatch),
        loadServiceIndices: bindActionCreators(loadServiceIndices, dispatch),
        findCars: bindActionCreators(findCars, dispatch),
        loadCarMakes: bindActionCreators(loadCarMakes, dispatch),
        loadCarModels: bindActionCreators(loadCarModels, dispatch),
        deleteQuote: bindActionCreators(deleteQuote, dispatch),
    },
});

export const QuoteEditPage = connect(mapStateToProps, mapDispatchToProps)(QuoteEditComp);
