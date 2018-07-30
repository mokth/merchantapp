import { Merchant } from './../../../shared/model';
import { Component, OnInit } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ApiServicesService } from '../../services/api-services.service';
import { RefItems } from '../../../shared/model';
import { faSave,faBuilding,faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faStreetView,faInfoCircle} from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css']
})
export class MemberProfileComponent implements OnInit {

  profileForm: FormGroup;
  profile: Merchant = new Merchant();
  subscription: Subscription;
  subscriptionM: Subscription;
  state: string[] = [];
  compType: string[] = [];
  deliveryType: string[] = [];
  lat: number = 1.5013633067459153;
  lng: number = 103.69012577441413;
  faCoffee = faQuestionCircle;
  errmsg:string;
  faComp =faBuilding;
  faAddress=faAddressCard;
  faMap=faStreetView;
  faInfo=faInfoCircle;
  faSave=faSave;
  constructor(private formBuilder: FormBuilder,
    private apiser: ApiServicesService) { }

  ngOnInit() {
    this.createFormControls();
    this.subscription = this.apiser.getRefMerchants()
      .subscribe(
        (resp) => {
          this.populateRefArray(resp);
        }
      )

    this.subscriptionM = this.apiser.getMerchant()
      .subscribe(
        (resp) => {
          this.profile = resp;
          this.bindFormControl();
        }
      )
  }

  createFormControls() {
    this.profileForm = this.formBuilder.group({
      CompanyName: new FormControl(''),
      DisplayName: new FormControl(''),
      // Status:  new FormControl(''),
      CompanyType: new FormControl(''),
      RegNo: new FormControl(''),
      GstNo: new FormControl(''),
      // MerchantType:  new FormControl(''),
      DeliveryType: new FormControl(''),
      //MerchantCategory:  new FormControl(''),
      Address1: new FormControl(''),
      Address2: new FormControl(''),
      AddrCity: new FormControl(''),
      AddrState: new FormControl(''),
      Postcode: new FormControl(''),
      ContactPIC: new FormControl(''),
      Email: new FormControl(''),
      OfficePhone: new FormControl(''),
      Handphone: new FormControl(''),
      Website: new FormControl(''),
      Facebook: new FormControl(''),
      Latitude: new FormControl(''),
      Longitude: new FormControl(''),
      AboutUs: new FormControl(''),
      TermAndCond: new FormControl(''),
      // DeliveryFee:  new FormControl(''),
      Remarks: new FormControl('')
      // SalesAgent:  new FormControl(''),
      // SubscriptionType:  new FormControl(''),
      // ItemProfit:  new FormControl(''),
      // HalalCert:  new FormControl(''),
      // TaxGroup:  new FormControl(''),
      //  TaxPercent:  new FormControl(''),
      //  UpdateDate:  new FormControl(''),
      // UpdateBy:  new FormControl(''),
      // CreateDate:  new FormControl(''),
      // CreateBy:  new FormControl(''),
    });
  }

  bindFormControl() {
    this.profileForm.get('CompanyName').setValue(this.profile.companyName);
    this.profileForm.get('DisplayName').setValue(this.profile.displayName);
    //this.profileForm.get('Status').setValue(this.profile.s);
    this.profileForm.get('CompanyType').setValue(this.profile.companyType);
    this.profileForm.get('RegNo').setValue(this.profile.regNo);
    this.profileForm.get('GstNo').setValue(this.profile.gstNo);
    //this.profileForm.get('MerchantType').setValue(this.profile.merchantType);
    this.profileForm.get('DeliveryType').setValue(this.profile.deliveryType);
    // this.profileForm.get('MerchantCategory').setValue(this.profile.merchantCategory);
    this.profileForm.get('Address1').setValue(this.profile.address1);
    this.profileForm.get('Address2').setValue(this.profile.address2);
    this.profileForm.get('AddrCity').setValue(this.profile.addrCity);
    this.profileForm.get('AddrState').setValue(this.profile.addrState);
    this.profileForm.get('Postcode').setValue(this.profile.postcode);
    this.profileForm.get('ContactPIC').setValue(this.profile.contactPIC);
    this.profileForm.get('Email').setValue(this.profile.email);
    this.profileForm.get('OfficePhone').setValue(this.profile.officePhone);
    this.profileForm.get('Handphone').setValue(this.profile.handphone);
    this.profileForm.get('Website').setValue(this.profile.website);
    this.profileForm.get('Facebook').setValue(this.profile.facebook);
    this.profileForm.get('Latitude').setValue(this.profile.latitude);
    this.profileForm.get('Longitude').setValue(this.profile.longitude);
    this.profileForm.get('AboutUs').setValue(this.profile.aboutUs);
    this.profileForm.get('TermAndCond').setValue(this.profile.termAndCond);
    //this.profileForm.get('DeliveryFee').setValue(this.profile);
    this.profileForm.get('Remarks').setValue(this.profile.remarks);
  }

  getFormControlVal() {
    this.profile.companyName = this.profileForm.get('CompanyName').value;
    this.profile.displayName = this.profileForm.get('DisplayName').value;
    this.profile.companyType = this.profileForm.get('CompanyType').value;
    this.profile.regNo = this.profileForm.get('RegNo').value;
    this.profile.gstNo = this.profileForm.get('GstNo').value;
    this.profile.deliveryType = this.profileForm.get('DeliveryType').value;
    this.profile.address1 = this.profileForm.get('Address1').value;
    this.profile.address2 = this.profileForm.get('Address2').value;
    this.profile.addrCity = this.profileForm.get('AddrCity').value;
    this.profile.addrState = this.profileForm.get('AddrState').value;
    this.profile.postcode = this.profileForm.get('Postcode').value;
    this.profile.contactPIC = this.profileForm.get('ContactPIC').value;
    this.profile.email = this.profileForm.get('Email').value;
    this.profile.officePhone = this.profileForm.get('OfficePhone').value;
    this.profile.handphone = this.profileForm.get('Handphone').value;
    this.profile.website = this.profileForm.get('Website').value;
    this.profile.facebook = this.profileForm.get('Facebook').value;
    this.profile.latitude = this.profileForm.get('Latitude').value;
    this.profile.longitude = this.profileForm.get('Longitude').value;
    this.profile.aboutUs = this.profileForm.get('AboutUs').value;
    this.profile.termAndCond = this.profileForm.get('TermAndCond').value;
    this.profile.remarks = this.profileForm.get('Remarks').value;

  }

  populateRefArray(data: RefItems[]) {
    data.filter(x => x.refType == "comptype")
      .forEach(x => this.compType.push(x.code));
    data.filter(x => x.refType == "deliverytype")
      .forEach(x => this.deliveryType.push(x.code));
    data.filter(x => x.refType == "state")
      .forEach(x => this.state.push(x.code));

  }

  markerClick(e) {
    console.log(e);
  }
  onDragEnd(e) {
    console.log(e);
    console.log(e.coords.lat);
    this.profileForm.get('Longitude').setValue(e.coords.lng);
    this.profileForm.get('Latitude').setValue(e.coords.lat);
  }
  OnClick(e) {
    console.log('mok....');;
  }

  SaveProfile(){
    this.getFormControlVal();
    this.apiser.saveProfile(this.profile)
    .subscribe(resp=>{
        if (resp.ok=="yes"){
          this.errmsg ="Profile updated.";
        }else{
          this.errmsg = resp.error;
        }
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    this.subscriptionM.unsubscribe();
  }
}
