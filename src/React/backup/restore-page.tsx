import React, { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { RouteComponentProps, useHistory } from 'react-router';
import { Button, Container, Grid, Segment } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import progressbar from '../assets/progressbar.gif';
import { KHM_JWT_TOKEN } from '../api/api';
import { number } from 'yup';


interface IProps extends RouteComponentProps {
    token: string
}

const hubUrl = process.env.REACT_APP_BAKUPHUB_URL ? process.env.REACT_APP_BAKUPHUB_URL : 'https://localhost:5001/backuphub';
const jobId = Date.now().toString();
let hubConnection : HubConnection;

const RestorePage: React.FC<IProps> = () => {
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processPercent, setProcessPercent] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const history = useHistory();

    const updateRestoreJob = (jobId: string, percent: number) => {
        setProcessPercent(percent);
    };
    const restoreFailedHander = (error: string) => {
        console.log('Restore Error:', error);
        setError('Something wrong restore failed.');
    };
    const restoreCompletedHander = () => {
        setError('');
        setIsProcessing(false);
        setProcessPercent(100);
    }

    useEffect(() => {
        const token = window.sessionStorage.getItem(KHM_JWT_TOKEN);
        if (!token) {
            history.push('/login')
        }

        hubConnection = new HubConnectionBuilder().withUrl(`${hubUrl}?JobId=${jobId}`, {
            accessTokenFactory: () => token!
        })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Debug)
            .build();

        // bind handler
        hubConnection.on('JobUpdate', updateRestoreJob);
        hubConnection.on('JobFailed', restoreFailedHander);
        hubConnection.on('JobCompleted', restoreCompletedHander);

        // start the connection
        hubConnection.start().then(_ => {
            console.log('Restore hub connected');
        }).catch(err => {
            console.log('Cannot connect to the restore hub:', err);
        });

        return (() => {
            // unbind
            hubConnection.off('JobUpdate', updateRestoreJob);
            hubConnection.off('JobFailed', restoreFailedHander);
            hubConnection.off('JobCompleted', restoreCompletedHander);

            // stop connection
            if (hubConnection && hubConnection.state === 'Connected') {
                hubConnection.stop().catch(err => {
                    console.log('Cannot stop connection from the hub:', err)
                })
            }
        });
    }, []);

    const restoreHandler = () => {
        if (!selectedFile) return;
        if (!hubConnection || hubConnection.state !== 'Connected') return;

        if (isProcessing) return;
        // NOTE: NOT allow to cancel
        // if (isProcessing) {
        //     hubConnection.invoke('StopRestoreJob', jobId).catch(err => {
        //         console.log('Cannot stop restore job:', err)
        //     })
        //     setIsProcessing(false);
        //     setProcessPercent(0);
        //     setError('Restore has been stopped.');
        //     return;
        // }

        if (!confirm(`Are you sure to retore ${selectedFile.name}? It may take long.`)) return;

        hubConnection.invoke('StartRestoreJob', jobId, selectedFile.path).catch(err => {
            console.log('Cannot start restore job:', err)
        })
        setIsProcessing(true);
    };

    const fileSelectHandler = (selectedFiles: FileList | null) => {
        if (!selectedFiles || selectedFiles.length == 0) return;
        const file = selectedFiles[0];
        let ext = "";
        if (file.name.lastIndexOf(".") > 0) {
            ext = file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length);
        }
        if (ext.toLowerCase() != "sql") {
            setError('Invalid data file.')
            return;
        }
        setError('')
        setSelectedFile(file);
    };

    return (
        <Container fluid>
            <HeaderLine label='Data' />
            <Grid relaxed='very'>
                <Grid.Column width={4}></Grid.Column>
                <Grid.Column width={8}>
                    <Segment style={{ minHeight: 250 }}>
                        <form>
                            <h4>Restore database from file: </h4>
                            {
                                !isProcessing && processPercent == 0 &&
                                <div>
                                    <div>
                                        <input type="file" multiple={false} accept=".sql"
                                            onChange={(e) => fileSelectHandler(e.target.files)} />
                                    </div>
                                    <br />
                                    <div>
                                        <Button color='red' onClick={restoreHandler} disabled={!selectedFile} >Restore database !</Button>
                                    </div>
                                </div>
                            }
                            {!!error && <div className="label" style={{ color: 'red' }} >{error}</div>}
                            {
                                !error && processPercent === 100 &&
                                <div>
                                    <span style={{ color: '#00aa00' }}>Restore completed: </span><br /><br /><br /><br /><br />
                                </div>
                            }
                            {
                                isProcessing &&
                                <div>
                                    <span style={{ color: 'red' }}>Restoring {processPercent} %. Do not close the app!</span>
                                    <img src={progressbar} alt='Processing...' title='Processing...' /><br />
                                </div>
                            }
                        </form>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        </Container>
    );
};

export default RestorePage;
