import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AnyAction } from 'redux';
import { SubmissionError } from 'redux-form';
import { ThunkDispatch } from 'redux-thunk';
import { Container, Grid } from 'semantic-ui-react';
import { RootState } from 'src/React/types/root-state';
import { HeaderLine } from '../HeaderLine';
import { userLogin } from './actions';
import LoginForm from './LoginForm';
import { User } from './types';

interface StateProps {
    isLoading?: boolean,
    user: User
}

interface DispatchProps {
    actions: {
        login: (username: string, password: string) => Promise<boolean>,
    }
}


type Props = StateProps & DispatchProps;

const LoginPageComp: React.FC<RouteComponentProps & Props> = (props) => {

    const {actions, history, isLoading} = props;

    const login = async (username: string, password: string) => {
        const success = await actions.login(username, password);
        if (!success) {
            //toast.error('Login failed. Please check username and password.');
            return Promise.reject('Login failed. Please check username and password.');
        }
        history.push('/invoice');
    }


    return (
        <Container fluid>
            <HeaderLine label='KHM Auto' />
            <Grid relaxed='very'>
                <Grid.Column width={4}></Grid.Column>
                <Grid.Column width={8}>
                    <LoginForm onSubmit={login} isLoading={isLoading}/>
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        </Container>
    );
};

const mapStateToProps = (state: RootState): StateProps => ({
    user: state.user,
    isLoading: state.app.isAppLoading?? false,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, unknown, AnyAction>): DispatchProps => ({
    actions: {
        //login: bindActionCreators(userLogin, dispatch),
        login: async (username, password): Promise<boolean> => {
           return await dispatch(userLogin(username, password));
        }
    },
});

export const LoginPage = connect(mapStateToProps, mapDispatchToProps)(LoginPageComp);
