import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserResponse } from "../models/user.model";

@Injectable({ providedIn: 'root'})
export class UserService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = '/api/user';

    getAll() {
        return this.http.get<UserResponse[]>(this.apiUrl);
    }

    changeStatus(email: string) {
        return this.http.patch(
            `${this.apiUrl}/${email}/status`,
            {} // body vide - pas de données à envoyer
        )
    }
}