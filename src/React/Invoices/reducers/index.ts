import { InvoiceState } from '../../types/root-state';
import { Invoice } from '../../types/invoice';
import { InvoiceActionTypes, LoadInvoicesAction } from '../actions';
import { Car } from '../../types/car';
import { PaymentMethod } from '../../types/PaymentMethod';


const initInvoice: Invoice = {
    invoiceId: 0,
    invoiceNo: 0,
    invoiceDateTime: new Date(),
    modifiedDateTime: new Date(),
    isPaid: false,
    paidDate: new Date(),
    paymentMethod: PaymentMethod.Cash,
    gst: 10,
    note: '',
    odo: 0,
    fullName: '',
    phone: '',
    car: {} as Car,
    userId: 0,
    services: [],
};


const initState: InvoiceState = {
    invoices: {
        data: [],
        hasNext: false,
        pageNumber: 0,
        pageSize: 50,
        totalCount: 0,
    },
    invoice: initInvoice
};


export const invoiceReducer = (state = initState, action: LoadInvoicesAction): InvoiceState => {
    switch (action.type) {
        case InvoiceActionTypes.LOAD_INVOICES_SUCCESS:
            return { ...state, invoices: action.invoices };

        case InvoiceActionTypes.LOAD_INVOICE_SUCCESS:
            return { ...state, invoice: action.invoice };

        case InvoiceActionTypes.MAKE_NEW_INVOICE:
            return { ...state, invoice: initInvoice };

        case InvoiceActionTypes.UPDATE_INVOICE:
            return { ...state, invoice: action.invoice };

        default:
            return state;
    }
};
