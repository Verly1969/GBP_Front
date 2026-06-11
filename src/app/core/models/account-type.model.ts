export interface AccountTypeResponse {

    id:          number;
    name:        string;
    description: string | null;
}

export interface AccountTypeRequest {

    name:        string;
    description: string | null;
}