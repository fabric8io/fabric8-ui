import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthInterceptor } from './auth.interceptors';
import { HttpBackendClient, HttpClientService } from './http.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    HttpClientService,
    HttpBackendClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class PlannerHttpClientModule {}
