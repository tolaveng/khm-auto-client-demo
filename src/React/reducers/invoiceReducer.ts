import { InvoiceState } from "../types";

const initState: InvoiceState = {
    invoices: {
        data: [],
        hasNext: false,
        pageNumber: 0,
        pageSize: 50,
        totalCount: 0
    }
};


export default (state = initState, action: any) => {
    switch(action.type) {
        default:
        return state;
    }

}