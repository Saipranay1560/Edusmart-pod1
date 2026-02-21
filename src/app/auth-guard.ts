import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // const router = inject(Router);

  // // Check if running in a browser environment to access localStorage
  // if (typeof window === 'undefined') {
  //   return false;
  // }

  // const role = window.localStorage.getItem('role');

  // // Allowing access to login and signup without a role
  // if (state.url === '/login' || state.url === '/signup') {
  //   return true;
  // }

  // if (role) {
  //   // Check if the user's role matches the required role for the current route or parent route
  //   const expectedRole = route.data['role'] || route.parent?.data['role'];

  //   // If no specific role is required for the route, allow access
  //   if (!expectedRole) return true;

  //   // If the user's role matches the expected role (case-insensitive)
  //   if (role.toLowerCase() === expectedRole.toLowerCase()) {
  //     return true; // Fixed: Allow access if roles match
  //   }

  //   // Role mismatch: redirect to login
  //   router.navigate(['/login']);
  //   return false;
  // }

  // // If no role is found and trying to access a protected page, redirect to loginnn
  // router.navigate(['/login']);
  return true;
};
