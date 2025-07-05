import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
const router = inject(Router);

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken || refreshToken) {
    // Redirect to dashboard or home
    router.navigate(['/dashboard/home']); // change path if needed
    return false; // block access to login
  }

  return true; // 
};
