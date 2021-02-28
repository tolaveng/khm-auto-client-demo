import {makeAutoObservable} from 'mobx'


export default class ServiceStore {
    serviceId: number;
    serviceName: string;
    servicePrice: number;
    serviceQty: number;
    invoiceId: number;

    constructor() {
        makeAutoObservable(this);

        this.serviceId = 0;
        this.invoiceId = 0;
        this.serviceName = '';
        this.serviceQty = 0;
        this.servicePrice = 0;
    }

    

}