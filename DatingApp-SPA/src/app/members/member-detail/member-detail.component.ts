import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_model/user';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs') memberTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService
              , private alertify: AlertifyService 
              , private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });


    // this.route.queryParams.subscribe(params => {
    //   const selTab = params['tab'];
    //   this.memberTabs.tabs[selTab].active = true;
    //   console.log(selTab);
    // });



    // console.log(this.route.snapshot.queryParamMap.get('tab'));

    this.galleryOptions = [
      {
          width: '600px',
          height: '600px',
          imagePercent:100,
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          preview: false
      }
    ];

    this.galleryImages = this.getImages();

  }

  getImages(){
    const imageUrls = [];
    for (const photo of this.user.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    }

    return imageUrls;
  }
  // loadUser(){
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) =>{
  //     this.user = user;
  //   }, error => {
  //     this.alertify.error(error);
  //   })
  // }

  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }

  // selectTab2(){
  //   const selTab = this.route.snapshot.queryParamMap.get('tab');
  //   this.memberTabs.tabs[selTab].active = true;
  // }
}
