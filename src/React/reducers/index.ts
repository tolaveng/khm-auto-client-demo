import { combineReducers } from 'redux';
import { invoiceReducer } from '../invoices/reducers';
import authReducer from './authReducer';

export default combineReducers({
    auth: authReducer,
    invoiceState: invoiceReducer,
});
