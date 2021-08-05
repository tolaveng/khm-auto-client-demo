import { Action, AnyAction, Dispatch } from 'redux';
import Api from '../../api/api';
import { Invoice } from '../../types/invoice';
import { SET_APP_LOADING_ACTION, UNSET_APP_LOADING_ACTION } from '../../actions';
import { PageRequest } from 'src/React/types/page-request';
import { PageResponse } from 'src/React/types/page-response';
import { ResponseResult } from 'src/React/types/response-result';
import { InvoiceFilter } from 'src/React/types/invoice-filter';
import { Car } from 'src/React/types/car';
import { toast } from 'react-toastify';

export const InvoiceActionTypes = {
    LOAD_INVOICE_REQUEST: 'LOAD_INVOICE_REQUEST',
    LOAD_INVOICES_SUCCESS: 'LOAD_INVOICES_SUCCESS',
    LOAD_INVOICE_SUCCESS: 'LOAD_INVOICE_SUCCESS',
    LOAD_INVOICES_FAILED: 'LOAD_INVOICES_FAILED',
    LOAD_INVOICE_FAILED: 'LOAD_INVOICE_FAILED',
    MAKE_NEW_INVOICE: 'MAKE_NEW_INVOICE',
    UPDATE_INVOICE_SUCESS: 'UPDATE_INVOICE_SUCESS',
    UPDATE_INVOICE_FAILED: 'UPDATE_INVOICE_FAILED',
    LOAD_SERVICEINDEX_SUCCESS: 'LOAD_SERVICEINDEX_SUCCESS',

    FIND_CAR_REQUEST: 'FIND_CAR_REQUEST',
    FIND_CAR_SUCCESS: 'FIND_CAR_SUCCESS',
    FIND_CAR_FAILED: 'FIND_CAR_FAILED',
    CAR_MAKE: 'CAR_MAKE',
    CAR_MODEL: 'CAR_MODEL'
}


export type LoadInvoicesAction = Action & {
    type: typeof InvoiceActionTypes,
    invoices: PageResponse<Invoice>
    invoice: Invoice,
    carMakes: string[],
    carModels: string[],
    carFoundResults: Car[]
}


export const loadInvoices = (pageRequest: PageRequest, filter?: InvoiceFilter) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    try {
        const invoices = await Api.invoice.getAllPaged(pageRequest, filter)
        dispatch({
            type: InvoiceActionTypes.LOAD_INVOICES_SUCCESS,
            invoices: invoices
        })
    } catch (ex) {
        console.log('Cannot load invoices', ex);
        dispatch({
            type: InvoiceActionTypes.LOAD_INVOICES_FAILED,
        })
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
};


export const loadInvoice = (invoiceId: number, callback?: (invoice: Invoice) => void) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: InvoiceActionTypes.LOAD_INVOICE_REQUEST
    })
    try {
        const invoice = await Api.invoice.getInvoice(invoiceId)
        dispatch({
            type: InvoiceActionTypes.LOAD_INVOICE_SUCCESS,
            invoice
        });
        if (callback) callback(invoice);
    } catch (ex) {
        console.log('Cannot load invoice', ex);
        dispatch({
            type: InvoiceActionTypes.LOAD_INVOICE_FAILED,
        })
    }
};

export const copyInvoice = (invoiceId: number, callback?: (invoice: Invoice) => void) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: InvoiceActionTypes.LOAD_INVOICE_REQUEST
    })
    try {
        const invoice = await Api.invoice.getInvoice(invoiceId)
        // make as new invoice
        invoice.invoiceNo = 0;
        invoice.invoiceId = 0;
        invoice.services = [];
        invoice.discount = 0;
        invoice.note = '';
        invoice.invoiceDate = '';
        invoice.modifiedDateTime = '';
        invoice.paidDate = '';

        dispatch({
            type: InvoiceActionTypes.LOAD_INVOICE_SUCCESS,
            invoice
        });
        if (callback) callback(invoice);
    } catch (ex) {
        console.log('Cannot load invoice', ex);
        dispatch({
            type: InvoiceActionTypes.LOAD_INVOICE_FAILED,
        })
    }
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
                    type: InvoiceActionTypes.UPDATE_INVOICE_SUCESS,
                    invoice: invoice
                })
            }
        } else {
            result = await Api.invoice.create(invoice);
            if (result && result.success && result.data) {
                dispatch({
                    type: InvoiceActionTypes.UPDATE_INVOICE_SUCESS,
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

    } catch (e) {
        callback({success: false, message: 'Unexpected error'});
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}


export const loadServiceIndices = (serviceName: string) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    // dispatch({
    //     type: SET_APP_LOADING_ACTION
    // })
    const results = await Api.invoice.loadServiceIndices(serviceName)
    if (results && results.length > 0) {
        dispatch({
            type: InvoiceActionTypes.LOAD_SERVICEINDEX_SUCCESS,
            payload: results
        })
    }
    // dispatch({
    //     type: UNSET_APP_LOADING_ACTION
    // })
}

export const findCars = (carNo: string, callback: (car: Car[]) => void) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    
    try {
        const response = await Api.car.findCars(carNo)
        dispatch({
            type: InvoiceActionTypes.FIND_CAR_SUCCESS,
            carFoundResults: response.data
        })
        if (callback) callback(response.data);
    } catch (ex) {
        dispatch({
            type: InvoiceActionTypes.FIND_CAR_FAILED,
        })
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}

export const loadCarMakes = () => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    try {
        const response = await Api.car.loadCarMakes()
        dispatch({
            type: InvoiceActionTypes.CAR_MAKE,
            carMakes: response
        })
    } catch {
       // ignored
    }
}

export const loadCarModels = () => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    try {
        const response = await Api.car.loadCarModels()
        dispatch({
            type: InvoiceActionTypes.CAR_MODEL,
            carModels: response
        })
    } catch {
       // ignored
    }
}

export const deleteInvoice = (invoiceId: number) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    try {
        await Api.invoice.deleteInvoice(invoiceId);
    } catch {
        toast.error("Cannot delete the invoice")
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}


export const makeInvoiceFromQuote = (quoteId: number, callback?: (invoice: Invoice) => void) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    dispatch({
        type: InvoiceActionTypes.LOAD_INVOICE_REQUEST
    })

    try {
        const invoice = await Api.invoice.fromQuote(quoteId);
        dispatch({
            type: InvoiceActionTypes.LOAD_INVOICE_SUCCESS,
            invoice
        });
        if (callback) callback(invoice);
    } catch (ex) {
        toast.error("Cannot make new invoice from quote")
        dispatch({
            type: InvoiceActionTypes.LOAD_INVOICE_FAILED,
        })
    }

    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}
