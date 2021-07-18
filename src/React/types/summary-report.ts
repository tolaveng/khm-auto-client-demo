export interface SummaryReport {
    invoiceNo: number;
    invoiceDate: string;
    services: string;
    subTotal: number;
    discount: number;
    amountTotal: number;
    gstTotal: number;
}