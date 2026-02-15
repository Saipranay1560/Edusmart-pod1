import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window === 'undefined') {
    return false;
  }

  const role = window.localStorage.getItem('role');
  const expectedRole = route.data['role'];

  console.log(`[AuthGuard] Navigating to: ${state.url}`);
  console.log(`[AuthGuard] User Role: ${role || 'None'}`);
  console.log(`[AuthGuard] Required Role: ${expectedRole || 'Any'}`);

  // Allow access to login/signup
  if (state.url === '/login' || state.url === '/signup') {
    console.log('[AuthGuard] Access granted: Public page');
    return true;
  }

  if (role) {
    // If no specific role is required, allow any logged-in user
    if (!expectedRole) {
      console.log('[AuthGuard] Access granted: No specific role required');
      return true;
    }

    // Check if role matches
    if (role.toLowerCase() === expectedRole.toLowerCase()) {
      console.log('[AuthGuard] Access granted: Role matches');
      return true;
    }

    console.warn('[AuthGuard] Access denied: Role mismatch');
  } else {
    console.warn('[AuthGuard] Access denied: No role found in localStorage');
  }

  router.navigate(['/login']);
  return false;
};