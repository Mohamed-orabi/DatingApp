import { catchError } from 'rxjs/Operators';
import { Observable , of } from 'rxjs';
import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { User } from './../_model/user';
import { Injectable } from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';

@Injectable()

export class MemberListResolver implements Resolve<User[]> {

    constructor(private userService: UserService,
                private router: Router,
                private alertify: AlertifyService ){}


    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
       return this.userService.getUsers().pipe(
           catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/members']);
                return of(null);
           })
       );
    }

}