import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard = () => {
  const router = inject(Router);
  if (sessionStorage.getItem('esAdmin') === 'true') {
    return true;
  }
  router.navigate(['/index']);
  return false;
};
