import { UserInfo } from './../../shared/model';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PasswordValidation } from '../services/PasswordValidation';


@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css']
})
export class ChangepassComponent implements OnInit {

  isLogon: boolean;
  isEnable: boolean = false;
  message: string;
  rform: FormGroup;
  
  constructor(private auth: AuthService,
              private router: Router,
              fb: FormBuilder) {
      this.rform = fb.group({
        name: ['', Validators.required],
        password: ['', Validators.required],
        newpass1: ['', Validators.required],
        newpass2: ['', Validators.required]
      },
      {
        validator: PasswordValidation.MatchPassword // your validation method
      });
   }

  ngOnInit() {
    
  }

  onSignin(form: FormGroup) {
    this.isEnable = true;
    const name = this.rform.get('name').value;
    const password = this.rform.get('password').value;
    const password1 = this.rform.get('newpass1').value;
    const password2 = this.rform.get('newpass2').value;
   
    let user:UserInfo = new UserInfo();
    this.message ="";
     user.name = name;
     user.access =password;
     user.fullname = password2;
     this.auth.changePassword(user).subscribe(
       (x)=>{
         let resp =x.json();
         if (resp.ok=="yes"){
           this.rform.reset();           
           this.message = "Successfully changed password.";
           let token =JSON.parse(resp.data);
           this.auth.afterChangePass(name,token);
           this.router.navigate["/main"];
         }else{
           this.message =resp.error;
         }
       }
     )
  }
}
