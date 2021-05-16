import { Car } from "./car";
import { Service } from "./service";

export interface Quote {
    quoteId: number;
    quoteDate: string;
    modifiedDateTime?: string;
    note: string;
    odo: number;
    car: Car;
    fullName: string;
    company?: string;
    phone?: string;
    email?: string;
    address?: string;
    abn?: string;
    services: Service[];
    userId: number;
    discount: number;
}