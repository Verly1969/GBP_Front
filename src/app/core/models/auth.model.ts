// Ce que l'on envoie pour le login
export interface LoginRequest {
    email:    string;
    password: string;
}

// Ce que l'on envoie pour la vérification 2FA
export interface TwoFactorRequest {
    email: string;
    code:  string;
}

// Ce que l'on reçoit de l'API
export interface LoginResponse {
    id                   : string;
    firstName            : string;
    lastName             : string;
    email                : string;
    role                 : string;
    accessToken          : string | null;
    accessTokenExpiration: string | null;
    twoFactorRequired    : boolean;
    isFirstLogin         : boolean;
    qrCodeUri            : string | null;
    secretKey            : string | null;
}