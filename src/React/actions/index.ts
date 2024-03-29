import { AnyAction, Dispatch } from "redux";
import Api from "../api/api";
import { Company } from "../types/company";

export const SET_APP_LOADING_ACTION = 'SET_APP_LOADING_ACTION';
export const UNSET_APP_LOADING_ACTION = 'UNSET_APP_LOADING_ACTION';
export const COMPANY_REQUEST_OK = 'COMPANY_REQUEST_OK';


export const getCompany = () => async(dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({ type: SET_APP_LOADING_ACTION });

    try{
        const company = await Api.company.get();
        dispatch({
            type: COMPANY_REQUEST_OK,
            company: company
        });
    }catch(e) {
        dispatch({ type: UNSET_APP_LOADING_ACTION });
    }

    dispatch({ type: UNSET_APP_LOADING_ACTION });
};

export const updateCompany = (company: Company, callback: (success: boolean) => void) => async(dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({ type: SET_APP_LOADING_ACTION });

    try{
        await Api.company.update(company);
        callback(true);
    }catch(e) {
        callback(false);
        dispatch({ type: UNSET_APP_LOADING_ACTION });
    }

    dispatch({ type: UNSET_APP_LOADING_ACTION });
};