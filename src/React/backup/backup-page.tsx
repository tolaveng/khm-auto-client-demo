import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Container, Grid, Segment } from 'semantic-ui-react';
import { KHM_JWT_TOKEN } from '../api/api';
import { HeaderLine } from '../components/HeaderLine';
import progressbar from '../assets/progressbar.gif';
import { IpcRenderer } from 'electron';

declare global {
    interface Window {
      require: (module: 'electron') => {
        ipcRenderer: IpcRenderer
      };
    }
  }
  
const { ipcRenderer } = window.require('electron');

interface IProps extends RouteComponentProps {
    token: string
}

interface IStates {
    processPercent: number,
    isError: boolean,
    isProcessing: boolean,
    isCancel: boolean,
    filePath: string
}

class BackUpComp extends React.PureComponent<IProps, IStates> {
    private hubUrl = 'https://localhost:5001/backuphub';
    private token: string | null;
    private jobId: string;
    private hubConnection: HubConnection | null = null;


    constructor(props: IProps) {
        super(props);
        this.state = {
            processPercent: 0,
            isError: false,
            isProcessing: false,
            isCancel: false,
            filePath: '',
        };

        this.token = window.localStorage.getItem(KHM_JWT_TOKEN);
        this.jobId = Date.now().toString(),

            this.updateBackupJob = this.updateBackupJob.bind(this);
        this.stopConnection = this.stopConnection.bind(this);
        this.downloadHandler = this.downloadHandler.bind(this);
        this.backupHandler = this.backupHandler.bind(this);
        this.backupFailedHander = this.backupFailedHander.bind(this);
        this.backupCompletedHander = this.backupCompletedHander.bind(this);

        if (this.token) {
            this.hubConnection = new HubConnectionBuilder().withUrl(`${this.hubUrl}?JobId=${this.jobId}`, {
                accessTokenFactory: () => this.token!
            })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Debug)
                .build();
        }
    }


    componentDidMount(): void {
        const { history } = this.props;

        if (!this.token || !this.hubConnection) {
            history.push('/login')
        }

        this.hubConnection!.on('JobUpdate', this.updateBackupJob);
        this.hubConnection!.on('BackupFailed', this.backupFailedHander);
        this.hubConnection!.on('BackupCompleted', this.backupCompletedHander);


        this.hubConnection!.start().then(_ => {
            console.log('Backup hub connected');
        }).catch(err => {
            console.log('Cannot connect to the backup hub:', err);
            this.setState({ ...this.state, isError: true })
        });
    }

    componentWillUnmount(): void {
        if (this.hubConnection) {
            this.hubConnection.off('JobUpdate', this.updateBackupJob);
            this.hubConnection.off('BackupFailed', this.backupFailedHander);
            this.hubConnection.off('BackupCompleted', this.backupCompletedHander);

            setTimeout(() => {
                this.stopConnection();
            }, 200);
        }
    }

    updateBackupJob(jobId: string, percent: number): void {
        if (!this.state.isCancel) {
            this.setState({ ...this.state, processPercent: percent });
        }
    }

    stopConnection(): void {
        if (this.hubConnection && this.hubConnection.state === 'Connected') {
            this.hubConnection.stop().catch(err => {
                console.log('Cannot stop connection from the hub:', err)
            })
        }
    }

    backupFailedHander(error: string): void {
        console.log('Backup Error:', error);
        this.setState({ ...this.state, processPercent: 100, isError: true, isProcessing: false, filePath: '' })
    }

    backupCompletedHander(filePath: string): void {
        this.setState({ ...this.state, processPercent: 100, isError: false, isProcessing: false, filePath: filePath })
    }

    backupHandler(): void {
        const { isProcessing } = this.state;
        if (!this.hubConnection || this.hubConnection.state !== 'Connected') return;

        if (isProcessing) {
            this.hubConnection.invoke('StopBackupJob', this.jobId.toString()).catch(err => {
                console.log('Cannot stop backup job:', err)
            })
            this.setState({ ...this.state, isProcessing: false, processPercent: 0, isCancel: true });

        } else {
            this.hubConnection.invoke('StartBackupJob', this.jobId.toString()).catch(err => {
                console.log('Cannot start backup job:', err)
            })
            this.setState({ ...this.state, isProcessing: true, isCancel: false });
        }
    }

    downloadHandler(): void {
        const { filePath } = this.state;
        ipcRenderer.send('open-file-in-folder', filePath);
    }

    render() {
        const { processPercent, isError, isProcessing, filePath } = this.state;
        return (
            <Container fluid>
                <HeaderLine label='Data' />
                <Grid relaxed='very'>
                    <Grid.Column width={4}></Grid.Column>
                    <Grid.Column width={8}>
                        <Segment style={{ minHeight: 250 }}>
                            <h4>Backup database to file: </h4>
                            {
                                !isError && processPercent < 100 &&
                                <div>
                                    <Button color={isProcessing ? 'red' : 'green'} onClick={this.backupHandler}>
                                        {isProcessing ? "Cancel" : "Backup Now"}</Button>
                                </div>
                            }

                            {
                                !isError && processPercent === 100 &&
                                <div>
                                    <span style={{color: '#00aa00'}}>Backup completed: </span><b>{filePath}</b> <br /><br /><br />
                                    <Button color='blue' onClick={this.downloadHandler}>Open Backup</Button>
                                </div>
                            }

                            {
                                !isProcessing && isError && <div className="label" style={{ color: 'red' }} >Backup Error !</div>
                            }

                            {
                                isProcessing && processPercent < 100 &&
                                <div>
                                    <img src={progressbar} alt='Processing...' title='Processing...' />
                                </div>
                            }

                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={4}></Grid.Column>
                </Grid>
            </Container>
        );
    }
}

export const BackupPage = BackUpComp;