import { Action, AnyAction, Dispatch } from 'redux';
import Api from '../../api/api';
import { Quote } from '../../types/quote';
import { SET_APP_LOADING_ACTION, UNSET_APP_LOADING_ACTION } from '../../actions';
import { PageRequest } from 'src/React/types/page-request';
import { PageResponse } from 'src/React/types/page-response';
import { ResponseResult } from 'src/React/types/response-result';
import { InvoiceFilter } from 'src/React/types/invoice-filter';
import { Car } from 'src/React/types/car';
import { toast } from 'react-toastify';

export const QuoteActionTypes = {
    LOAD_QUOTE_REQUEST: 'LOAD_QUOTE_REQUEST',
    LOAD_QUOTES_SUCCESS: 'LOAD_QUOTES_SUCCESS',
    LOAD_QUOTE_SUCCESS: 'LOAD_QUOTE_SUCCESS',
    LOAD_QUOTES_FAILED: 'LOAD_QUOTES_FAILED',
    LOAD_QUOTE_FAILED: 'LOAD_QUOTE_FAILED',
    MAKE_NEW_QUOTE: 'MAKE_NEW_QUOTE',
    UPDATE_QUOTE: 'UPDATE_QUOTE',
    LOAD_SERVICEINDEX_SUCCESS: 'LOAD_SERVICEINDEX_SUCCESS',

    FIND_CAR_REQUEST: 'FIND_CAR_REQUEST',
    FIND_CAR_SUCCESS: 'FIND_CAR_SUCCESS',
    FIND_CAR_FAILED: 'FIND_CAR_FAILED',
    CAR_MAKE: 'CAR_MAKE',
    CAR_MODEL: 'CAR_MODEL'
}


export type LoadQuoteAction = Action & {
    type: typeof QuoteActionTypes,
    quotes: PageResponse<Quote>
    quote: Quote,
    carMakes: string[],
    carModels: string[],
    carFoundResults: Car[]
}


export const loadQuotes = (pageRequest: PageRequest, filter?: InvoiceFilter) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    try {
        const quotes = await Api.quote.getAllPaged(pageRequest, filter)
        dispatch({
            type: QuoteActionTypes.LOAD_QUOTES_SUCCESS,
            quotes: quotes
        })
    } catch (ex) {
        console.log('Cannot load quotes', ex);
        dispatch({
            type: QuoteActionTypes.LOAD_QUOTES_FAILED,
        })
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
};


export const loadQuote = (quoteId: number) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: QuoteActionTypes.LOAD_QUOTE_REQUEST
    })
    try {
        const quote = await Api.quote.getQuote(quoteId)
        dispatch({
            type: QuoteActionTypes.LOAD_QUOTE_SUCCESS,
            quote
        });
    } catch (ex) {
        console.log('Cannot load quote', ex);
        dispatch({
            type: QuoteActionTypes.LOAD_QUOTE_FAILED,
        })
    }
};


export const makeNewQuote = () => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: QuoteActionTypes.MAKE_NEW_QUOTE
    })
}


export const saveQuote = (quote: Quote, callback: (result: ResponseResult) => void) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    
    try {
        let result: ResponseResult;
        if (quote.quoteId && quote.quoteId > 0) {
            result = await Api.quote.update(quote);
            if(result && result.success) {
                dispatch({
                    type: QuoteActionTypes.UPDATE_QUOTE,
                    quote: quote
                })
            }
        } else {
            result = await Api.quote.create(quote);
            if (result && result.success && result.data) {
                dispatch({
                    type: QuoteActionTypes.UPDATE_QUOTE,
                    quote: result.data
                })
            }
        }
        // callback
        if (result && result.success) {
            callback(result);
        } else {
            console.log("Cannot save quote: ", result.debugMessage);
            if (result) {
                callback({code: result.code, success: false, message: 'Unexpected error'});
            } else {
                callback({success: false, message: 'Unexpected error'});
            }
        }
        dispatch({
            type: UNSET_APP_LOADING_ACTION
        })
    } catch (e) {
        callback({success: false, message: 'Unexpected error'});
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}


export const loadServiceIndices = () => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    const results = await Api.quote.loadServiceIndices()
    if (results) {
        dispatch({
            type: QuoteActionTypes.LOAD_SERVICEINDEX_SUCCESS,
            payload: results
        })
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}

export const findCars = (carNo: string, callback: (car: Car[]) => void) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    
    try {
        const response = await Api.car.findCars(carNo)
        dispatch({
            type: QuoteActionTypes.FIND_CAR_SUCCESS,
            carFoundResults: response.data
        })
        if (callback) callback(response.data);
    } catch (ex) {
        dispatch({
            type: QuoteActionTypes.FIND_CAR_FAILED,
        })
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}

export const loadCarMakes = () => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    try {
        const response = await Api.car.loadCarMakes()
        dispatch({
            type: QuoteActionTypes.CAR_MAKE,
            carMakes: response
        })
    } catch {
       // ignored
    }
}

export const loadCarModels = () => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    try {
        const response = await Api.car.loadCarModels()
        dispatch({
            type: QuoteActionTypes.CAR_MODEL,
            carModels: response
        })
    } catch {
       // ignored
    }
}

export const deleteQuote = (quoteId: number) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    try {
        await Api.quote.deleteQuote(quoteId);
    } catch {
        toast.error("Cannot delete the quote")
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}