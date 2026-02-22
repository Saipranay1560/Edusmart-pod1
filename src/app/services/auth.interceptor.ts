import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('token') : null;

  // Skip adding token for login/signup endpoints
  if (token && !req.url.includes('/api/auth/')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};