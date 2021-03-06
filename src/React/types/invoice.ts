import { Car } from "./car";
import { Customer } from "./customer";
import { Service } from "./service";

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
    car?: Car;
    customerId: number;
    customer?: Customer;
    services?: Service[];
    userId: number;
    archived?: boolean;
}