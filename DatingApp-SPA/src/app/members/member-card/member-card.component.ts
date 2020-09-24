import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { User } from './../../_model/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {

  @Input() User: User;
  constructor(private authService: AuthService,
              private userService: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(id: number){
    this.userService.SendLike(this.authService.decodedToken.nameid,id).subscribe(data => {
      this.alertify.success('You have liked: ' + this.User.knownAs);
    }, error => {
      this.alertify.error('You already like this user');
    })
  }

}
