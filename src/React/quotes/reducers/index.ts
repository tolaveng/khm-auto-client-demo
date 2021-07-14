import { QuoteState } from '../../types/root-state';
import { QuoteActionTypes, LoadQuoteAction } from '../actions';
import { Car } from '../../types/car';
import { Quote } from 'src/React/types/quote';


const initQuote: Quote = {
    quoteId: 0,
    quoteDate: new Date().toISOString(),
    modifiedDateTime: new Date().toISOString(),
    note: '',
    odo: 0,
    fullName: '',
    phone: '',
    car: {} as Car,
    userId: 0,
    services: [],
    discount: 0
};


const initState: QuoteState = {
    isLoading: false,
    quotes: {
        data: [],
        hasNext: false,
        pageNumber: 1,
        pageSize: 50,
        totalCount: 0,
    },
    quote: initQuote,
    isFailed: false,
    carMakes: [],
    carModels: [],
    carFoundResults: []
};


export const quoteReducer = (state = initState, action: LoadQuoteAction): QuoteState => {
    switch (action.type) {
        case QuoteActionTypes.LOAD_QUOTE_REQUEST:
            return { ...state, isLoading: true };

        case QuoteActionTypes.LOAD_QUOTES_SUCCESS:
            return { ...state, quotes: action.quotes, isFailed: false };

        case QuoteActionTypes.LOAD_QUOTE_SUCCESS:
            return { ...state, quote: action.quote, isFailed: false, isLoading: false };

        case QuoteActionTypes.LOAD_QUOTES_FAILED:
        case QuoteActionTypes.LOAD_QUOTE_FAILED:
            return { ...state, isFailed: true, isLoading: false };

        case QuoteActionTypes.MAKE_NEW_QUOTE:
            return { ...state, quote: initQuote, isFailed: false, isLoading: false };

        case QuoteActionTypes.UPDATE_QUOTE:
            return { ...state, quote: action.quote, isFailed: false };

        case QuoteActionTypes.FIND_CAR_REQUEST:
            return { ...state };

        case QuoteActionTypes.FIND_CAR_SUCCESS:
            return { ...state, carFoundResults: action.carFoundResults };

        case QuoteActionTypes.FIND_CAR_FAILED:
            return { ...state };

        case QuoteActionTypes.CAR_MAKE:
            return { ...state, carMakes: action.carMakes };

        case QuoteActionTypes.CAR_MODEL:
            return { ...state, carModels: action.carModels };
        default:
            return state;
    }
};
