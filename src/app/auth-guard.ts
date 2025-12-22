import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
 
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
 

  if (typeof window === 'undefined') {
    return false;
  }
 
  const role = window.localStorage.getItem('role');
 
  if (role) {
    return true;
  }
 
  router.navigate(['/login']);
  return false;
};