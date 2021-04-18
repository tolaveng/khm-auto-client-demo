import { AnyAction } from "redux"
import { SummaryReport } from "src/React/types/summary-report"
import { PageResponse } from "../../types/page-response"
import { SummaryReportActionType } from "../actions"

const initState: PageResponse<SummaryReport> = {
    data: [],
    hasNext: false,
    pageNumber: 1,
    pageSize: 50,
    totalCount: 0
}

export const SummaryReportReducer = (state = initState, action: AnyAction) => {
    switch (action.type) {
        case SummaryReportActionType.LOAD_REPORT_SUCCESS:
            return {
                ...state,
                data: action.payload.data,
                hasNext: action.payload.hasNext,
                pageNumber: action.payload.pageNumber,
                pageSize: action.payload.pageSize,
                totalCount: action.payload.totalCount,
                error: ''
            }

        case SummaryReportActionType.LOAD_REPORT_FAILED:
            return { ...state, error: 'Cannot load reports' }

        case SummaryReportActionType.DOWNLOAD_REPORT_FAILED:
            return { ...state, error: 'Cannot download reports', isDownloading: false }

        case SummaryReportActionType.DOWNLOAD_REPORT_SUCCESS:
            return { ...state, error: '', isDownloading: false }

        case SummaryReportActionType.DOWNLOAD_REPORT_REQUEST:
            return { ...state, error: '', isDownloading: true }

        default:
            return state
    }
}