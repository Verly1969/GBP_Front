export interface CreditTypeResponse {

    id:          number;
    name:        string;
    description: string | null;
}

export interface CreditTypeRequest {

    name: string;
    description: string | null;
}