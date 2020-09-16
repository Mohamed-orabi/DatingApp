import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from '../_model/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  changeMemberphoto(photoUrl: string){
    this.photoUrl.next(photoUrl);
  }

  login(model: any){
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((respnse: any) => {
        const user = respnse;
        if (user){
          localStorage.setItem('token' , user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMemberphoto(this.currentUser.photoUrl);
        }
      })
    )}

  register(model: any){
    return this.http.post(this.baseUrl + 'register', model);
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
  
}
