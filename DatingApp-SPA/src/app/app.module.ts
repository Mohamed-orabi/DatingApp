// import { FileUploadModule } from 'ng2-file-upload';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
// import { NgxGalleryModule } from 'ngx-gallery';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import {FileUploadModule} from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {TimeAgoPipe} from 'time-ago-pipe';


import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import {AuthService} from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import {ErrorInterceptorProvider} from './_services/error.interceptor';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { UserService } from './_services/user.service';
import {MemberDetailComponent} from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberCardComponent } from './members/member-card/member-card.component';
import {MemberEditResolver} from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';
import { ListsResolver } from './_resolvers/lists.resolver';

// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({
  name: 'timeAgo',
  pure: false
})

export class TimeAgoExtendsPipePipe extends TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    return super.transform(value);
  }
}


export function tokenGetter(){
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TimeAgoExtendsPipePipe
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    BrowserAnimationsModule,
    // NgxGalleryModule,
    NgxGalleryModule ,
    FileUploadModule,
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:5000'],
        disallowedRoutes: ['localhost:5000/api/auth']

      }
    })
  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider,
    UserService,
    MemberDetailResolver,
    MemberListResolver,
    MemberEditResolver,
    PreventUnsavedChanges,
    ListsResolver,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
