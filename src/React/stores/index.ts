import { createContext, useContext } from "react";
import Car from "./Car";
import Customer from "./Customer";
import Invoice from "./Invoice";
import Service from "./Service";

interface Store {
    invoice: Invoice;
    customer: Customer;
    car: Car;
    services: Service[];
}


export const store: Store = {
    invoice: new Invoice(),
    customer: new Customer(),
    car: new Car(),
    services: [new Service()]
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}