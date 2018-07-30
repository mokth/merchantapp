import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MechantItem } from '../../../shared/model';
import { Router, ActivatedRoute } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { ApiServicesService } from '../../services/api-services.service';
import * as AspNetData from "devextreme-aspnet-data";
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { currentPage$ } from '../../../shared/stone';

import { AuthService } from '../../../shared/auth.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { faPlusSquare,faEdit,faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  merchantitems:MechantItem[]=[];
  customData:any={};
  currentPage = 0;
  public popoverTitle: string = 'Delete';
  public popoverMessage: string = 'Item will be permanent deleted.';
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;
  
  mobHeight: any;
  mobWidth: any;
  imgcolWidth:any;
  isSmallScreen: boolean;
  faAdd = faPlusSquare;
  faEdit = faEdit;
  faDelete = faTrashAlt;
  constructor(private router:Router,
              private route:ActivatedRoute,
              private apiserv:ApiServicesService,
              private auth:AuthService, 
              private http:HttpClient,           
              @Inject('API_URL') private apiUrl:string,
              @Inject('IMG_URL') public imgUrl:string) {
    this.mobHeight = window.innerHeight;
    this.mobWidth = window.innerWidth;
    this.imgcolWidth=(this.mobWidth * 0.38).toFixed(0);
    console.log((this.mobWidth * 0.32).toFixed(0));
    if (this.mobWidth < 500) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
              this.customData.store = new CustomStore({
                load: function (loadOptions: any) {
                    var params = '?';
    
                    params += 'skip=' + loadOptions.skip || 0;
                    params += '&take=' + loadOptions.take || 15;
                   
                    console.log(loadOptions.take);
                    console.log(params);
                    if(loadOptions.sort) {
                        params += '&orderby=' + loadOptions.sort[0].selector;
                        if(loadOptions.sort[0].desc) {
                            params += ' desc';
                        }
                    }
                    let headers = new HttpHeaders()
                    .set('Authorization', auth.getAuthToken());
                    return http.get(apiUrl + "/api/items" + params,{ headers: headers })
                        .toPromise()
                        .then((response:any) => {
                            var json = response; 
                            console.log(response);   
                            return {
                                data: json.data,
                                totalCount: json.totalCount
                            }
                        })
                        .catch(error => { throw 'Data Loading Error' });
                }
            });
        
  }
            

  ngOnInit() {
    this.currentPage = currentPage$.getValue();
    
  }

  ngAfterViewInit() {
    this.dataGrid.instance.pageIndex(currentPage$.getValue());
  }
    
  getImageUrl(data):string{
    let code= data.companyCode.replace('/','_');
    return this.apiUrl+"upload/"+code+"/"+data.displayImage;
  }
  
  imagePath():string{
   return this.imgUrl;
  }

  onImageDetails(data){
    console.log(data);
    this.router.navigate(['../itemimages'],
       { 
         relativeTo: this.route, 
         queryParams: { item: data.itemCode }
       });
  }

  onEditItem(d){
    const pageIndex = this.dataGrid.instance.pageIndex();
    currentPage$.next(pageIndex);

    this.router.navigate(['../item/'+d.data.id],  { 
      relativeTo: this.route, 
      queryParams: { returnUrl: this.router.url+"?id="+d.data.id }
    });
    
  }

  onNewItem(){
    const pageIndex = this.dataGrid.instance.pageIndex();
    currentPage$.next(pageIndex);

    this.router.navigate(['../item/-1'],  { 
      relativeTo: this.route, 
      queryParams: { returnUrl: this.router.url+"?id=-1" }
    });
  }

  onDeleteItem(d){
    this.apiserv.removeItem(d.data.id).subscribe(
      (resp)=>{
         if (resp.ok=="yes"){
           this.dataGrid.instance.refresh();
         }      
      });
  }

  calculateCellValue (rowData) {
    // ...
    //console.log(rowData);
    let column = this as any;
    return column.defaultCalculateCellValue(rowData);

  }

}