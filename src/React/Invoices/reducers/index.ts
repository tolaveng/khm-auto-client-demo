import { InvoiceState } from 'src/React/types';
import { LOADING_ACTIONTYPE, LoadInvoicesAction, LOAD_INVOICES_ACTIONTYPE } from '../actions';

const initState: InvoiceState = {
    isLoading: false,
    invoices: {
        data: [],
        hasNext: false,
        pageNumber: 0,
        pageSize: 50,
        totalCount: 0,
    },
};

export const invoiceReducer = (state = initState, action: LoadInvoicesAction): InvoiceState => {
    console.log('reducer state', state);
    console.log('reducer action', action);
    switch (action.type) {
        case LOADING_ACTIONTYPE:
            return { ...state, isLoading: true };
        case LOAD_INVOICES_ACTIONTYPE:
            return { ...state, invoices: action.invoices, isLoading: false };
        default:
            return state;
    }
};
