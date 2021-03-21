import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { LoaderSpinner } from './components/LoaderSpinner';
import { checkUserSingedIn } from './components/users/actions';
import { User } from './components/users/types';
import { RootState } from './types/root-state';


interface StateProps {
    user: User,
    isCheckingUserSingIn: boolean
}

interface DispatchProps {
    actions: {
        checkUserSingedIn: () => void;
    }
}


interface Props extends RouteProps, StateProps, DispatchProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}


const AuthRouteComp: React.FC<Props> = (props) => {
    const { component: Component, actions, user, ...rest } = props;

    useEffect(() => {
        actions.checkUserSingedIn();
    }, []);


    return (
        <>
            { user.isCheckingUserSingIn && <LoaderSpinner style={{ width: '100%', height: '100%' }} />}
            {
                !user.isCheckingUserSingIn &&
                <Route {...rest} render={rProps => user && user.userId
                    ? <Component {...rProps} />
                    : <Redirect to='/login' />
                } />
            }
        </>
    );
}

const mapStateToProps = (state: RootState): StateProps => {
    return (
        {
            user: state.user,
            isCheckingUserSingIn: state.user.isCheckingUserSingIn ?? false
        }
    );
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => ({
    actions: {
        checkUserSingedIn: bindActionCreators(checkUserSingedIn, dispatch)
    }
})


export const AuthRoute = connect(mapStateToProps, mapDispatchToProps)(AuthRouteComp);
