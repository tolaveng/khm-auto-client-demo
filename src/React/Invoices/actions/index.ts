import { Action, AnyAction, Dispatch } from 'redux';
import Api from '../../api/api';
import { Invoice } from '../../types/invoice';
import { SET_APP_LOADING_ACTION, UNSET_APP_LOADING_ACTION } from '../../actions';
import { PageRequest } from 'src/React/types/page-request';
import { PageResponse } from 'src/React/types/page-response';
import { ResponseResult } from 'src/React/types/response-result';

export const InvoiceActionTypes = {
    LOAD_INVOICES_SUCCESS: 'LOAD_INVOICES_SUCCESS',
    LOAD_INVOICE_SUCCESS: 'LOAD_INVOICE_SUCCESS',
    MAKE_NEW_INVOICE: 'MAKE_NEW_INVOICE',
    UPDATE_INVOICE: 'UPDATE_INVOICE',
}


export type LoadInvoicesAction = Action & {
    type: typeof InvoiceActionTypes,
    invoices: PageResponse<Invoice>
    invoice: Invoice
}


export const loadInvoices = (pageRequest: PageRequest) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    try {
        const invoices = await Api.invoice.getAllPaged(pageRequest)
        dispatch({
            type: InvoiceActionTypes.LOAD_INVOICES_SUCCESS,
            invoices: invoices
        })
    } catch (ex) {
        console.log('Cannot load invoices', ex);
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
};


export const loadInvoice = (invoiceId: number) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    try {
        const invoice = await Api.invoice.getInvoice(invoiceId)
        dispatch({
            type: InvoiceActionTypes.LOAD_INVOICE_SUCCESS,
            invoice
        })
    } catch (ex) {
        console.log('Cannot load invoice', ex);
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
};


export const makeNewInvoice = () => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: InvoiceActionTypes.MAKE_NEW_INVOICE
    })
}


export const saveInvoice = (invoice: Invoice, callback: (result: ResponseResult) => void) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    try {
        let result: ResponseResult;
        if (invoice.invoiceId && invoice.invoiceId > 0) {
            result = await Api.invoice.update(invoice);
            if(result && result.success) {
                dispatch({
                    type: InvoiceActionTypes.UPDATE_INVOICE,
                    invoice: invoice
                })
            }
        } else {
            result = await Api.invoice.create(invoice);
            if (result && result.success && result.data) {
                dispatch({
                    type: InvoiceActionTypes.UPDATE_INVOICE,
                    invoice: result.data
                })
            }
        }
        // callback
        if (result && result.success) {
            callback(result);
        } else {
            console.log("Cannot save invoice: ", result.debugMessage);
            if (result) {
                callback({code: result.code, success: false, message: 'Unexpected error'});
            } else {
                callback({success: false, message: 'Unexpected error'});
            }
        }
        dispatch({
            type: UNSET_APP_LOADING_ACTION
        })
    } catch (e) {
        callback({success: false, message: 'Unexpected error'});
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}
