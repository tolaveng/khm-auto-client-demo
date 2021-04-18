import { FormReducer } from "redux-form";
import { User } from "../components/users/types";
import { Car } from "./car";
import { Invoice } from "./invoice";
import { PageResponse } from "./page-response";
import { SummaryReport } from "./summary-report";
import { ServiceIndex } from "./service-index";

export interface AppState {
    isAppLoading?: boolean,
    toastInfo?: string,
    toastError?: string
}


export interface InvoiceState {
    invoices: PageResponse<Invoice>;
    invoice: Invoice;
    isFailed: boolean;
}

export interface RootState {
    form: any,
    app: AppState,
    user: User,
    carState: PageResponse<Car>;
    invoiceState: InvoiceState;
    serviceIndices: ServiceIndex[];
    summaryReports: PageResponse<SummaryReport>;
}