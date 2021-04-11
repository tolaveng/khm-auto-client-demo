import { InvoiceState } from '../../types/root-state';
import { Invoice } from '../../types/invoice';
import { InvoiceActionTypes, LoadInvoicesAction } from '../actions';
import { Car } from '../../types/car';
import { PaymentMethod } from '../../types/PaymentMethod';
import { ServiceIndex } from 'src/React/types/service-index';
import { Action, AnyAction } from 'redux';


const initInvoice: Invoice = {
    invoiceId: 0,
    invoiceNo: 0,
    invoiceDate: new Date().toISOString(),
    modifiedDateTime: new Date().toISOString(),
    isPaid: false,
    paidDate: new Date().toISOString(),
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
        pageNumber: 1,
        pageSize: 50,
        totalCount: 0,
    },
    invoice: initInvoice,
    isFailed: false
};


export const invoiceReducer = (state = initState, action: LoadInvoicesAction): InvoiceState => {
    switch (action.type) {
        case InvoiceActionTypes.LOAD_INVOICES_SUCCESS:
            return { ...state, invoices: action.invoices, isFailed: false };

        case InvoiceActionTypes.LOAD_INVOICE_SUCCESS:
            return { ...state, invoice: action.invoice, isFailed: false };

        case InvoiceActionTypes.LOAD_INVOICES_FAILED:
        case InvoiceActionTypes.LOAD_INVOICE_FAILED:
            return { ...state, isFailed: true};

        case InvoiceActionTypes.MAKE_NEW_INVOICE:
            return { ...state, invoice: initInvoice, isFailed: false };

        case InvoiceActionTypes.UPDATE_INVOICE:
            return { ...state, invoice: action.invoice, isFailed: false };

        default:
            return state;
    }
};


const initServiceIndices: ServiceIndex[] = [];

export const serviceIndexReducer = (state = initServiceIndices, action: AnyAction): ServiceIndex[] => {
    switch (action.type) {
        case InvoiceActionTypes.LOAD_SERVICEINDEX_SUCCESS:
            return [...state, ...action.payload];
        default:
            return state;
    }
}
