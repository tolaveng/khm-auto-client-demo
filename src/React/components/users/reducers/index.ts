import { UserLoginAction, UserActionTypes } from "../actions";
import { User } from "../types";

const initSate: User = {
    userId: 0,
    username: '',
    email: '',
    password: '',
    fullName: '',
    jwtToken: '',
    isAdmin: false,
    isCheckingUserSingIn: true,
}



export const UserReducer = (state: User = initSate, action: UserLoginAction): User => {
    switch (action.type) {
        case UserActionTypes.USER_LOGIN_SUCCESS:
            return {
                ...state, ...action.user, password: '', isCheckingUserSingIn: false
            }

        case UserActionTypes.USER_CHECK_SING_IN:
            return {
                ...state, isCheckingUserSingIn: true
            }

        case UserActionTypes.USER_CHECK_SING_IN_SUCCESS:
            return {
                ...state, isCheckingUserSingIn: false
            }

        default:
            return state;
    }
}
