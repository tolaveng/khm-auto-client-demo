import { FormReducer } from "redux-form";
import { User } from "../components/users/types";
import { Car } from "./car";
import { Invoice } from "./invoice";
import { PageResponse } from "./page-response";
import { SummaryReport } from "./summary-report";
import { ServiceIndex } from "./service-index";
import { Quote } from "./quote";

export interface AppState {
    isAppLoading?: boolean,
    toastInfo?: string,
    toastError?: string
}


export interface InvoiceState {
    isLoading: boolean;
    invoices: PageResponse<Invoice>;
    invoice: Invoice;
    isFailed: boolean;
    carMakes: string[];
    carModels: string[];
    carFoundResults: Car[];
}


export interface QuoteState {
    quotes: PageResponse<Quote>;
    quote: Quote;
    isFailed: boolean;
    carMakes: string[];
    carModels: string[];
    carFoundResults: Car[];
}


export interface RootState {
    form: any,
    app: AppState,
    user: User,
    carState: PageResponse<Car>;
    invoiceState: InvoiceState;
    quoteState: QuoteState;
    serviceIndices: ServiceIndex[];
    summaryReports: PageResponse<SummaryReport>;
}