import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { TranslateService } from '@ngx-translate/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { SubscriptSevService } from './shared/subscript-sev.service';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '../../node_modules/@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'app';
  faBars=faBars;
  totalOrder:number;
  loadingRouteConfig:boolean;
  mobHeight: any;
  mobWidth: any;
  isSmallScreen: boolean;

  constructor(private auth: AuthService,
              public translate: TranslateService,
              private swPush: SwPush,
              private swUpdate: SwUpdate,
              private subsev: SubscriptSevService,
              private router: Router,
              @Inject('IMG_URL') public imgUrl: string) {
             
    translate.use('en'); //en or ch

    this.mobHeight = window.innerHeight;
    this.mobWidth = window.innerWidth;
    if (this.mobWidth < 500) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }

    ngOnInit() {
       this.totalOrder=0;
       Notification.requestPermission(resp=>{
         console.log("Notification.requestPermission"+resp);
       });
       console.log(this.swUpdate.isEnabled);
       if (this.swUpdate.isEnabled) {
           
           this.swUpdate.activateUpdate().then(resp=>{
             console.log(resp)   
          });
           this.swUpdate.available.subscribe(() => {

               if (confirm("New version available. Load New Version?")) {
                   window.location.reload(true);
               }
           });
           //this.swUpdate.checkForUpdate();
           //this.subsev.subscribeToNotifications();
       }
   // this.isCheckPushReg();
    //this.subsev.subscribeToNotifications(); 
    
    this.swPush.messages.subscribe(resp=>{
        console.log('swPush Event '+resp);          
        navigator.vibrate(10);   
    });

    this.auth.getCurrentOrders().subscribe(resp=>{
        console.log(resp);
        this.totalOrder = resp.totalCount;
    });
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
          this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.loadingRouteConfig = false;
      }
  });
  }
  
  isLogin(){
    return this.auth.isAuthenticated();
  }

  logOut(){
    console.log('log oit');
    this.auth.logOut();
  }

  onLang(lang:string){
    this.translate.use(lang);
  }
}
