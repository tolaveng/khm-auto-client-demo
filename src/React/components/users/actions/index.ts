import { Dispatch, AnyAction, Action } from "redux";
import Api, { KHM_JWT_TOKEN } from "../../../api/api";
import { SET_APP_LOADING_ACTION, UNSET_APP_LOADING_ACTION } from "../../../actions";
import { User } from "../types";
import { ThunkAction } from "redux-thunk";
import { RootState } from "src/React/types/root-state";

export const UserActionTypes = {
    USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
    USER_CHECK_SING_IN: 'USER_CHECK_SING_IN',
    USER_CHECK_SING_IN_SUCCESS: 'USER_CHECK_SING_IN_SUCCESS'
}



export type UserLoginAction = Action & {
    type: typeof UserActionTypes,
    user: User
}



export const userLogin = (username: string, password: string): ThunkAction<Promise<boolean>, RootState, unknown, AnyAction> =>
    async (dispatch): Promise<boolean> => {

        function onSuccess(user: User) {
            dispatch({ type: UserActionTypes.USER_LOGIN_SUCCESS, user: user });
            dispatch({ type: UNSET_APP_LOADING_ACTION });
            return true;
        }

        function onError() {
            dispatch({ type: UNSET_APP_LOADING_ACTION });
            return false;
        }

        dispatch({ type: SET_APP_LOADING_ACTION })

        try {
            const result = await Api.user.login(username, password);
            if (result.success && result.data) {
                //window.localStorage.setItem(KHM_JWT_TOKEN, result.data.jwtToken);
                window.sessionStorage.setItem(KHM_JWT_TOKEN, result.data.jwtToken);
                const loggedInUser: User = {
                    userId: result.data.userId,
                    username: result.data.username,
                    email: result.data.email,
                    password: '',
                    fullName: result.data.fullName,
                    jwtToken: result.data.jwtToken,
                    isAdmin: result.data.isAdmin,
                    refreshToken: result.data.refreshToken,
                };
                
                return onSuccess(loggedInUser);
                
            } else {
                console.log('User login error ', result.debugMessage);
                return onError();
            }
        } catch (e) {
            console.log("User login error ", e);
            return onError();
        }
    }

    export const userLogout = () => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
        dispatch({ type: SET_APP_LOADING_ACTION })
        window.sessionStorage.removeItem(KHM_JWT_TOKEN);
        dispatch({ type: UNSET_APP_LOADING_ACTION })
    }

    export const checkUserSingedIn = () => async (dispatch: Dispatch<AnyAction>): Promise<void> => {
        dispatch({ type: UserActionTypes.USER_CHECK_SING_IN});
        try{
            const user = await Api.user.current();
            if (user && user.userId) {
                dispatch({ type: UserActionTypes.USER_LOGIN_SUCCESS, user: user });
            } else {
                console.log('Check user signed in error. No user found', user);
            }
        } catch (e) {
            console.log('Check user signed in error', e);
        }
        dispatch({ type: UserActionTypes.USER_CHECK_SING_IN_SUCCESS});
    }