import { combineReducers } from 'redux';
import { CarReducer } from '../cars/reducers';
import { UserReducer } from '../components/users/reducers';
import { invoiceReducer, serviceIndexReducer } from '../invoices/reducers';
import { quoteReducer } from '../quotes/reducers';
import { SummaryReportReducer, summaryReportTotalReducer } from '../reports/reducers';
import { RootState } from '../types/root-state';
import appReducer, { CompanyReducer } from './appReducer';

export default combineReducers<RootState>({
    app: appReducer,
    user: UserReducer,
    carState: CarReducer,
    invoiceState: invoiceReducer,
    quoteState: quoteReducer,
    serviceIndices: serviceIndexReducer,
    summaryReports: SummaryReportReducer,
    company: CompanyReducer,
    sumaryReportTotal: summaryReportTotalReducer,
});
