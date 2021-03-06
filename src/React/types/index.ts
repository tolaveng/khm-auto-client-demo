import { Invoice } from "./invoice";

interface AuthoriseState {

}

export interface InvoiceState {
    isLoading? : boolean;
    invoices: PageResponse<Invoice>;
}

export interface State {
    auth: AuthoriseState,
    invoiceState: InvoiceState;
}