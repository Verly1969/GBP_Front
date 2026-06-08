export interface UserUpdate {
    firstname: string;
    lastname:  string;
}

export interface UserEmailUpdate {
    email: string;
}

export interface UserPasswordUpdate {
    oldPassword: string;
    newPassword: string;
}