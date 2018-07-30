import { vOrderAddOn, OrderLineStatus } from './../../shared/model';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { OrderDetail, vOrderItem } from '../../shared/model';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { OrderApiService } from '../services/api-services.service';
import { Location } from '@angular/common';
import { DxDataGridComponent } from '../../../../node_modules/devextreme-angular';
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit {
  isSmallScreen: boolean;
  mobHeight: any;
  mobWidth: any;
  popHeight: any;
  popWidth: any;
  popupVisible:boolean;
  selectedItem:any;
  reason:string;
  viewOnly:boolean;
  orderno:string;
  order:OrderDetail;
  orderitems:vOrderItem[]=[];
  orderaddons:vOrderAddOn[]=[];
  itemaddons:vOrderAddOn[]=[];
  faback=faChevronCircleLeft;
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  constructor(  private router:Router,
                private route:ActivatedRoute,
                private apiserv:OrderApiService,
                private readonly location: Location,
                @Inject('API_URL') private apiUrl:string
               ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.orderno = params.orderno;
      this.viewOnly = params.viewonly;
      this.apiserv.getOrderItems(this.orderno).subscribe(resp=>{
            this.order = resp;
            this.orderitems = this.order.items;
            this.orderaddons = this.order.addons;
          //  console.log(this.order);
          });
      });

      this.mobHeight = window.innerHeight;
      this.mobWidth = window.innerWidth;
     
      this.popupVisible =false;
      if (this.mobWidth < 500) {
        this.isSmallScreen = true;
        this.popHeight = window.innerHeight * 0.8;
        this.popWidth = window.innerWidth * 0.8;
      } else {
        this.isSmallScreen = false;
        this.popHeight = window.innerHeight * 0.5;
        this.popWidth = window.innerWidth * 0.3;
      }  
  }
 
  getAddOn(data){
    this.itemaddons= this.orderaddons.filter(x=>x.orderLine==data.orderLine);
    return this.itemaddons;  
  }

  isHasItem(data){
    this.itemaddons= this.orderaddons.filter(x=>x.orderLine==data.orderLine);
    return this.itemaddons.length>0;  
 }

  getImageUrl(data): string {
    let code = data.companyCode.replace('/', '_');
   return this.apiUrl + "upload/" + code + "/" + data.displayImage;
  }
 
  getAddOnImageUrl(data){
    let code = data.companyCode.replace('/', '_');
    return this.apiUrl + "upload/" + code + "/" + data.imageName;
  }
  
  getRowNumber(data){
  // console.log(data);
   var index = this.dataGrid.instance.pageIndex() * 
              this.dataGrid.instance.pageSize() + data.rowIndex + 1;
   return index;
 }

 OnAccept(e){
   this.SubmitAccept(e,"Accept","");
 }

 SubmitAccept(e,status:string,reason:string){
  let orderline:OrderLineStatus = new OrderLineStatus();
   orderline.id= e.data.id;
   orderline.orderNo = e.data.orderNo;
   orderline.orderLine = e.data.orderLine;
   orderline.lineStatus= status;
   orderline.reason = reason;
   console.log(orderline);
   this.apiserv.setOrderLineStatus(orderline)
     .subscribe(resp=>{
        console.log(resp);
        let lineid:string = orderline.id+"";
        let item =this.orderitems.find(x=>x.id==lineid);
        if (item!=null){
            if (resp.ok=="yes"){
             item.lineStatus= orderline.lineStatus;
            }
        }
     });
}
 
 OnDecline(e){
   this.selectedItem =e;
  this.popupVisible =true;
 }
 
 DeclineItem(){
   //console.log(this.reason);
   this.SubmitAccept( this.selectedItem,"Decline",this.reason);
   this.popupVisible =false;
 }

 CancelDecline(){
  this.popupVisible =false;
 }

 goBack(){
  this.location.back();
}
}
