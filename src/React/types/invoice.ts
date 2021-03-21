import { Car } from "./car";
import { Service } from "./service";

export interface Invoice {
    invoiceId: number;
    invoiceNo: number;
    invoiceDateTime: Date;
    modifiedDateTime?: Date;
    isPaid: boolean;
    paidDate?: Date;
    paymentMethod: number;
    gst: number;
    note: string;
    odo: number;
    car: Car;
    fullName: string;
    company?: string;
    phone: string;
    email?: string;
    address?: string;
    abn?: string;
    services: Service[];
    userId: number;
    archived?: boolean;
}