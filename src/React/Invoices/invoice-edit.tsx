import React, { useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container, Grid } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import { connect } from 'react-redux';
import { RootState } from '../types/root-state';
import { Invoice } from '../types/invoice';
import { InvoiceForm, InvoiceFormProps, INVOICE_FORM } from './invoice-form';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { change } from 'redux-form';
import { Service } from '../types/service';
import { RoundToTwo } from '../utils/helper';
import { loadInvoice, loadServiceIndices, makeNewInvoice, saveInvoice } from './actions';
import { Car } from '../types/car';
import { ResponseResult } from '../types/response-result';
import { toast } from 'react-toastify';
import { PaymentMethod } from '../types/PaymentMethod';
import moment from 'moment';
import { InvoicePrint } from './invoice-print';
import { useReactToPrint } from 'react-to-print';
import { ServiceIndex } from '../types/service-index';

interface InvoiceEditStateProps {
    userId: number;
    invoice: Invoice;
    serviceIndices: ServiceIndex[];
    isFailed: boolean;
}

interface InvoiceEditDispatchProps {
    actions: {
        changeTotalFields: (form: string, field: string, value: any) => void;
        saveInvoice: (invoice: Invoice, callback: (result: ResponseResult) => void) => void;
        loadInvoice: (invoiceId: number) => void;
        makeNewInvoice: () => void;
        loadServiceIndices: () => void;
    };
}

type Props = InvoiceEditStateProps & InvoiceEditDispatchProps;

const InvoiceEditComp: React.FC<RouteComponentProps<RequestId> & Props> = (props) => {
    const { userId, invoice, actions, history, serviceIndices, isFailed } = props;

    const invoicePrintRef = useRef<any>();

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
    
    useEffect(() => {
        if (invoiceId) {
            actions.loadInvoice(invoiceId);
        } else {
            actions.makeNewInvoice();
        }
    }, [invoiceId]);

    useEffect(() => {
        actions.loadServiceIndices();
    }, []);

    
    function saveInvoice(formData: InvoiceFormProps, serviceData: Service[], isPrint: boolean): Promise<void> {
        return new Promise(function(resolve, reject){

            if(!formData || !formData.carNo || !serviceData || serviceData.length == 0) {
                toast.error('Reg No. and a Service are required.');
                reject('Reg No. and a Service are required.');
                return;
            }
    
            const madeInvoice = makeInvoiceFromForm(formData, serviceData);
            
            actions.saveInvoice(madeInvoice, (result) => {
                if (result.success) {
                    resolve()
                    if (isPrint) {
                        if(handlePrint)
                            handlePrint()
                       return;
                    }else{
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
            isPaid: formData.paymentMethod !== PaymentMethod.Unpaid.toString(),
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

            modifiedDateTime: new Date().toISOString(),
        };
    }


    function serviceChange(services: Service[]) {
        const total = calculateTotal(services);
        
        actions.changeTotalFields(INVOICE_FORM, 'subTotal', total.subTotal.toFixed(2));
        actions.changeTotalFields(INVOICE_FORM, 'gstTotal', total.gstTotal.toFixed(2));
        actions.changeTotalFields(INVOICE_FORM, 'grandTotal', total.grandTotal.toFixed(2));
    }


    function calculateTotal(services: Service[]) {
        let subTotal = 0;
        let gstTotal = 0;
        let grandTotal = 0;
        services.forEach((service) => {
            grandTotal += Number(service.servicePrice) * Number(service.serviceQty);
        });

        gstTotal = RoundToTwo(grandTotal / (1 + invoice.gst));
        subTotal = grandTotal - gstTotal;
        return {
            subTotal, gstTotal, grandTotal
        }
    }


    function renderForm() {
        const total = calculateTotal(invoice.services);
        const invoiceForm: InvoiceFormProps = {
            invoiceDate: moment(invoice.invoiceDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            fullName: invoice.fullName,
            phoneNumber: invoice.phone,
            email: invoice.email?? '',
            company: invoice.company?? '',
            abn: invoice.abn?? '',
            address: invoice.address?? '',
            carNo: invoice.car?.carNo,
            odo: invoice.car?.odo,
            make: invoice.car?.carMake,
            model: invoice.car?.carModel,
            year: invoice.car?.carYear,
            note: invoice.note,
            paymentMethod: invoice.paymentMethod.toString(),
            subTotal: total.subTotal.toFixed(2),
            gstTotal: total.gstTotal.toFixed(2),
            grandTotal: total.grandTotal.toFixed(2),
        };

        return (
            <Grid>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={10}>
                    <InvoiceForm invoice={invoice} initialValues={invoiceForm} onSaveInvoice={saveInvoice} onServiceChange={serviceChange} serviceIndices={serviceIndices} isLoadFailed={isFailed} />
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        );
    }

    return (
        <Container fluid>
            <HeaderLine label={invoice.invoiceNo ? 'Edit Invoice' : 'New Invoice'} />
            {renderForm()}
    
            <div style={{display: 'none'}}>
                <InvoicePrint key={moment(invoice.modifiedDateTime, 'YYYY-MM-DD').unix()} invoice={invoice} ref={invoicePrintRef}/>
            </div>
        </Container>
    );
};

const mapStateToProps = (state: RootState): InvoiceEditStateProps => {
    return {
        userId: state.user.userId,
        invoice: state.invoiceState.invoice,
        serviceIndices: state.serviceIndices,
        isFailed: state.invoiceState.isFailed
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): InvoiceEditDispatchProps => ({
    actions: {
        changeTotalFields: bindActionCreators(change, dispatch),
        saveInvoice: bindActionCreators(saveInvoice, dispatch),
        loadInvoice: bindActionCreators(loadInvoice, dispatch),
        makeNewInvoice: bindActionCreators(makeNewInvoice, dispatch),
        loadServiceIndices: bindActionCreators(loadServiceIndices, dispatch)
    },
});

export const InvoiceEditPage = connect(mapStateToProps, mapDispatchToProps)(InvoiceEditComp);
