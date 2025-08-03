import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenServiceService } from './authen-service.service';
import { tap } from 'rxjs';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
 const router =inject(Router);
  const serviceAuth = inject(AuthenServiceService);
  if(serviceAuth.isLoggin()){
    const cloneReq = req.clone({
     headers:req.headers.set('Authorization','Bearer ' + serviceAuth.getToken())
    })
    return next(cloneReq).pipe(
      tap({
        error:(err:any)=>{
          if(err.status ==401){
            setTimeout(() => {
              alert("Please login again");
            }, 1500);
            serviceAuth.deleteToken();
            router.navigateByUrl('/login');
          }
          else if(err.status ==403){
            alert("Oops! It seems you're not authorized to perform the action.");
          }
        }
      })
    );
  }
  else{
    return next(req);
  }
};
