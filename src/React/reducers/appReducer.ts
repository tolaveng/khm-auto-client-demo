import { SET_APP_LOADING_ACTION, UNSET_APP_LOADING_ACTION } from '../actions';
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
