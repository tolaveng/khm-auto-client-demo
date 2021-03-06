import { combineReducers } from 'redux';
import authReducer from './authReducer';
import invoiceReducer from './invoiceReducer';

export default combineReducers({
    auth: authReducer,
    invoiceState: invoiceReducer,
});
