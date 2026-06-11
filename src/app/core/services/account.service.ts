import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AccountRequest, AccountResponse } from "../models/account.model";

@Injectable({ providedIn: 'root' })

export class AccountService {

    private readonly http   = inject(HttpClient);
    private readonly apiUrl = '/api/account';

    getAll() {
        return this.http.get<AccountResponse[]>(this.apiUrl);
    }

    getById(id: string) {
        return this.http.get<AccountResponse>(`${this.apiUrl}/${id}`);
    }

    create(request: AccountRequest) {
        return this.http.post<AccountResponse>(this.apiUrl, request);
    }

    update(id: string, request: AccountRequest) {
        return this.http.put<AccountResponse>(`${this.apiUrl}/${id}`, request);
    }

    delete(id: string) {
        return this.http.delete<AccountResponse>(`${this.apiUrl}/${id}`);
    }
}