import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter   } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptorInterceptor } from './Service/authen/auth-interceptor.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })
            , provideRouter(routes)
            ,provideHttpClient(withInterceptors([authInterceptorInterceptor]))
            ,provideHttpClient(withFetch())
            ,provideAnimationsAsync()
            ,provideToastr(),
          ]
};
