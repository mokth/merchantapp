import { OrderLineStatus } from './../../shared/model';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Observable } from 'rxjs/Observable';
import { OrderInfo, OrderDetail } from '../../shared/model';


@Injectable()
export class OrderApiService {

  constructor(private http:HttpClient,
             private auth:AuthService,
             @Inject('API_URL') private apiUrl:string) 
  { }
 
  /* Item API -start */
  getOrders():Observable<OrderInfo[]>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
    return this.http.get<OrderInfo[]>(this.apiUrl+'api/order',{ headers: headers });
  }

  getCurrentOrders():Observable<OrderInfo[]>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
    return this.http.get<OrderInfo[]>(this.apiUrl+'api/order/current',{ headers: headers });
  }

  getOrderItems(orderno:string):Observable<OrderDetail>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
    return this.http.get<OrderDetail>(this.apiUrl+'api/order/detail/'+orderno,{ headers: headers });
  }

  
  setOrderLineStatus(item:OrderLineStatus):Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type',"application/json")
      .set('Authorization', this.auth.getAuthToken());
    let body: string = JSON.stringify(item);
    console.log(item);
    return this.http.post(this.apiUrl+'api/order/linestatus',
                   body, { headers: headers });
  }

}
