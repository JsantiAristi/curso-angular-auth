import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '@services/token.service';

export const redirectGuard: CanActivateFn = () => {
  const isValidRefreshToken = inject(TokenService).isValidRefreshToken();
  const router = inject(Router);

  if (isValidRefreshToken) {
    router.navigate(['/app']);
  }
  return true;
};
