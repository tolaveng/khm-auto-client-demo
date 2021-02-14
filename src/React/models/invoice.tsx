export interface Invoice {
    invoiceId: number;
    invoiceNo: number;
    invoiceDateTime: Date;
    modifiedDateTime: Date;
    isPaid: boolean;
    paidDate: Date;
    paymentMethod: number;
    gst: number;
    note: string;
    odo: number;
    carId: number;
    customerId: number;
    userId: number;
    archived: boolean;
}