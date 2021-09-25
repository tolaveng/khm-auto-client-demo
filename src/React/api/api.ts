import axios, { AxiosResponse } from 'axios';
import { User } from '../components/users/types';
import { Car } from '../types/car';
import { Company } from '../types/company';
import { Invoice } from '../types/invoice';
import { InvoiceFilter } from '../types/invoice-filter';
import { PageRequest } from '../types/page-request';
import { PageResponse } from '../types/page-response';
import { Quote } from '../types/quote';
import { ResponseResult } from '../types/response-result';
import { ServiceIndex } from '../types/service-index';
import { SummaryReport } from '../types/summary-report';
import { SummaryReportFilter } from '../types/summary-report-filter';
import { SummaryReportTotal } from '../types/summary-report-total';

export const KHM_JWT_TOKEN = 'KHM_JWT_TOKEN';

axios.defaults.baseURL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'https://localhost:5001/api';
axios.defaults.timeout = 0; //no timeout

axios.interceptors.request.use((config) => {
    const token = window.sessionStorage.getItem(KHM_JWT_TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, error => {
    return Promise.reject(error);
});



const responseData = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string, ) => axios.get<T>(url).then(responseData),
    getWithParams: <T>(url: string, params: any) => axios.get<T>(url, {params: {...params}}).then(responseData),
    getBlobWithParams: <T>(url: string, params: any) => axios.get<T>(url, {params: {...params}, responseType: 'blob'}),
    post: <T>(url: string, body: any) => axios.post<T>(url, body).then(responseData),
    put: <T>(url: string, body: any) => axios.put<T>(url, body).then(responseData),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseData),
};

const invoice = {
    getAll: (): Promise<PageResponse<Invoice>> => requests.get<PageResponse<Invoice>>('/invoice/getall'),
    getAllPaged: (pageRequest: PageRequest, filter?: InvoiceFilter): Promise<PageResponse<Invoice>> => requests.getWithParams<PageResponse<Invoice>>('/invoice/getall', {...pageRequest, ...filter}),
    getInvoice: (invoiceId: number): Promise<Invoice> => requests.get<Invoice>(`/invoice/${invoiceId}`),
    deleteInvoice: (invoiceId: number): Promise<void> => requests.delete(`/invoice/${invoiceId}`),
    create: (invoice: Invoice): Promise<ResponseResult> => requests.post<ResponseResult>('/invoice/create', invoice),
    update: (invoice: Invoice): Promise<ResponseResult> => requests.post<ResponseResult>('/invoice/update', invoice),
    loadServiceIndices: (serviceName: string): Promise<ServiceIndex[]> => requests.getWithParams<ServiceIndex[]>('invoice/getserviceindex', {serviceName}),
    getSummaryReport: (pageRequest: PageRequest, filter: SummaryReportFilter): Promise<PageResponse<SummaryReport>> => requests.getWithParams<PageResponse<SummaryReport>>('/invoice/getSummaryReport', {...pageRequest, ...filter}),
    downloadSummaryReport: (filter: SummaryReportFilter): Promise<AxiosResponse<Blob>> => requests.getBlobWithParams<Blob>('/invoice/downloadSummaryReport', {...filter}),
    getSummaryReportTotal: (filter: SummaryReportFilter): Promise<SummaryReportTotal> => requests.getWithParams<SummaryReportTotal>('/invoice/getSummaryReportTotal', {...filter}),
    fromQuote: (quoteId: number): Promise<Invoice> => requests.get<Invoice>(`/invoice/fromquote/${quoteId}`),
};


const quote = {
    getAll: (): Promise<PageResponse<Quote>> => requests.get<PageResponse<Quote>>('/quote/getall'),
    getAllPaged: (pageRequest: PageRequest, filter?: InvoiceFilter): Promise<PageResponse<Quote>> => requests.getWithParams<PageResponse<Quote>>('/quote/getall', {...pageRequest, ...filter}),
    getQuote: (quoteId: number): Promise<Quote> => requests.get<Quote>(`/quote/${quoteId}`),
    deleteQuote: (quoteId: number): Promise<void> => requests.delete(`/quote/${quoteId}`),
    create: (quote: Quote): Promise<ResponseResult> => requests.post<ResponseResult>('/quote/create', quote),
    update: (quote: Quote): Promise<ResponseResult> => requests.post<ResponseResult>('/quote/update', quote),
    loadServiceIndices: (): Promise<ServiceIndex[]> => requests.get<ServiceIndex[]>('invoice/getserviceindex'),
};


const company = {
    get: (): Promise<Company> => requests.get<Company>('/company'),
    update: (company: Company): Promise<ResponseResult> => requests.post<ResponseResult>('/company/updatecompany', company),
};


const user = {
    login: (username: string, password: string): Promise<ResponseResult<User>> => requests.post<ResponseResult<User>>('/user/login', {username, password}),
    current: (): Promise<User> => {
        const token = window.sessionStorage.getItem(KHM_JWT_TOKEN);
        if (!token) {
            return Promise.reject('Token is not found');
        }
        return requests.get<User>('/user/currentuser')
    }
}

const car = {
    getAllPaged: (pageRequest: PageRequest, filter?: any): Promise<PageResponse<Car>> => requests.getWithParams<PageResponse<Car>>('/car/getall', {...pageRequest, ...filter}),
    findCars: (carNo: string): Promise<PageResponse<Car>> => {
        const pageRequest: PageRequest = {
            PageNumber: 1, PageSize: 100
        };
        const filter = {
            CarNo: carNo
        }
        return requests.getWithParams<PageResponse<Car>>('/car/getall', {...pageRequest, ...filter})
    },
    loadCarMakes: (): Promise<string[]> => requests.get<string[]>('/car/getmakes'),
    loadCarModels: (): Promise<string[]> => requests.get<string[]>('/car/getmodels'),
}

const Api = {
    invoice,
    quote,
    user,
    car,
    company,
};

export default Api;
