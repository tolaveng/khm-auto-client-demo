
import { Invoice } from './types/invoice';
import Api from '../api/api';
import { Service } from './types/service';
import { TableEditorDataRow } from '../components/table-editor/type';

export default class InvoiceStore {
    invoices: Invoice[] = [];
    editMode = false;
    isLoading = false;
    invoice: Invoice;
    
    constructor() {
        
        
        this.invoice = {
            invoiceId:0,
            invoiceNo: 0,
            invoiceDateTime: new Date(),
            modifiedDateTime: new Date(),
            isPaid: false,
            paidDate: new Date(),
            paymentMethod: 0,
            gst: 10,
            note: '',
            odo: 0,
            carId: 0,
            customerId: 0,
            userId: 0,
            services: [],
        };
    }

    setLoading = (isLoading: boolean) => {
        this.isLoading = isLoading;
    }

    setInvoiceDate = (date: any) => {
        this.invoice.invoiceDateTime = date;
    }

    setPaymentMethod = (paymentMethod: number) => {
        this.invoice.paymentMethod = paymentMethod;
    }

    setInvoice = (invoice: Invoice) => {
        this.invoice = invoice;
    }

    createInvoice = async (invoice: Invoice) => {
        this.setLoading(true);
        try {
            const newInvoice = await Api.Invoices.create(invoice);
            
                this.invoice = newInvoice;
            
        } catch (ex) {
            console.log('invoice store error', ex);
        }
        this.setLoading(false);
    };

    deleteInvoice = () => {};

    updateInvoice = async (invoice: Invoice) => {
        this.setLoading(true);
        try {
            const updateInvoice = await Api.Invoices.update(invoice);
            console.log('newInvoice', updateInvoice);
            this.invoice = updateInvoice;
        } catch (ex) {
            console.log('invoice store error', ex);
        }
        this.setLoading(false);
    };

    loadInvoice = async (invoiceId: number) => {
        this.setLoading(true);
        try {
            const invoice = await Api.Invoices.getInvoice(invoiceId);
            this.setInvoice(invoice);
            this.setLoading(false);
        } catch (ex) {
            console.log('invoice store error', ex);
        }
        this.setLoading(false);
    };

    fetchInvoices = async (pageRequest: PageRequest) => {
        this.setLoading(true);
        try {
            const response = await Api.Invoices.getAllPaged(pageRequest);
            
                this.invoices = response.data;
            
        } catch (ex) {
            console.log('invoice store error', ex);
        }
        this.setLoading(false);
    };

    // Services
    get getServiceData() : TableEditorDataRow[] {
        if (!this.invoice.services) return [];
        const serviceData = this.invoice.services.map(sv => {
            let total = (sv.servicePrice * sv.serviceQty).toFixed(2);
            return {
                id: sv.serviceId,
                 cells: [sv.serviceName, sv.servicePrice.toFixed(2), sv.serviceQty, total]
            };
        });
        return serviceData;
    }

    addService(serviceId: number, serviceData: any[]) {
        if (!serviceData[0] || !serviceData[1] || !serviceData[2]) return;

        const services: Service[] = [ ...this.invoice.services!, {
            invoiceId: this.invoice.invoiceId,
            serviceId: serviceId,
            serviceName: serviceData[0],
            servicePrice: serviceData[1],
            serviceQty: serviceData[2]
        }];
        this.invoice.services = services;
    }

    updateService(serviceId: number, serviceData: any[]) {
        if (!serviceData[0] || !serviceData[1] || !serviceData[2]) return;
        const service = this.invoice.services!.find(sv => sv.serviceId == serviceId);
        if (!service) return;
        service.serviceName = serviceData[0];
        service.servicePrice = serviceData[1];
        service.serviceQty = serviceData[2];
    }

    deleteService(serviceId: number) {
        const services = this.invoice.services?.filter(sv => sv.serviceId != serviceId);
        this.invoice.services = services;
    }

    get grandTotal() {
        if (!this.invoice.services) return 0;
        let sum = 0;
        this.invoice.services!.forEach(service => {
            sum += (service.servicePrice * service.serviceQty);
        })
        return sum;
    }

    get gstTotal() {
        if (!this.invoice.services) return 0;
        const gst = !this.invoice.gst ? 10: Number(this.invoice.gst);
        return this.grandTotal / (1 + gst);
    }

    get subTotal() {
        return this.grandTotal - this.gstTotal;
    }
}
