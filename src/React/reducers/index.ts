import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { UserReducer } from '../components/users/reducers';
import { invoiceReducer } from '../invoices/reducers';
import appReducer from './appReducer';

export default combineReducers({
    form: reduxFormReducer,
    app: appReducer,
    user: UserReducer,
    invoiceState: invoiceReducer,
});
