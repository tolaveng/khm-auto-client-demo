import { Dispatch } from "react-redux";
import { AnyAction } from "redux";

export const BackupActionType = {
    INIT_BACKUP : 'INIT_BACKUP'
}

export const CreateHubConnection = (string JobId) => async(dispatch: Dispatch<AnyAction>):Promise<void> => {
    dispatch({
        type: BackupActionType.INIT_BACKUP
    });

    
};