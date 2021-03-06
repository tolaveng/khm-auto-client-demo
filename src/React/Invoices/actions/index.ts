import { Action, AnyAction, Dispatch } from 'redux';
import Api from '../../api/api';
import { Invoice } from 'src/React/types/invoice';

export const LOADING_ACTIONTYPE = 'LOALOADING_ACTIONTYPEDING';
export const LOAD_INVOICES_ACTIONTYPE = 'LOAD_INVOICES_ACTIONTYPE';

export type LoadInvoicesAction = Action & {
    type: typeof LOAD_INVOICES_ACTIONTYPE,
    invoices: PageResponse<Invoice>
}


export const loadInvoices = (pageRequest: PageRequest) => async (dispatch: Dispatch<AnyAction>):Promise<void> => {
    dispatch({
        type: LOADING_ACTIONTYPE
    })
    try {
        const invoices = await Api.Invoices.getAllPaged(pageRequest)
        dispatch({
            type: LOAD_INVOICES_ACTIONTYPE,
            invoices: invoices
        })
    } catch (ex) {
        console.log('cannot load invoices', ex);
    }
};