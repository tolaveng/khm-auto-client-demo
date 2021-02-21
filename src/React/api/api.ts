import axios, { AxiosResponse } from 'axios';
import { Invoice } from '../models/invoice';

axios.defaults.baseURL = 'https://localhost:5001/api';

interface pageResponse<T = any>
{
    data: T[],
    hasNext: boolean,
    pageNumber: number,
    pageSize: number,
    totalCount: number
}

const responseData = <pageResponse>(response: AxiosResponse<pageResponse>) => response.data;

const requests = {
    get: <pageResponse>(url: string) => axios.get<pageResponse>(url).then(responseData),
    getWithParams: <pageResponse>(url: string, params: {}) => axios.get<pageResponse>(url, params).then(responseData),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseData),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseData),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseData),
};

const Invoices = {
    list: () => requests.get<pageResponse<Invoice>>('/invoice/getall'),
    listPaged: (pageRequest: {}) => requests.getWithParams<pageResponse<Invoice>>('/invoice/getall', {params:{...pageRequest}}),
};

const agent = {
    Invoices,
};

export default agent;
