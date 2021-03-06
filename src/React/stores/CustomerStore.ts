


export default class CustomerStore {
    customerId: number;
    fullName: string;
    company: string;
    phone: string;
    email: string;
    address: string;
    abn: string;

    constructor(){
       

        this.customerId = 0;
        this.fullName = '';
        this.company = '';
        this.phone = '';
        this.email = '';
        this.address = '';
        this.abn = '';
    }

}