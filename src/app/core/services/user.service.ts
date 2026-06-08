import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserUpdate, UserEmailUpdate, UserPasswordUpdate } from "../models/user.model";

@Injectable({ providedIn: 'root'})
export class UserService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = '/api';

    // Récupérer le profil sur base de l'email
    getProfil(email: string) {
        return this.http.get<UserUpdate>(`
            ${this.apiUrl}/user/profil?email=${email}`);
    }

    // Mettre à jour le profil
    // updateProfil(data: UserUpdate) {
    //     return this.http.put<User>(``);
    // }
}