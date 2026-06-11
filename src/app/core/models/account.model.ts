export interface AccountResponse {
    id:            string;
    label:         string;
    number:        string | null;
    balance:       number;
    status:        string;
    accountType:   string;
    accountTypeId: number;
    createdAt:     string;
    updateAt:      string | null;
    updateBy:      string | null;
}

export interface AccountRequest {
    label:         string;
    number:        string | null;
    accountTypeId: number;
}