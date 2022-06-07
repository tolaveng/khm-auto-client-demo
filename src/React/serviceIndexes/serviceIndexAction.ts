import { AnyAction, Dispatch } from "redux"
import { SET_APP_LOADING_ACTION, UNSET_APP_LOADING_ACTION } from "../actions"
import Api from "../api/api"
import { PageRequest } from "../types/page-request"
import { ServiceIndex } from "../types/service-index"

export const ServiceIndexActionType = {
    SERVICEINDEX_LOAD_SUCCESS: 'SERVICEINDEX_LOAD_SUCCESS',
    SERVICEINDEX_LOAD_FAILED: 'SERVICEINDEX_LOAD_FAILED',
    SERVICEINDEX_DELETE_SUCCESS: 'SERVICEINDEX_DELETE_SUCCESS',
    SERVICEINDEX_DELETE_FAILED: 'SERVICEINDEX_DELETE_FAILED',
    SERVICEINDEX_SAVE_SUCCESS: 'SERVICEINDEX_SAVE_SUCCESS',
    SERVICEINDEX_SAVE_FAILED: 'SERVICEINDEX_SAVE_FAILED',
}

export const loadServiceIndexes = (pageRequest: PageRequest, serviceName: string) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    
    try {
        const response = await Api.serviceIndex.findByServiceName(pageRequest, serviceName)
        dispatch({
            type: ServiceIndexActionType.SERVICEINDEX_LOAD_SUCCESS,
            payload: response
        })
    } catch (ex) {
        dispatch({
            type: ServiceIndexActionType.SERVICEINDEX_LOAD_FAILED,
        })
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}

export const deleteServiceIndex = (id: number, callback: () => void) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    
    try {
        await Api.serviceIndex.deleteServiceIndex(id)
        dispatch({
            type: ServiceIndexActionType.SERVICEINDEX_DELETE_SUCCESS,
            payload: id
        })
        if (callback) callback();
    } catch (ex) {
        dispatch({
            type: ServiceIndexActionType.SERVICEINDEX_DELETE_FAILED,
        })
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}

export const saveServiceIndex = (serviceIndex: ServiceIndex, callback: () => void) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    
    try {
        await Api.serviceIndex.saveServiceIndex(serviceIndex)
        dispatch({
            type: ServiceIndexActionType.SERVICEINDEX_SAVE_SUCCESS,
            payload: serviceIndex
        })
        if (callback) callback();
    } catch (ex) {
        dispatch({
            type: ServiceIndexActionType.SERVICEINDEX_SAVE_FAILED,
        })
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}