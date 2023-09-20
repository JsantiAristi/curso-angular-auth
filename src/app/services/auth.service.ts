import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { switchMap, tap } from 'rxjs/operators';
import { TokenService } from '@services/token.service';
import { ResponseLogin } from '@models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.API_URL;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string){
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/login`, {email, password}).pipe(
      tap( response => {
        this.tokenService.saveToken(response.acces_token)
      })
    );
  }

  logout(){
    this.tokenService.removeToken();
  }

  register(email: string, password: string, name: string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`, {email, password, name})
  }

  registerAndLogin(email: string, password: string, name: string){
    return this.register(name, email, password).pipe(
      switchMap( () => this.login(email, password))
    )
  }

  isAvailable(email: string){
    return this.http.post<{isAvailable:boolean}>(`${this.apiUrl}/api/v1/auth/is-available`, {email})
  }

  recovery(email: string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/recovery`, {email})
  }

  changePassword(token: string, newPassword: string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/change-password`, {token, newPassword})
  }
}
