import { IpcRenderer } from 'electron';
import React, { useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';


let ipcRenderer: IpcRenderer;
if (window.require) {
    const electron = window.require('electron');
    ipcRenderer = electron.ipcRenderer;
}


const ElectronRouterComp: React.FC = (props) => {
    const history = useHistory();

    /* Handle route from electron */
    useEffect(() => {
        if (ipcRenderer) {
            ipcRenderer.on('navigateTo', (evt, route) => {
                history.push(route);
            });
        }
    }, []);
    
    
    return null;
}

export const ElectronRouter = withRouter(ElectronRouterComp);