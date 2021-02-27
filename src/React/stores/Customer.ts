import { makeAutoObservable } from "mobx";


export default class Customer {
    customerId: number;
    fullName: string;
    company: string;
    phone: string;
    email: string;
    address: string;
    abn: string;

    constructor(){
        makeAutoObservable(this);

        this.customerId = 0;
        this.fullName = '';
        this.company = '';
        this.phone = '';
        this.email = '';
        this.address = '';
        this.abn = '';
    }

}