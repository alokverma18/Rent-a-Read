import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const jwtToken = getJwtToken();

  if (jwtToken) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('JWT_TOKEN');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};

function getJwtToken(): string | null {
  const tokens: string | null = localStorage.getItem('JWT_TOKEN');
  if (!tokens) return null;
  
  try {
    const parsedTokens = JSON.parse(tokens);
    return parsedTokens.access_token;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    localStorage.removeItem('JWT_TOKEN');
    return null;
  }
}
