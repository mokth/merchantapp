import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forEach } from '@angular/router/src/utils/collection';
import { FormGroup, FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs/Subscription';
import { DxFileUploaderComponent, DxGalleryComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

import { ApiServicesService } from '../../services/api-services.service';
import { RefItems, MechantItem, ItemOption, MerchantItemImage } from './../../../shared/model';
import { AuthService } from '../../../shared/auth.service';
import * as $ from 'jquery';
import { faPlusSquare,faEdit,faTrashAlt,faSave,faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { faCaretRight} from "@fortawesome/free-solid-svg-icons"
import { TranslateService } from '@ngx-translate/core';
import { CanComponentDeactivate } from '../../../shared/CanDeactivateGuard';
import { Observable } from '../../../../../node_modules/rxjs/Observable';

// import { CroppieOptions } from 'croppie';
// import { CroppieDirective } from 'angular-croppie-module';
// import  Croppie  from 'croppie';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})

export class ItemComponent implements OnInit,CanComponentDeactivate {
  itemForm: FormGroup;
  optionForm: FormGroup;
  subscription: Subscription;
  item: MechantItem;
  option: ItemOption;
  now: Date = new Date();
  faCoffee = faQuestionCircle;
  status: string[] = [];
  itemTypes: string[] = [];
  categories: string[] = [];
  subcategories: string[] = [];
  itemtags: any = [];
  optionTypes: any = [];
  itemImages: MerchantItemImage[] = [];
  itemImageIndex:number;
  optionArr: ItemOption[] = [];
  addOnArr: ItemOption[] = [];

  compCode: string;
  optionImgUrl: string;
  itemImgUrl: string;
  errmsg: string;
  priceType: string = "";
  optionType: string;

  changesSaved:boolean = false;
  editMode: boolean;
  itemEditMode: boolean;
  isOption: boolean;
  isAddOn: boolean;
  isOptioPriceRequired: boolean;
  isSmallScreen: boolean;
  mobHeight: any;
  mobWidth: any;
  imgcolWidth:any;

  public popoverTitle: string = 'Delete';
  public popoverMessage: string = 'Item will be permanent deleted.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  
  faAdd = faPlusSquare;
  faEdit = faEdit;
  faDelete = faTrashAlt;
  faSave =faSave;
  faCancel =faTimesCircle;
  faCaretRight =faCaretRight;
  //@ViewChild(DxFileUploaderComponent) fileUploaderItem: DxFileUploaderComponent;
  //@ViewChild(DxFileUploaderComponent) fileUploader: DxFileUploaderComponent;
  @ViewChild(DxGalleryComponent) galary: DxGalleryComponent;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private apiser: ApiServicesService,
    private readonly location: Location, 
    private translate:TranslateService,  
    @Inject('API_URL') public apiUrl: string) {
    
      this.mobHeight = window.innerHeight;
      this.mobWidth = window.innerWidth;
      this.imgcolWidth = (this.mobWidth * 0.38).toFixed(0);
      
      if (this.mobWidth < 500) {
        this.isSmallScreen = true;
      } else {
        this.isSmallScreen = false;
      }  
  }

  ngOnInit() {
    this.item = new MechantItem();
    this.createFormControls();
    this.createOptionFormControls();
    this.route.params.subscribe(
      params => {
        let id: number = +params.id;
        if (id > -1) {
          this.editMode = true;
          this.getItem(+params.id);
        } else {
          this.editMode = false;
          this.item = new MechantItem();
          let user = this.auth.getUserInfo();
          this.item.country = user.country;
          this.item.state = user.state;
          this.item.area = user.area;
          this.item.city = user.city;
          this.item.location = user.location;
          this.item.companyCode = user.companyCode;
          this.item.branchCode = user.branchCode;
          this.item.options = [];
          this.optionArr = [];
          this.addOnArr = [];
          this.bindFormControl();
        }
      }
    );
    this.subscription = this.apiser.getRefMerchantItems()
      .subscribe(
        (resp) => {
          this.populateRefArray(resp);
        }
      )
    // console.log(this.fileUploader);
    //   this.fileUploader.uploadHeaders= {
    //     Authorization : this.auth.getAuthToken()    
    //   };
    //   this.fileUploaderItem.uploadHeaders= {
    //     Authorization : this.auth.getAuthToken()    
    //   };
  }
  uploadHeader(): any {
    return { Authorization: this.auth.getAuthToken() }
  }
  setUploadFileAuth() {

  }

  getItem(id: number) {
    this.apiser.getMerchantItem(id).subscribe(
      (resp) => {
        this.item = resp;
        this.getOptionAddOnArr();
        this.isOptioPriceRequired = this.priceType.toLocaleLowerCase() == "set";
        this.bindFormControl();
        this.itemImgUrl = this.getImageUrlByName(this.item.displayImage);
        this.apiser.getItemImages(this.item.itemCode)
          .subscribe(resp => {
            this.itemImages = resp;
            // if (this.itemImages != null && this.itemImages.length > 0) {
            //   this.itemImgUrl = this.getImageUrl(this.itemImages[0]);
            // }
          });
      }
    );
  }

  getOptionAddOnArr() {
    this.optionArr = this.item.options.filter(x => x.optionType !== "addon");
    this.addOnArr = this.item.options.filter(x => x.optionType === "addon");
  }

  populateRefArray(data: RefItems[]) {
    data.filter(x => x.refType == "itemstatus")
      .forEach(x => this.status.push(x.code));
    data.filter(x => x.refType == "itemtag")
      .forEach(x => this.itemtags.push(x.code));
    data.filter(x => x.refType == "itemtype")
      .forEach(x => this.itemTypes.push(x.code));
    data.filter(x => x.refType == "itemcategory")
      .forEach(x => this.categories.push(x.code));
    data.filter(x => x.refType == "itemsubcategory")
      .forEach(x => this.subcategories.push(x.code));
    data.filter(x => x.refType == "optiontype")
      .forEach(x => this.optionTypes.push(x.code));
  }

  createFormControls() {
    this.itemForm = this.formBuilder.group({
      ItemCode: new FormControl('', Validators.required),
     // MerchantItemCode: new FormControl(''),
      ItemStatus: new FormControl(''),
      ItemName: new FormControl('', Validators.required),
      ItemDetail: new FormControl(''),
      ItemDetailBM: new FormControl(''),
      ItemDetailCN: new FormControl(''),
      ItemType: new FormControl('', Validators.required),
      ItemCategory: new FormControl(''),
      SubCategory1: new FormControl(''),
      SubCategory2: new FormControl(''),
      SubCategory3: new FormControl(''),
      SubCategory4: new FormControl(''),
      ItemTag: new FormControl(),
      SetEffective: new FormControl(),
      EffectiveFrom: new FormControl(),
      EffectiveTo: new FormControl(),
      PrepareTime: new FormControl(),
      PriceType: new FormControl(),
      CostPrice: new FormControl(0, Validators.required),
      CostWithGST: new FormControl(0, Validators.required),
      CostTaxAmount: new FormControl(0),
      SellingPrice: new FormControl(0, Validators.required),
      PriceWithGST: new FormControl(0, Validators.required),
      TaxAmount: new FormControl(0)
    });
  }

  createOptionFormControls() {
    this.optionForm = this.formBuilder.group({
      CostPrice: new FormControl(0),
      CostWithGST: new FormControl(0),
      CostTaxAmount: new FormControl(0),
      SellingPrice: new FormControl(0),
      PriceWithGST: new FormControl(0),
      TaxAmount: new FormControl(0),
      OptionCode: new FormControl('', Validators.required),
      OptionType: new FormControl('', Validators.required),
      OptionName: new FormControl('', Validators.required),
      OptionNameBM: new FormControl(),
      OptionNameCN: new FormControl()
    });
  }

  bindFormControl() {
    this.itemForm.get('ItemCode').setValue(this.item.itemCode);
    //this.itemForm.get('MerchantItemCode').setValue(this.item.merchantItemCode);
    this.itemForm.get('ItemStatus').setValue(this.item.itemStatus);
    this.itemForm.get('ItemName').setValue(this.item.itemName);
    this.itemForm.get('ItemDetail').setValue(this.item.itemDetail);
    this.itemForm.get('ItemDetailBM').setValue(this.item.itemDetailBM);
    this.itemForm.get('ItemDetailCN').setValue(this.item.itemDetailCN);
    this.itemForm.get('ItemType').setValue(this.item.itemType);
    this.itemForm.get('ItemCategory').setValue(this.item.itemCategory);
    this.itemForm.get('SubCategory1').setValue(this.item.subCategory1);
    this.itemForm.get('SubCategory2').setValue(this.item.subCategory2);
    this.itemForm.get('SubCategory3').setValue(this.item.subCategory3);
    this.itemForm.get('SubCategory4').setValue(this.item.subCategory4);
    this.itemForm.get('ItemTag').setValue(this.convertStr2ItemTag());
    this.itemForm.get('SetEffective').setValue(this.item.setEffective);
    this.itemForm.get('EffectiveFrom').setValue(this.item.effectiveFrom);
    this.itemForm.get('EffectiveTo').setValue(this.item.effectiveTo);
    this.itemForm.get('PrepareTime').setValue(this.item.prepareTime);
    this.itemForm.get('PriceType').setValue(this.item.priceType);
    this.itemForm.get('CostPrice').setValue(this.item.costPrice);
    this.itemForm.get('CostTaxAmount').setValue(this.item.costTaxAmount);
    this.itemForm.get('CostWithGST').setValue(this.item.costWithGST);
    this.itemForm.get('SellingPrice').setValue(this.item.sellingPrice);
    this.itemForm.get('PriceWithGST').setValue(this.item.priceWithGST);
    this.itemForm.get('TaxAmount').setValue(this.item.taxAmount);
  }

  bindOptionFormControl() {
    this.optionForm.get('CostPrice').setValue(this.option.costPrice);
    this.optionForm.get('CostWithGST').setValue(this.option.costWithGST);
    this.optionForm.get('CostTaxAmount').setValue(this.option.costTaxAmount);
    this.optionForm.get('SellingPrice').setValue(this.option.sellingPrice);
    this.optionForm.get('PriceWithGST').setValue(this.option.priceWithGST);
    this.optionForm.get('TaxAmount').setValue(this.option.taxAmount);
    this.optionForm.get('OptionCode').setValue(this.option.optionCode);
    this.optionForm.get('OptionType').setValue(this.option.optionType);
    this.optionForm.get('OptionName').setValue(this.option.optionName);
    this.optionForm.get('OptionNameBM').setValue(this.option.optionNameBM);
    this.optionForm.get('OptionNameCN').setValue(this.option.optionNameCN);
  }

  getFormControlsVal() {
    this.item.itemCode = this.itemForm.get('ItemCode').value;
    //this.item.merchantItemCode = this.itemForm.get('MerchantItemCode').value;
    this.item.itemStatus = this.itemForm.get('ItemStatus').value;
    this.item.itemName = this.itemForm.get('ItemName').value;
    this.item.itemDetail = this.itemForm.get('ItemDetail').value;
    this.item.itemDetailBM = this.itemForm.get('ItemDetailBM').value;
    this.item.itemDetailCN = this.itemForm.get('ItemDetailCN').value;
    this.item.itemType = this.itemForm.get('ItemType').value;//this.convertItemTag2Str();
    this.item.itemCategory = this.itemForm.get('ItemCategory').value;
    this.item.subCategory1 = this.itemForm.get('SubCategory1').value;
    this.item.subCategory2 = this.itemForm.get('SubCategory2').value;
    this.item.subCategory3 = this.itemForm.get('SubCategory3').value;
    this.item.subCategory4 = this.itemForm.get('SubCategory4').value;
    this.item.itemTag = this.convertItemTag2Str();
    this.item.setEffective = this.itemForm.get('SetEffective').value;
    this.item.effectiveFrom = this.itemForm.get('EffectiveFrom').value;
    this.item.effectiveTo = this.itemForm.get('EffectiveTo').value;
    this.item.prepareTime = this.itemForm.get('PrepareTime').value;
    this.item.priceType = this.itemForm.get('PriceType').value;
    this.item.costPrice = this.itemForm.get('CostPrice').value;
    this.item.costTaxAmount = this.itemForm.get('CostTaxAmount').value;
    this.item.costWithGST = this.itemForm.get('CostWithGST').value;
    this.item.sellingPrice = this.itemForm.get('SellingPrice').value;
    this.item.priceWithGST = this.itemForm.get('PriceWithGST').value;
    this.item.taxAmount = this.itemForm.get('TaxAmount').value;
  }

  getOptionControlsVal() {
    this.option.costPrice = this.optionForm.get('CostPrice').value;
    this.option.costWithGST = this.optionForm.get('CostWithGST').value;
    this.option.costTaxAmount = this.optionForm.get('CostTaxAmount').value;
    this.option.sellingPrice = this.optionForm.get('SellingPrice').value;
    this.option.priceWithGST = this.optionForm.get('PriceWithGST').value;
    this.option.taxAmount = this.optionForm.get('TaxAmount').value;
    this.option.optionCode = this.optionForm.get('OptionCode').value;
    this.option.optionType = this.optionForm.get('OptionType').value;
    this.option.optionName = this.optionForm.get('OptionName').value;
    this.option.optionNameCN = this.optionForm.get('OptionNameCN').value;
    this.option.optionNameBM = this.optionForm.get('OptionNameBM').value;
  }

  convertItemTag2Str(): string {
    let itemtag: string = "";
    let tag: string[] = this.itemForm.get('ItemTag').value;
    tag.forEach(x => {
      if (x !== "") {
        itemtag = itemtag + x + ";";
      }
    });
    return itemtag;
  }

  convertStr2ItemTag(): string[] {
    if (this.item.itemTag == null) {
      return [];
    }
    let itemtag: string = this.item.itemTag;
    let tag: string[] = itemtag.split(';');
    return tag.filter(x => x != "");

  }

  onSave() {
    this.getFormControlsVal();
    // if (this.item.options.length > 0) {
    //   //alway take the first image as display image
    //   this.item.displayImage = this.item.options[0].imageName;
    // } else {
    //   this.item.displayImage = "";
    // }
    this.apiser.saveItem(this.item)
      .subscribe(resp => {
        console.log(resp);
        if (resp.ok == "yes") {
          this.changesSaved = true;
          //this.errmsg = "Successfully Save item.";
          this.translate.get('save.success').subscribe((res: string) => {
            notify(res,"success", 1200);
         });
          this.editMode = true;
          this.setUploadFileAuth();
        } else {
          this.translate.get('save.success').subscribe((res: string) => {
            notify(res,"error", 1200);
         });
        
        }
      });
  }

  onCancel() {
    this.location.back();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  onValueChanged(e) {
    //console.log(e);
  }

  onPriceTypeChanged(e) {
    this.priceType = e.value;
    this.isOptioPriceRequired = this.priceType.toLocaleLowerCase() == "set";
  }

  canEditPrice(): boolean {
    let canEdit = false;
    if (!this.isAddOn) {
      canEdit = (this.priceType.toLowerCase() == "set");
    } else {
      canEdit = true;
    }

    return canEdit;
  }
  //*** Option Add/Edit/Delete ***/
  resetOptionForm() {
    this.optionForm.reset();
    this.optionImgUrl = "";
    let user = this.auth.getUserInfo();
    this.option = new ItemOption();
    this.option.itemCode = this.item.itemCode;
    this.option.createBy = user.name;
    this.option.createDate = new Date();
    this.option.costPrice = 0;
    this.option.costTaxAmount = 0;
    this.option.costWithGST = 0;
    this.option.sellingPrice = 0;
    this.option.taxAmount = 0;
    this.option.priceWithGST = 0;
  }

  onNewOption() {
    this.resetOptionForm();
    this.isOption = true;
    this.itemEditMode = false;
    this.isAddOn = false;
    this.optionType = "Item Option";
    this.option.optionType = "set";
    this.bindOptionFormControl();
    $('#myModel').click();
  }

  onNewAddOn() {
    this.resetOptionForm();
    this.isOption = false;
    this.itemEditMode = false;
    this.isAddOn = true;
    this.optionType = "Item Add On";
    this.option.optionType = "addon";
    this.bindOptionFormControl();
    $('#myModel2').click();
  }

  onEditOption(d, type: number) {
    this.isOption = (type === 1) ? true : false;
    if (this.isOption) {
      this.isAddOn = false;
      this.optionType = "Item Option";

    } else {
      this.isAddOn = true;
      this.optionType = "Item Add On";

    }
    this.itemEditMode = true;
    this.option = d.data;
    this.optionImgUrl = this.getImageUrl(d.data);
    this.bindOptionFormControl();
    $('#myModel').click();
  }

  onDeleteOption(d, type: number) {
    this.apiser.removeItemOption(d.data.id).subscribe(
      (resp) => {
        console.log(resp);
        if (resp.ok == "yes") {
          let index = this.item.options.findIndex(x => x.id == d.data.id);
          if (index > -1) {
            this.item.options.splice(index, 1);
            this.getOptionAddOnArr();
          }
        }
      });

  }

  getImageUrl(data): string {
    let code = this.item.companyCode.replace('/', '_');
    return this.apiUrl + "upload/" + code + "/" + data.imageName;
  }

  getImageUrlByName(name:string): string {
    let code = this.item.companyCode.replace('/', '_');
    return this.apiUrl + "upload/" + code + "/" + name;
  }

  getItemImageUrl(): string {
    let code = this.item.companyCode.replace('/', '_');
    return 'url(' + this.itemImgUrl + ")'";
  }

  onItemImageUploaded(e) {
    //{"ok":"yes","filename":"026583ab-f65a-410d-b261-dcb4f461a2e1.jpg","id":11,"error":""}
    let resp = JSON.parse(e.request.response);
    if (resp.ok == "yes") {
      let item: MerchantItemImage = new MerchantItemImage();
      item.id = resp.id;
      item.imageName = resp.filename;
      item.itemCode = this.item.itemCode;
      item.defaultImage = false;
      this.itemImages = [...this.itemImages, item];
      let index = this.itemImages.findIndex(x=>x.defaultImage==true);
      console.log('onItemImageUploaded '+index);
      if (index<0){ //mean no default image
        this.itemImages[0].defaultImage=true; //set the first one as default
        this.item.displayImage = this.itemImages[0].imageName;
        console.log( this.item.displayImage);
      }
     // console.log(this.itemImages);
    }
  }

  OnItemFileChange(e) {
    if (e.value) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.itemImgUrl = event.target.result;
      }
      reader.readAsDataURL(e.value[0]);
    }

  }

  OnFileChange(e) {
    if (e.value) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.optionImgUrl = event.target.result;
      }
      reader.readAsDataURL(e.value[0]);
    }  
  }

  OnItemImages() {
    // this.apiser.getItemImages(this.item.itemCode)
    //    .subscribe(resp=>{
    //        this.itemImages = resp;

    //    });
    $('#myModelImage').click();
  }
  
  onIndicatorClick(index:number){
    console.log(index);
    this.itemImageIndex=index;
    this.galary.instance.goToItem(index,false);
  }
  onItemImageChanged(e){
    //console.log(e);
    let index= this.itemImages.findIndex(x=>x.imageName==e.addedItems["0"].imageName);
    if (index>-1){
      this.itemImageIndex=index;
    }
  }
  isImageSelectedIndex(index:number){
    return this.itemImageIndex===index;
  }
  RemoveImage(item: MerchantItemImage) {
    //console.log(item);
    this.apiser.removeItemImage(item.id)
      .subscribe(resp => {
        if (resp.ok == 'yes') {
          let index = this.itemImages.findIndex(x => x.id == item.id);
          //console.log('removing index ' + index);
          if (index > -1) {
            this.itemImages.splice(index, 1);
          }
        }
      });
  }

  onDefaultImageChanged(e, galleryItem: MerchantItemImage) {
    let id: number = galleryItem.id;
    //this.itemImages.forEach(x=>x.defaultImage=false);
    if (e.value == true) {
      this.itemImages.map(x => {
        x.defaultImage = (x.id == id);
        this.itemImgUrl = this.getImageUrl(galleryItem);
      });
    } else {
      this.itemImages.filter(x => x.id == id)
        .map(x => x.defaultImage = false);
    }

    //console.log(this.itemImages);
    this.apiser.setDefaultItemImage(galleryItem)
      .subscribe(resp => {
        //console.log(resp);
      });
  }

  SaveOption(fileUploader: DxFileUploaderComponent) {
    this.getOptionControlsVal();
    if (fileUploader.value && fileUploader.value.length > 0) {
      this.apiser.postFile(fileUploader.value[0], this.item.itemCode, this.option)
        .subscribe(resp => {
          //console.log(resp);
          if (resp.ok == "yes") {
            this.option.imageName = resp.filename;
            this.SaveOptionItem();
            this.closeModalDialog();
          }
        });
    } else {
      this.SaveOptionItem();
      this.closeModalDialog();
    }

  }

  closeModalDialog() {
    $('#closemodel').click();
    $('#closemodel2').click();
  }

  SaveOptionItem() {
    if (this.itemEditMode) { //edit mode
      let index = this.item.options.findIndex(x => x.id == this.option.id);
      if (index > -1) {
        [... this.item.options.slice(0, index), this.option, ...this.item.options.slice(index + 1, this.item.options.length)];
      }
    } else {
      this.item.options.push(this.option);
    }
    this.getOptionAddOnArr();
  }
  //*** Option Add/Edit/Delete ***/

  //*** http upload events ***/
  handleNetworkError(e) {
    //console.log(e);
    var xhttp = e.request;
    if (xhttp.readyState == 4 && xhttp.status == 0) {
      console.log("Connection refused.");
    }
  }

  
  canDeactivate(): boolean | Observable<boolean> | Promise<boolean>{
    console.log('canDeactivate');
    if ( !this.changesSaved){
      return confirm('Do you want to discard the changes?');
    } else {
      return true;
    }    
};
}
