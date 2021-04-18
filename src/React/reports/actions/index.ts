import { AnyAction, Dispatch } from "redux";
import Api from "../../api/api";
import { SET_APP_LOADING_ACTION, UNSET_APP_LOADING_ACTION } from "../../actions";
import { PageRequest } from "../../types/page-request";
import { SummaryReportFilter } from "../../types/summary-report-filter";
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";

export const SummaryReportActionType = {
    LOAD_REPORT_SUCCESS: 'LOAD_REPORT_SUCCESS',
    LOAD_REPORT_FAILED: 'LOAD_REPORT_FAILED',
    DOWNLOAD_REPORT_FAILED: 'DOWNLOAD_REPORT_FAILED',
    DOWNLOAD_REPORT_REQUEST: 'DOWNLOAD_REPORT_REQUEST',
    DOWNLOAD_REPORT_SUCCESS: 'DOWNLOAD_REPORT_SUCCESS'
}

export const loadSummaryReport = (pageRequest: PageRequest, filter: SummaryReportFilter) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SET_APP_LOADING_ACTION
    })
    
    try {
        const response = await Api.invoice.getSummaryReport(pageRequest, filter)
        dispatch({
            type: SummaryReportActionType.LOAD_REPORT_SUCCESS,
            payload: response
        })
    } catch (ex) {
        console.log('load report error', ex);
        dispatch({
            type: SummaryReportActionType.LOAD_REPORT_FAILED,
        })
    }
    dispatch({
        type: UNSET_APP_LOADING_ACTION
    })
}

export const downloadSummaryReport = (filter: SummaryReportFilter) => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    dispatch({
        type: SummaryReportActionType.DOWNLOAD_REPORT_REQUEST
    })
    
    try {
        const response = await Api.invoice.downloadSummaryReport(filter)

        let filename = response.headers['content-disposition']
          .split(';')
          .find((n: string) => n.includes('filename='))
          .replace('filename=', '')
          .trim();

        if (filename === '') {
            filename = 'Report.xlsx';
        }

        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

        // const link = document.createElement('a');
        // link.href = downloadUrl;
        // link.setAttribute('download', filename);
        // document.body.appendChild(link);
        // link.click();
        // link.parentNode?.removeChild(link);
        saveAs(downloadUrl, filename);
        dispatch({
            type: SummaryReportActionType.DOWNLOAD_REPORT_SUCCESS
        })
    } catch (ex) {
        console.log('download report error', ex);
        dispatch({
            type: SummaryReportActionType.DOWNLOAD_REPORT_FAILED,
        })
        toast.error("Cannot download report.");
    }
}