import { makeObservable, observable, action } from 'mobx';

export default class Car {
    carId: number;
    plateNo: string;
    carMake: string;
    carModel: string;
    carYear: number;
    odo: number;

    constructor() {
        this.carId = 0;
        this.plateNo = '';
        this.carMake = '';
        this.carModel = '';
        this.carYear = 0;
        this.odo = 0;
        
        makeObservable(this, {
            carId: observable,
            plateNo: observable,
            carModel: observable,
            carMake: observable,
            carYear: observable,
            odo: observable,
        });

    }
}
