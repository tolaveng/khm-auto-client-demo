import { InvoiceState } from '../../types/root-state';
import { Invoice } from '../../types/invoice';
import { InvoiceActionTypes, LoadInvoicesAction } from '../actions';
import { Car } from '../../types/car';
import { PaymentMethod } from '../../types/PaymentMethod';
import { ServiceIndex } from 'src/React/types/service-index';
import { AnyAction } from 'redux';
import moment from 'moment';
import { InvoiceFilter } from 'src/React/types/invoice-filter';

const toDay = moment().format('YYYY-MM-DD');

const initInvoice: Invoice = {
    invoiceId: 0,
    invoiceNo: 0,
    invoiceDate: toDay,
    modifiedDateTime: toDay,
    paidDate: toDay,
    paymentMethod: PaymentMethod.Cash,
    gst: 10,
    note: '',
    odo: 0,
    fullName: '',
    phone: '',
    car: {} as Car,
    userId: 0,
    services: [],
    discount: 0
};

const initFilter: InvoiceFilter = {
    InvoiceNo: '',
    CarNo: '',
    Customer: '',
    InvoiceDate: '',
    SortBy: 'InvoiceNo',
    SortDir: 'DESC',
}

const initState: InvoiceState = {
    isLoading: false,
    invoices: {
        data: [],
        hasNext: false,
        pageNumber: 1,
        pageSize: 50,
        totalCount: 0,
    },
    invoice: initInvoice,
    isFailed: false,
    carMakes: [],
    carModels: [],
    carFoundResults: [],
    invoiceFilter: initFilter,
};


export const invoiceReducer = (state = initState, action: LoadInvoicesAction): InvoiceState => {
    switch (action.type) {
        case InvoiceActionTypes.LOAD_INVOICE_REQUEST:
            return { ...state, isLoading: true };

        case InvoiceActionTypes.LOAD_INVOICES_SUCCESS:
            return { ...state, invoices: action.invoices, isFailed: false, isLoading: false };

        case InvoiceActionTypes.LOAD_INVOICE_SUCCESS:
            return { ...state, invoice: action.invoice, isFailed: false, isLoading: false };

        case InvoiceActionTypes.UPDATE_INVOICE_FAILED:
        case InvoiceActionTypes.LOAD_INVOICES_FAILED:
        case InvoiceActionTypes.LOAD_INVOICE_FAILED:
            return { ...state, isFailed: true, isLoading: false };

        case InvoiceActionTypes.MAKE_NEW_INVOICE:
            return { ...state, invoice: initInvoice, isFailed: false, isLoading: false };

        case InvoiceActionTypes.UPDATE_INVOICE_SUCESS:
            return { ...state, invoice: action.invoice, isFailed: false, isLoading: false };

        case InvoiceActionTypes.FIND_CAR_REQUEST:
            return { ...state, isLoading: true };

        case InvoiceActionTypes.FIND_CAR_SUCCESS:
            return { ...state, carFoundResults: action.carFoundResults, isLoading: false };

        case InvoiceActionTypes.FIND_CAR_FAILED:
            return { ...state, isLoading: false };

        case InvoiceActionTypes.CAR_MAKE:
            return { ...state, carMakes: action.carMakes };

        case InvoiceActionTypes.CAR_MODEL:
            return { ...state, carModels: action.carModels };

        case InvoiceActionTypes.SET_INVOICE_FILTER:
                return { ...state, invoiceFilter: action.invoiceFilter };
        
        case InvoiceActionTypes.RESET_INVOICE_FILTER:
                return { ...state, invoiceFilter: initFilter };

        default:
            return state;
    }
};


const initServiceIndices: ServiceIndex[] = [];

export const serviceIndexReducer = (state = initServiceIndices, action: AnyAction): ServiceIndex[] => {
    switch (action.type) {
        case InvoiceActionTypes.LOAD_SERVICEINDEX_SUCCESS:
            return [...action.payload];
        default:
            return state;
    }
}
