import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  
  const router = inject(Router);
  const isLoginrequest = req.url.includes('/Auth/login');

  return next(req)
    .pipe(catchError((error: HttpErrorResponse) => {
      let message = "Une erreur est survenue";

      switch(error.status) {
        case 0:
          // Pas de connexion réseau
          message = isLoginrequest
            ? 'Serveur inaccessible'
            : 'Impossible de contacter le serveur';
          router.navigate(['./accueil']);
          break;

        case 401:
          // Non-autorisé
          message = isLoginrequest
            ? 'Entrée interdite - Contactez l\'administrateur'
            : 'Session expirée - reconnectez-vous';
            router.navigate(['./accueil']);
          break;

        case 500:
          // Erreur serveur
          message = 'Erreur serveur';
          router.navigate(['./accueil']);
          break;

        default:
          message = "Une erreur inattendue est survenue";
          router.navigate(['./accueil']);
          break;
      }

      // afficher le toast
      toast.error(message);

      // afficher l'erreur en console
      console.error(`[HTTP error: ${error.status}]`, message, error);

      // propager l'erreur dans tout le programme
      return throwError(() => new Error(message));
    } ))
};
