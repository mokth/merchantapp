import { MechantItem, RefItems, Merchant, UserInfo, ItemOption, RegisterProfile, BizHour, MerchantItemImage, AdUser } from './../../shared/model';

import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ApiServicesService {

  constructor(private http:HttpClient,
             private auth:AuthService,
             @Inject('API_URL') private apiUrl:string) 
  { }
 

  /* Item API -start */
  getMerchantItems():Observable<MechantItem[]>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
    return this.http.get<MechantItem[]>(this.apiUrl+'api/items',{ headers: headers });
  }

  getMerchantItem(id:number):Observable<MechantItem>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
    return this.http.get<MechantItem>(this.apiUrl+'api/items/'+id,{ headers: headers });
  }
 
  getRefMerchantItems():Observable<RefItems[]>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
     return this.http.get<RefItems[]>(this.apiUrl+'api/items/refs',{ headers: headers });
  }

  getOptionImages(itemCode:string):Observable<any>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
     return this.http.get<ItemOption[]>(
         this.apiUrl+'api/items/optionimages?item='+itemCode,{ headers: headers });
  }

  getItemImages(itemCode:string):Observable<any>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
     return this.http.get(
         this.apiUrl+'api/items/itemimages?item='+itemCode,{ headers: headers });
  }

  getAllItemImages(itemCode:string):Observable<any>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
     return this.http.get(
         this.apiUrl+'api/items/images/'+itemCode,{ headers: headers });
  }

  removeItemImage(id:number):Observable<any>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
     return this.http.delete(
         this.apiUrl+'api/items/removeimage/'+id.toString(),{ headers: headers });
  }

  removeItemOption(id:number):Observable<any>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
     return this.http.delete(
         this.apiUrl+'api/items/removeoption/'+id.toString(),{ headers: headers });
  }

  removeItem(id:number):Observable<any>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
     return this.http.delete(
         this.apiUrl+'api/items/remove/'+id.toString(),{ headers: headers });
  }

  setDefaultItemImage(item:MerchantItemImage):Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type',"application/json")
      .set('Authorization', this.auth.getAuthToken());
    let body: string = JSON.stringify(item);
    return this.http.post(this.apiUrl+'api/items/setdefaultimage',
                           body,{ headers: headers })
  }

  getRefMerchants():Observable<RefItems[]>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
     return this.http.get<RefItems[]>(this.apiUrl+'api/merchant/refs',{ headers: headers });
  }

  getStateRef():Observable<RefItems[]>{
     return this.http.get<RefItems[]>(this.apiUrl+'api/merchant/staterefs');
  }

  getMerchant():Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type',"application/json")
      .set('Authorization', this.auth.getAuthToken());
    let user:UserInfo = this.auth.getUserInfo();
    let body: string = JSON.stringify(user);
    return this.http.post(this.apiUrl+'api/merchant/profile',
                           body,{ headers: headers })
  }

  getBizHours():Observable<any>{
    let headers = new HttpHeaders()
        .set('Authorization', this.auth.getAuthToken());
    return this.http.get<BizHour[]>(this.apiUrl+'api/merchant/bizhours',{ headers: headers });
  }
  
  // Save Http Post
  saveItem(item:MechantItem):Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type',"application/json")
      .set('Authorization', this.auth.getAuthToken());
    let body: string = JSON.stringify(item);
    return this.http.post(this.apiUrl+'api/items/save',
                   body, { headers: headers });
  }
  
  saveProfile(item:Merchant):Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type',"application/json")
      .set('Authorization', this.auth.getAuthToken());
    let body: string = JSON.stringify(item);
    console.log(item);
    return this.http.post(this.apiUrl+'api/Merchant',
                   body, { headers: headers });
  }

  saveBizHours(item:BizHour[]):Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type',"application/json")
      .set('Authorization', this.auth.getAuthToken());
    let body: string = JSON.stringify(item);
    console.log(item);
    return this.http.post(this.apiUrl+'api/Merchant/bizhours',
                   body, { headers: headers });
  }

  saveRegister(item:RegisterProfile):Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type',"application/json")
      .set('Authorization', this.auth.getAuthToken());
    let body: string = JSON.stringify(item);
    console.log(item);
    return this.http.post(this.apiUrl+'api/Merchant/register',
                   body, { headers: headers });
  }
 // Save Http Post
  /* Item API -end */

  postFile(fileToUpload: File,itemCode:string,option:ItemOption): Observable<any> {
    const endpoint = this.apiUrl+"api/items/image?id="+itemCode;
    let headers = new HttpHeaders()
        //.set('content-type', "multipart/form-data; boundary=1")
        .set('Authorization', this.auth.getAuthToken());
        //.set('mydata', JSON.stringify(option));
    const formData: FormData = new FormData();
   
    formData.append('file', fileToUpload, fileToUpload.name);
    
    return this.http
      .post(endpoint, formData, { headers: headers });
    
}
}
