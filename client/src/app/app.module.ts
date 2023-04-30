import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PostComponent } from './components/post/post.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth/auth.service';
import { HomeService } from './services/home/home.service';
import { AuthGuard } from './services/authGuard/auth.guard';
import { TokenInterceptorService } from './services/interceptor/token-interceptor.service';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarService } from './services/navbar/navbar.service';
import { PostService } from './services/post/post.service';
import { GroupService } from './services/group/group.service';
import { OpenPostComponent } from './components/open-post/open-post.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    PostComponent,
    HomeComponent,
    ProfileComponent,
    OpenPostComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  
  providers: [
    AuthService,
    HomeService,
    AuthGuard,
    NavbarService,
    PostService,
    GroupService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
