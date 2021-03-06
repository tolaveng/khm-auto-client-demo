import axios, { AxiosResponse } from 'axios';
import { Invoice } from '../types/invoice';

axios.defaults.baseURL = 'https://localhost:5001/api';


const responseData = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string, ) => axios.get<T>(url).then(responseData),
    getWithParams: <T>(url: string, params: {}) => axios.get<T>(url, params).then(responseData),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseData),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseData),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseData),
};

const Invoices = {
    getAll: () => requests.get<PageResponse<Invoice>>('/invoice/getall'),
    getAllPaged: (pageRequest: PageRequest) => requests.getWithParams<PageResponse<Invoice>>('/invoice/getall', {params:{...pageRequest}}),
    getInvoice: (invoiceId: number) => requests.get<Invoice>(`/invoice/${invoiceId}`),
    create: (invoice: Invoice) => requests.post<Invoice>('/invoice/create', invoice),
    update: (invoice: Invoice) => requests.post<Invoice>('/invoice/update', invoice)
};

const Api = {
    Invoices,
};

export default Api;
