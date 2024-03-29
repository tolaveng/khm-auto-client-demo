import { Car } from "./car";
import { Service } from "./service";

export interface Invoice {
    invoiceId: number;
    invoiceNo: number;
    invoiceDate: string;
    modifiedDateTime?: string;
    paidDate?: string;
    paymentMethod: number;
    gst: number;
    note: string;
    odo: number;
    car: Car;
    fullName?: string;
    company?: string;
    phone?: string;
    email?: string;
    address?: string;
    abn?: string;
    services: Service[];
    userId: number;
    discount: number;
    archived?: boolean;
}