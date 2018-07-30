import { UserInfo, ItemOption, ItemImageInfo } from './../../../shared/model';
import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemImages } from '../../../shared/model';
import { AuthService } from '../../../shared/auth.service';
import { Location } from '@angular/common';
import { ApiServicesService } from '../../services/api-services.service';
import { faChevronCircleLeft } from "@fortawesome/free-solid-svg-icons"
//a-chevron-circle-left
@Component({
  selector: 'app-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.css']
})
export class ItemImagesComponent implements OnInit {
  Options:ItemOption[]=[];
  images:ItemImageInfo[]=[];
  itemCode:string;
  user:UserInfo;
  faBack=faChevronCircleLeft;
  constructor(private route:ActivatedRoute,
              private auth:AuthService, 
              private apiserv:ApiServicesService,
              private readonly location: Location,
              @Inject('IMG_URL') public imgUrl:string,
              @Inject('API_URL') public apiUrl:string
              ) { }
             
  ngOnInit() {
    this.user= this.auth.getUserInfo();
    this.route.queryParams.subscribe((params) => {
         console.log(params);
         this.itemCode = params.item;
         this.apiserv.getOptionImages(this.itemCode)
         .subscribe(resp=>{
              this.Options=resp;   
             // console.log(this.Options);   
            });

            this.apiserv.getAllItemImages(this.itemCode)
            .subscribe(resp2=>{
                 this.images =resp2;
                 console.log(this.images);   
               });
      });        
  }
    
  getImageUrl(data):string{
    //console.log(data);
    let code= this.user.companyCode.replace('/','_');
    return this.apiUrl+"upload/"+code+"/"+data.imageName;
  }

  goBack(){
    this.location.back();
  }

  getHeaderBk(item:ItemImageInfo){
    let bkclass=""
    if (item.optionType.toLowerCase()=='main'){
      bkclass="bg-main"
    }else if (item.optionType.toLowerCase()=='set'){
      bkclass="bg-set"
    }else if (item.optionType.toLowerCase()=='addon'){
      bkclass="bg-addon"
    }else{
      bkclass="bg-main"
    }
    return bkclass;
  }
}
