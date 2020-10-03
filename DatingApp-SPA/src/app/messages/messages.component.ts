import { PaginatedResult, Pagination } from './../_model/pagination';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { UserService } from './../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { Message } from './../_model/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';


  constructor(private userSerive: UserService,
              private authService: AuthService,
              private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages(){
     this.userSerive.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
                this.pagination.itemsPerPage,
                this.messageContainer)
                .subscribe((res: PaginatedResult<Message[]>) => {
                  this.messages = res.result;
                  this.pagination = res.pagination;
                }, error => {
                  this.alertify.error('Problem retrieving messages');
                });
  }

  pageChanged(event: any): void{
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number){
    this.alertify.confirm("Are you sure want to delete this message",() => {
      this.userSerive.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success('Message has been deleted');
      } , error => {
        this.alertify.error('Failed to delete the message');
      });
    });
  }
}
