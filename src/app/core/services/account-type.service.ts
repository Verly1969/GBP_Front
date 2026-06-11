import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountTypeRequest, AccountTypeResponse } from '../models/account-type.model';

@Injectable({
  providedIn: 'root',
})
export class AccountTypeService {
  
  private readonly http   = inject(HttpClient);
  private readonly apiUrl = '/api/accounttype';

  getAll() {
    return this.http.get<AccountTypeResponse[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<AccountTypeResponse>(`${this.apiUrl}/${id}`);
  }

  create(request: AccountTypeRequest) {
    return this.http.post<AccountTypeResponse>(this.apiUrl, request);
  }

  update(id: number, request: AccountTypeRequest) {
    return this.http.put<AccountTypeResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
