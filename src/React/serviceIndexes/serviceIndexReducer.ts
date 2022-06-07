import { AnyAction } from "redux"
import { PageResponse } from "../types/page-response"
import { ServiceIndex } from "../types/service-index"
import { ServiceIndexActionType } from "./serviceIndexAction"

const initState: PageResponse<ServiceIndex> = {
    data: [],
    hasNext: false,
    pageNumber: 1,
    pageSize: 50,
    totalCount: 0
}

export const ServiceIndexReducer = (state = initState, action: AnyAction) => {
    switch (action.type) {
        case ServiceIndexActionType.SERVICEINDEX_LOAD_SUCCESS:
            return {...action.payload}
            
        default:
            return state;
    }
}