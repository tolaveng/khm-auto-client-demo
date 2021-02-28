import { createContext, useContext } from "react";
import CarStore from "./CarStore";
import CustomerStore from "./CustomerStore";
import InvoiceStore from "./InvoiceStore";
import ServiceStore from "./ServiceStore";

interface Store {
    invoiceStore: InvoiceStore;
    customerStore: CustomerStore;
    carStore: CarStore;
    serviceStore: ServiceStore;
}


export const store: Store = {
    invoiceStore: new InvoiceStore(),
    customerStore: new CustomerStore(),
    carStore: new CarStore(),
    serviceStore: new ServiceStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}