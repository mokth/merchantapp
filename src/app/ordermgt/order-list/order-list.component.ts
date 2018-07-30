import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { OrderApiService } from '../services/api-services.service';
import { AuthService } from '../../shared/auth.service';
import CustomStore from 'devextreme/data/custom_store';
import 'rxjs/add/operator/toPromise';
import { HttpHeaders, HttpClient } from '../../../../node_modules/@angular/common/http';
import { faBoxOpen,faShoppingBasket} from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})

export class OrderListComponent implements OnInit {

  customData:any={};
  faBoxOpen=faBoxOpen;
  faShoppingBasket=faShoppingBasket;
  constructor(  private router:Router,
                private route:ActivatedRoute,
                private apiserv:OrderApiService,
                private auth:AuthService, 
                private http:HttpClient,           
                @Inject('API_URL') private apiUrl:string ) {

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
          return http.get(apiUrl + "/api/order/current" + params,{ headers: headers })
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
  }
  
  onItemDetails(data){
    console.log(data);
    this.router.navigate(['../orderitem'],
       { 
         relativeTo: this.route, 
         queryParams: { orderno: data.orderNo,viewonly:false }
       });
  }
}
