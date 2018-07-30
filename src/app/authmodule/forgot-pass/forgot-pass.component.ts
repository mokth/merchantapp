import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent implements OnInit {

  message: string;
  rform: FormGroup;

  constructor(private auth: AuthService,
              private router: Router,
             ) {              
   }

  ngOnInit() {
    this.rform = new FormGroup({
      name: new FormControl(null, Validators.required)
    
    });
    
  }

  onSignin(form: FormGroup) { 
    const name = this.rform.get('name').value;
    this.auth.resetPassword(name).subscribe(
      (resp:any)=>{
          console.log(resp);
      }
    )
  }

}
