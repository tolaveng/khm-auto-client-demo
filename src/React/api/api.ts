import axios, { AxiosResponse } from 'axios';
import { User } from '../components/users/types';
import { Invoice } from '../types/invoice';
import { PageRequest } from '../types/page-request';
import { PageResponse } from '../types/page-response';
import { ResponseResult } from '../types/response-result';

export const KHM_JWT_TOKEN = 'KHM_JWT_TOKEN';

axios.defaults.baseURL = 'https://localhost:5001/api';

axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem(KHM_JWT_TOKEN);
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
    getWithParams: <T>(url: string, params: any) => axios.get<T>(url, params).then(responseData),
    post: <T>(url: string, body: any) => axios.post<T>(url, body).then(responseData),
    put: <T>(url: string, body: any) => axios.put<T>(url, body).then(responseData),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseData),
};

const invoice = {
    getAll: (): Promise<PageResponse<Invoice>> => requests.get<PageResponse<Invoice>>('/invoice/getall'),
    getAllPaged: (pageRequest: PageRequest): Promise<PageResponse<Invoice>> => requests.getWithParams<PageResponse<Invoice>>('/invoice/getall', {params:{...pageRequest}}),
    getInvoice: (invoiceId: number): Promise<Invoice> => requests.get<Invoice>(`/invoice/${invoiceId}`),
    create: (invoice: Invoice): Promise<ResponseResult> => requests.post<ResponseResult>('/invoice/create', invoice),
    update: (invoice: Invoice): Promise<ResponseResult> => requests.post<ResponseResult>('/invoice/update', invoice)
};

const user = {
    login: (username: string, password: string): Promise<ResponseResult<User>> => requests.post<ResponseResult<User>>('/user/login', {username, password}),
    current: (): Promise<User> => requests.get<User>('/user/currentuser')
}


const Api = {
    invoice,
    user,
};

export default Api;
