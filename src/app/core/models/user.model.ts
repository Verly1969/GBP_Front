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
export interface UserResponse {
    firstName: string;
    lastName:  string;
    email:     string;
    role:      string;
    status:    string;
}