import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenServiceService } from './authen-service.service';

export const authguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenServiceService);
  const router = inject(Router);

  if(authService.isLoggin()){
    const claimReq = route.data['claimReq'] as Function;
    if(claimReq){
      const claims = authService.getclaims();
      if(!claimReq(claims)){
        router.navigateByUrl('/forbidden');
        return false;
      }
      return true;
    }
    return true;
  }
  else{
    router.navigateByUrl('/login');
    return false;
  }
 
};
