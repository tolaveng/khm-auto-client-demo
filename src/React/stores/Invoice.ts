import { Car } from './types/car';
import { Customer } from './types/customer';
import { makeObservable, observable, action } from 'mobx';

export default class Invoice {
    invoiceId: number;
    invoiceNo: number;
    invoiceDateTime: Date | string;
    modifiedDateTime: Date | string;
    isPaid: boolean;
    paidDate: Date | string;
    paymentMethod: number;
    gst: number;
    note: string;
    odo: number;
    carId: number;
    car: Car | null;
    customerId: number;
    customer: Customer | null;
    userId: number;
    archived: boolean;
    isLoading: boolean = true;

    constructor() {
        
        this.invoiceId = 0;
        this.invoiceNo = 0;
        this.invoiceDateTime = new Date().toLocaleDateString();
        this.modifiedDateTime = new Date().toLocaleDateString();
        this.isPaid = false;
        this.paidDate = new Date().toLocaleDateString();
        this.paymentMethod = 0;
        this.gst = 0;
        this.note = '';
        this.odo = 0;
        this.carId = 0;
        this.car = null;
        this.customerId = 0;
        this.customer = null;
        this.userId = 0;
        this.archived = false;


        makeObservable(this, {
            invoiceId: observable,
            invoiceNo: observable,
            invoiceDateTime: observable,
            modifiedDateTime: observable,
            isPaid: observable,
            paidDate: observable,
            paymentMethod: observable,
            gst: observable,
            note: observable,
            odo: observable,
            carId: observable,
            car: observable,
            customerId: observable,
            customer: observable,
            userId: observable,
            archived: observable,
        });
    }
}
