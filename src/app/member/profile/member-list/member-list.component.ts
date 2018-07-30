import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/auth.service';
import { ApiServicesService } from '../../services/api-services.service';
import * as AspNetData from "devextreme-aspnet-data";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  customData:any;

  constructor(private router:Router,
    private route:ActivatedRoute,
    private apiserv:ApiServicesService,
    private auth:AuthService,   
    @Inject('API_URL') private apiUrl:string) {
      this.customData = AspNetData.createStore({
        key: "id",
        loadUrl: apiUrl + "/api/merchant",
        onBeforeSend: function(method, ajaxOptions) {
          ajaxOptions.headers = {
            "Authorization": auth.getAuthToken()
        };
        }
    });
    }

  ngOnInit() {
  }

}
