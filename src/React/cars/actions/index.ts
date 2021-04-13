import { AnyAction, Dispatch } from "redux";
import { PageRequest } from "../../types/page-request";
import { SET_APP_LOADING_ACTION, UNSET_APP_LOADING_ACTION } from "../../actions";
import Api from "../../api/api";

export const CarActionType = {
    LOAD_CARS_SUCCESS: 'LOAD_CARS_SUCCESS',
    LOAD_CARS_FAILED: 'LOAD_CARS_FAILED',
}

export const loadCars = (pageRequest: PageRequest, filter?: any) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    
    try {
        const response = await Api.car.getAllPaged(pageRequest, filter)
        dispatch({
            type: CarActionType.LOAD_CARS_SUCCESS,
            playload: response
        })
    } catch (ex) {
        dispatch({
            type: CarActionType.LOAD_CARS_FAILED,
        })
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}