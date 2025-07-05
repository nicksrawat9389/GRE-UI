import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent,
    canActivate:[authGuard]
  },
  {
    path:'otp',
    component:OtpComponent,
    canActivate:[authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
