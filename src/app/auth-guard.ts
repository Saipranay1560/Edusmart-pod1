import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
 

  if (typeof window === 'undefined') {
    return false;
  }

  const role = window.localStorage.getItem('role');

  // Allowing access to login and signup without a role
  if (state.url === '/login' || state.url === '/signup') {
    return true;
  }

  if (role) {
    // Optional: Check if the user's role matches the required role for the route
    const expectedRole = route.data['role'] || route.parent?.data[role];
    if (!expectedRole) return true;
    
    if(role.toLowerCase() === expectedRole.toLowerCase()){
      return false
    }
     router.navigate(['/login']);
      return false;
    return true;
  }

  // If no role and trying to access a protected page, redirect to login
  router.navigate(['/login']);
  return false;
};