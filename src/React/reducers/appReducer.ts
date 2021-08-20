import { AnyAction } from 'redux';
import { COMPANY_REQUEST_OK, SET_APP_LOADING_ACTION, UNSET_APP_LOADING_ACTION } from '../actions';
import { Company } from '../types/company';
import { AppState } from '../types/root-state';

export default function (state: AppState = { isAppLoading: false }, action: any): AppState {
    if (!action.type) return state;
    switch (action.type) {
        case SET_APP_LOADING_ACTION:
            return { ...state, isAppLoading: true };

        case UNSET_APP_LOADING_ACTION:
            return { ...state, isAppLoading: false };

        default:
            return state;
    }
}

const initCompany: Company = {
    companyId: 0,
    name: '',
    abn: '',
    address: '',
    phone: '',
    email: ''
};

export const CompanyReducer = (state = initCompany, action: AnyAction): Company => {
    switch (action.type) {
        case COMPANY_REQUEST_OK:
            return action.company
        default:
            return state;
    }
}