import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpContext
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { TokenService } from '@services/token.service';
import { AuthService } from '@services/auth.service';

const CHECK_TOKEN = new HttpContextToken<boolean>( () => false );

export function checkToken(){
	return new HttpContext().set(CHECK_TOKEN, true)
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.context.get(CHECK_TOKEN)) {
      return this.addToken(request, next);
    } else {
      return this.updateAccessToken(request, next);
    }
  }

  private addToken(request: HttpRequest<unknown>, next: HttpHandler){
    const accessToken = this.tokenService.getToken();
    if (accessToken) {
      const authRequest = request.clone({
        //Setear los headers, para no borrar los que ya tiene, si no agregar otro más
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(authRequest);
    } else {
      return next.handle(request);
    }
  }

  private updateAccessToken(request: HttpRequest<unknown>, next: HttpHandler){
    const refreshToken = this.tokenService.getRefreshToken();
    const isValidRefreshToken = this.tokenService.isValidRefreshToken();
    if( refreshToken && isValidRefreshToken){
      return this.authService.refreshToken(refreshToken).pipe(
        switchMap( () => this.addToken(request, next))
      )
    }
    return next.handle(request);
  }
}
