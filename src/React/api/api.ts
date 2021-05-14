import axios, { AxiosResponse } from 'axios';
import { User } from '../components/users/types';
import { Car } from '../types/car';
import { Invoice } from '../types/invoice';
import { InvoiceFilter } from '../types/invoice-filter';
import { PageRequest } from '../types/page-request';
import { PageResponse } from '../types/page-response';
import { ResponseResult } from '../types/response-result';
import { ServiceIndex } from '../types/service-index';
import { SummaryReport } from '../types/summary-report';
import { SummaryReportFilter } from '../types/summary-report-filter';

export const KHM_JWT_TOKEN = 'KHM_JWT_TOKEN';

axios.defaults.baseURL = 'https://localhost:5001/api';
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
    loadServiceIndices: (): Promise<ServiceIndex[]> => requests.get<ServiceIndex[]>('invoice/getserviceindex'),
    getSummaryReport: (pageRequest: PageRequest, filter: SummaryReportFilter): Promise<PageResponse<SummaryReport>> => requests.getWithParams<PageResponse<SummaryReport>>('/invoice/getSummaryReport', {...pageRequest, ...filter}),
    downloadSummaryReport: (filter: SummaryReportFilter): Promise<AxiosResponse<Blob>> => requests.getBlobWithParams<Blob>('/invoice/downloadSummaryReport', {...filter}),
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

const backup = {

}

const Api = {
    invoice,
    user,
    car,
    backup
};

export default Api;
