import { Car } from './types/car';
import { Customer } from './types/customer';
import { makeAutoObservable, runInAction } from 'mobx';
import { Invoice } from './types/invoice';
import Api from '../api/api';

export default class InvoiceStore {
    invoices: Invoice[] = [];
    editMode = false;
    isLoading = true;
    invoice: Invoice | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setLoading = (isLoading: boolean) => {
        this.isLoading = isLoading;
    }

    addInvoice = () => {};

    deleteInvoice = () => {};

    updateInvoice = () => {};

    fetchInvoices = async (pageRequest: PageRequest) => {
        this.setLoading(true);
        try {
            const response = await Api.Invoices.getAllPaged(pageRequest);
            console.log('response', response.data);
            runInAction(() => {
                this.invoices = response.data;
            });
        } catch (ex) {
            console.log('invoice store error', ex);
        }
        this.setLoading(false);
    };
}
