import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogon: boolean;
  isEnable: boolean = false;
  message: string;
  rform: FormGroup;
  isWaiting:boolean;
  constructor(private auth: AuthService,
              private router: Router,
              private _cookieService:CookieService) {
              
   }

  ngOnInit() {
    this.isWaiting =false;
    this.rform = new FormGroup({
      name: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      remember: new FormControl(null)
    });

    if(this._cookieService.get('remember')){
      this.rform.get('name').setValue(this._cookieService.get('username'));
      this.rform.get('password').setValue(this._cookieService.get('password'));
      this.rform.get('remember').setValue(this._cookieService.get('remember'));
   }

    this.isLogon = this.auth.isAuthenticated();
    if (this.isLogon) {
      this.router.navigate(['/home']);
      this.isWaiting =false;
    }
    this.auth.authChanged.subscribe(
      (x) => {
        this.isLogon = x;
        this.isEnable = false;
        if (this.isLogon) {
          this.router.navigate(['home']);
          this.isWaiting =false;
        }
      }
    );
    this.auth.authMsgChanged.subscribe(
      (x) => {
        this.message = x;
        this.isWaiting =false;
      }
    );
  }

  onSignin(form: FormGroup) {
    this.message = "";
    this.isWaiting =true;
    this.isEnable = true;
    const name = this.rform.get('name').value;
    const password = this.rform.get('password').value;
    const remember = this.rform.get('remember').value;
    this.auth.logIn(name, password);
    this._cookieService.set('username',name);
    this._cookieService.set('password',password);
    this._cookieService.set('remember',remember);
  }
}
