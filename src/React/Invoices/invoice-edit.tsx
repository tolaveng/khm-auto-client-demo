import React, { useEffect } from 'react';
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
import { loadInvoice, makeNewInvoice, saveInvoice } from './actions';
import { Car } from '../types/car';
import { ResponseResult } from '../types/response-result';
import { toast } from 'react-toastify';
import { PaymentMethod } from '../types/PaymentMethod';
import moment from 'moment';

interface InvoiceEditStateProps {
    userId: number;
    invoice: Invoice;
}

interface InvoiceEditDispatchProps {
    actions: {
        changeTotalFields: (form: string, field: string, value: any) => void;
        saveInvoice: (invoice: Invoice, callback: (result: ResponseResult) => void) => void;
        loadInvoice: (invoiceId: number) => void;
        makeNewInvoice: () => void;
    };
}

type Props = InvoiceEditStateProps & InvoiceEditDispatchProps;

const InvoiceEditComp: React.FC<RouteComponentProps<RequestId> & Props> = (props) => {
    const { userId, invoice, actions, history } = props;

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

    
    function saveInvoice(formData: InvoiceFormProps, serviceData: Service[]): Promise<void> {
        return new Promise(function(resolve, reject){

            if(!formData || !formData.plateNo || !serviceData || serviceData.length == 0) {
                toast.error('Reg No. and a Service are required.');
                reject('Reg No. and a Service are required.');
                return;
            }
    
            const madeInvoice = makeInvoiceFromForm(formData, serviceData);
            
            actions.saveInvoice(madeInvoice, (result) => {
                if (result.success) {
                    resolve()
                    history.push('/invoices');
                } else {
                    toast.error(result.message);
                    reject('Unexpected error');
                }
            });
        });
    }

    function makeInvoiceFromForm(formData: InvoiceFormProps, serviceData: Service[]): Invoice {
        const car: Car = {
            carId: 0,
            plateNo: formData.plateNo,
            carModel: formData.model,
            carMake: formData.make,
            carYear: formData.year,
            odo: formData.odo
        };

        return {
            invoiceId: invoice.invoiceId,
            invoiceNo: invoice.invoiceNo,
            invoiceDateTime: moment.utc(formData.invoiceDate, 'DD/MM/YYYY').toDate(),
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
            invoiceDate: moment.utc(invoice.invoiceDateTime, 'YYYY-MM-DD').toDate(),
            fullName: invoice.fullName,
            phoneNumber: invoice.phone,
            email: invoice.email?? '',
            company: invoice.company?? '',
            abn: invoice.abn?? '',
            address: invoice.address?? '',
            plateNo: invoice.car?.plateNo,
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
                    <InvoiceForm invoice={invoice} initialValues={invoiceForm} onSaveInvoice={saveInvoice} onServiceChange={serviceChange} />
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        );
    }

    return (
        <Container fluid>
            <HeaderLine label={invoiceId ? 'Edit Invoice' : 'New Invoice'} />
            {renderForm()}
        </Container>
    );
};

const mapStateToProps = (state: RootState): InvoiceEditStateProps => {
    return {
        userId: state.user.userId,
        invoice: state.invoiceState.invoice,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): InvoiceEditDispatchProps => ({
    actions: {
        changeTotalFields: bindActionCreators(change, dispatch),
        saveInvoice: bindActionCreators(saveInvoice, dispatch),
        loadInvoice: bindActionCreators(loadInvoice, dispatch),
        makeNewInvoice: bindActionCreators(makeNewInvoice, dispatch)
    },
});

export const InvoiceEditPage = connect(mapStateToProps, mapDispatchToProps)(InvoiceEditComp);
