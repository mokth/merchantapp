import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { AuthcompComponent } from './authcomp.component';
import { LogoutComponent } from './logout/logout.component';
import { UserlistComponent } from './userlist/userlist.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { AuthguardService } from '../shared/AuthguardService';

const routes: Routes = [
  { path: '',  component: AuthcompComponent  },
  { path: 'login',  component: LoginComponent },
  { path: 'logout',  component: LogoutComponent },
  { path: 'change',  component: ChangepassComponent },
  { path: 'users',  component:  UserlistComponent,canActivate: [AuthguardService]  },
  { path: 'forgot',  component:  ForgotPassComponent} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthmoduleRoutingModule { }
