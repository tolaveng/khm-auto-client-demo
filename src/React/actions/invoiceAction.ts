import Api from '../api/api';
import { Invoice } from '../types/invoice';
import { Action, AnyAction, Dispatch } from 'redux';
export const LOAD_INVOICES = 'LOAD_INVOICES';

export type LoadInvoicesAction = Action & {
    type: typeof LOAD_INVOICES;
    payload: PageResponse<Invoice>;
}

export const loadInvoices = () => async (dispatch: Dispatch<AnyAction>):Promise<void> => {
    try {
        const invoices = await Api.Invoices.getAll()
        dispatch({
            type: LOAD_INVOICES,
            payload: invoices
        })
    } catch (ex) {
        console.log('cannot load invoices', ex);
    }
};