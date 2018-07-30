import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { ApiServicesService } from '../services/api-services.service';
import { RefItems, RegisterProfile } from '../../shared/model';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  profile:RegisterProfile;
  profileForm:FormGroup;
  state:string[] = [];
  compType:string[] = [];  
  faCoffee = faQuestionCircle;
  subscription: Subscription; 
  errmsg:string;

  constructor(private formBuilder: FormBuilder,
              private translate:TranslateService,
              private apiser:ApiServicesService ) { }

  ngOnInit() {
    this.createFormControls();
    this.subscription=this.apiser.getStateRef()
    .subscribe(
      (resp)=>{
        console.log(resp);
        this.populateRefArray(resp);
      }
    )
  }
  
  populateRefArray(data:RefItems[]){
    this. createFormControls();
    data.filter(x=>x.refType=="state")
        .forEach(x=>this.state.push(x.code));    
  }
  
  createFormControls(){
    this.profileForm = this.formBuilder.group({
      CompanyName:  new FormControl('',Validators.required),      
      RegNo:  new FormControl(''),
      Address1:  new FormControl('',Validators.required),
      Address2:  new FormControl('',Validators.required),
      AddrCity:  new FormControl(''),
      AddrState:  new FormControl('',Validators.required),
      Postcode:  new FormControl('',Validators.required),
      ContactPIC:  new FormControl('',Validators.required),
      Email:  new FormControl('',[Validators.required,Validators.email]),
      OfficePhone:  new FormControl(''),
      Handphone:  new FormControl('',Validators.required),
      AboutUs:  new FormControl('',Validators.required)
    });
  }

  getFormControlVal(){
    this.profile.companyName= this.profileForm.get('CompanyName').value;
    this.profile.regNo = this.profileForm.get('RegNo').value;
    this.profile.address1=this.profileForm.get('Address1').value;
    this.profile.address2=this.profileForm.get('Address2').value;
    this.profile.addrCity = this.profileForm.get('AddrCity').value;
    this.profile.addrState= this.profileForm.get('AddrState').value;
    this.profile.postcode= this.profileForm.get('Postcode').value;
    this.profile.contactPIC= this.profileForm.get('ContactPIC').value;
    this.profile.email = this.profileForm.get('Email').value;
    this.profile.officePhone = this.profileForm.get('OfficePhone').value;
    this.profile.handphone = this.profileForm.get('Handphone').value;
    this.profile.aboutUs = this.profileForm.get('AboutUs').value;
  
  }

  ngOnDestroy() {
     this.subscription.unsubscribe();   
  }

  SaveReg(){
    this.profile = new RegisterProfile();
    this.getFormControlVal();
    this.apiser.saveRegister(this.profile)
    .subscribe(resp=>{
        if (resp.ok=="yes"){
          this.translate.get('register.success').subscribe((res: string) => {
            this.errmsg= res+resp.refno;
          });
          //this.errmsg ="Thank you for you registration. You will receive a confirmation email soon. Your Reference No:"+resp.refno;
        }else{
          this.translate.get('register.fail').subscribe((res: string) => {
            this.errmsg= res;
          });
        }
    });
  }
}
