import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './services/authGuard/auth.guard';
import { OpenPostComponent } from './components/open-post/open-post.component';

const routes: Routes = [
  {
    path : '',
    component : HomeComponent,
    pathMatch : 'full'
  },
  {
    path : 'home',
    component : HomeComponent
  },
  {
    path : 'post/:id',
    component : OpenPostComponent
  },
  {
    path : 'log-in',
    component : LoginComponent 
  },
  {
    path : 'sign-up/:meta?',
    component : SignUpComponent 
  },
  {
    path : 'user/:id/:meta',
    component : ProfileComponent,
    canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
