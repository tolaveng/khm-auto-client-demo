import { Reducer } from "redux";
import { FormReducer } from "redux-form";
import { User } from "../components/users/types";
import { Invoice } from "./invoice";
import { PageResponse } from "./page-response";

export interface AppState {
    isAppLoading?: boolean,
    toastInfo?: string,
    toastError?: string
}


export interface InvoiceState {
    invoices: PageResponse<Invoice>;
    invoice: Invoice
}

export interface RootState {
    form: FormReducer,
    app: AppState,
    user: User,
    invoiceState: InvoiceState;
}