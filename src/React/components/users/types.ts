export interface User {
    userId: number;
    username: string,
    email: string,
    password: string,
    fullName: string,
    jwtToken: string,
    isAdmin: boolean,
    isCheckingUserSingIn?: boolean
}