import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
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
    const token = window.localStorage.getItem(KHM_JWT_TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    // config.transformRequest = [function (data, headers) {
    //     Date.prototype.toJSON = function() {
    //         //return moment('2020-02-01').format('YYYY-MM-DD');
    //         return '2020-02-02'
    //     }
    //     return JSON.stringify(data);
    //   }];
    // config.paramsSerializer = function (params) {
    //     console.log('param', params);
    //     return JSON.stringify(params);
    // };
    return config;
}, error => {
    return Promise.reject(error);
});

// const token = window.localStorage.getItem(KHM_JWT_TOKEN);
// const axiosClient = axios.create({
//     //withCredentials: true,

//     headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//     },
//     transformRequest: [function (data) {
//         Date.prototype.toJSON = function () {
//             return moment(this, 'yyyy-MM-dd').format('YYYY-MM-DD');
//           }
//           data = JSON.stringify(data)
//           console.log('date', data)
//           return data
//     }]
// });

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
    create: (invoice: Invoice): Promise<ResponseResult> => requests.post<ResponseResult>('/invoice/create', invoice),
    update: (invoice: Invoice): Promise<ResponseResult> => requests.post<ResponseResult>('/invoice/update', invoice),
    loadServiceIndices: (): Promise<ServiceIndex[]> => requests.get<ServiceIndex[]>('invoice/getserviceindex'),
    getSummaryReport: (pageRequest: PageRequest, filter: SummaryReportFilter): Promise<PageResponse<SummaryReport>> => requests.getWithParams<PageResponse<SummaryReport>>('/invoice/getSummaryReport', {...pageRequest, ...filter}),
    downloadSummaryReport: (filter: SummaryReportFilter): Promise<AxiosResponse<Blob>> => requests.getBlobWithParams<Blob>('/invoice/downloadSummaryReport', {...filter}),
};

const user = {
    login: (username: string, password: string): Promise<ResponseResult<User>> => requests.post<ResponseResult<User>>('/user/login', {username, password}),
    current: (): Promise<User> => requests.get<User>('/user/currentuser')
}

const car = {
    getAllPaged: (pageRequest: PageRequest, filter?: any): Promise<PageResponse<Car>> => requests.getWithParams<PageResponse<Car>>('/car/getall', {...pageRequest, ...filter}),
}

const Api = {
    invoice,
    user,
    car,
};

export default Api;
