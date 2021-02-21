import { Car } from "./car";
import { Customer } from "./customer";

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
    car: Car;
    customerId: number;
    customer: Customer;
    userId: number;
    archived: boolean;
}