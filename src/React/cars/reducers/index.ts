import { AnyAction } from "redux"
import { Car } from "src/React/types/car";
import { PageResponse } from "src/React/types/page-response";
import { CarActionType } from "../actions"



const initState: PageResponse<Car> = {
    data: [],
    hasNext: false,
    pageNumber: 1,
    pageSize: 50,
    totalCount: 0
}

export const CarReducer = (state = initState, action: AnyAction) => {
    switch (action.type) {
        case CarActionType.LOAD_CARS_SUCCESS:
            return { ...action.playload }


        default:
            return state
    }
}