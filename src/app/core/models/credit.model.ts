export interface CreditResponse {

    id: string;
    amount: number;
    interestRate: number;
    durationMonths: number;
    startDate: Date;
    endDate: Date | null;
    status: string;
    raison: string | null;
    previousCreditId: string | null;
    accountId: string;
    accountLabel: string |null;
    creditTypeId: number;
    creditType: string;
}

export interface CreditRequest {

    amount: number;
    interestRate: number;
    durationMonths: number;
    startDate: Date;
    raison: string | null;
    creditTypeId: number;
    previousCreditId: string | null;
}