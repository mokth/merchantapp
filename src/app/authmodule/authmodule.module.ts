import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthmoduleRoutingModule } from './authmodule-routing.module';
import { LoginComponent } from './login/login.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { AuthcompComponent } from './authcomp.component';
import { LogoutComponent } from './logout/logout.component';
import { UserlistComponent } from './userlist/userlist.component';
import { DxDataGridModule, DxTemplateModule, DxSelectBoxModule } from 'devextreme-angular';
import { AdUserService } from './services/authservice';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { CookieService } from 'ngx-cookie-service';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxTemplateModule,
    DxSelectBoxModule,
    AuthmoduleRoutingModule,
    FontAwesomeModule,
    TranslateModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }), 
  ],
  declarations: [
    LoginComponent, 
    ChangepassComponent, 
    AuthcompComponent, 
    LogoutComponent, 
    UserlistComponent, ForgotPassComponent
  ],
  providers: [
    AdUserService,
    CookieService     
   ],
})
export class AuthmoduleModule { }
