import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { CarReducer } from '../cars/reducers';
import { UserReducer } from '../components/users/reducers';
import { invoiceReducer, serviceIndexReducer } from '../invoices/reducers';
import { SummaryReportReducer } from '../reports/reducers';
import { RootState } from '../types/root-state';
import appReducer from './appReducer';

export default combineReducers<RootState>({
    form: reduxFormReducer,
    app: appReducer,
    user: UserReducer,
    carState: CarReducer,
    invoiceState: invoiceReducer,
    serviceIndices: serviceIndexReducer,
    summaryReports: SummaryReportReducer,
});
