import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreditTypeRequest, CreditTypeResponse } from '../models/credit-type.model';

@Injectable({
  providedIn: 'root',
})
export class CreditTypeService {

  private readonly http = inject(HttpClient);
  private readonly urlApi = '/api/credittype';

  getAll() {

    return this.http.get<CreditTypeResponse[]>(this.urlApi);
  }

  getById(id: number) {

    return this.http.get<CreditTypeResponse>(`${this.urlApi}/${id}`);
  }

  create(request: CreditTypeRequest) {

    return this.http.post<CreditTypeResponse>(`${this.urlApi}`, request);
  }

  update(id: number, request: CreditTypeRequest) {

    return this.http.put<CreditTypeResponse>(`${this.urlApi}/${id}`, request);
  }

  delete(id: number) {

    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }
  
}
