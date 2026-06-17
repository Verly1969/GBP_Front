import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CreditRequest, CreditResponse } from "../models/credit.model";

@Injectable({providedIn: 'root'})

export class CreditService {

    private readonly http = inject(HttpClient);
    private readonly urlApi = '/api/account/';

    getAll(accountId: string){
        return this.http.get<CreditResponse[]>(`${this.urlApi}${accountId}/credit`);
    }

    getById(accountId: string, creditId: string) {
        return this.http.get<CreditResponse>(`${this.urlApi}${accountId}/credit/${creditId}`);
    }

    create(accountId: string, request: CreditRequest) {
        return this.http.post<CreditResponse>(`${this.urlApi}${accountId}/credit`, request);
    }

    update(accountId: string, creditId: string, request: CreditRequest) {
        return this.http.put<CreditResponse>(`${this.urlApi}${accountId}/credit/${creditId}`, request);
    }

    delete(accountId: string, creditId: string) {
        return this.http.delete<void>(`${this.urlApi}${accountId}/credit/${creditId}`);
    }
}