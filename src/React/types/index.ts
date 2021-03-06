import { Invoice } from "./invoice";

interface AuthoriseState {

}


export interface InvoiceState {
    invoices: PageResponse<Invoice>;
}


export interface State {
    isLoading?: boolean
    auth: AuthoriseState,
    invoiceState: InvoiceState;
}