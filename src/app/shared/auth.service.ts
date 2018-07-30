import { UserInfo, OrderInfo } from './model';
import { Observable } from 'rxjs/Observable';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Http, Headers, RequestOptions, RequestMethod } from "@angular/http";
import { Injectable, Inject } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { SubscriptSevService } from './subscript-sev.service';


@Injectable()
export class AuthService {
  authChanged = new Subject<boolean>();
  authMsgChanged = new Subject<string>();
  titleChanged = new Subject<string>();
  isvalidUser:boolean=false;
  jwtHelper: JwtHelperService = new JwtHelperService();
  userId:string;
  user:UserInfo= new UserInfo();
  changeMsgChanged = new Subject<string>();

  constructor(private http:Http,
              private httpcl:HttpClient,
              private router: Router,
              private subsev:SubscriptSevService,
              @Inject('API_URL') private apiUrl:string) { }
 
  logIn(name: string, password: string) {
      let body = JSON.stringify({	"name":name,"password":password,"fullname":''});
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions();
      options.headers = headers;
      options.method=RequestMethod.Post;
      //console.log('posting login'+this.apiUrl+'api/auth/jwt1');
      this.http.post(this.apiUrl+'api/auth/jwt1',
                    body,{ headers: headers })
        .subscribe(
        (data:any)=>{
          let resp = data.json();
          console.log(resp); 
         if (resp.ok=="no"){
            this.authMsgChanged.next('Error '+resp.error);
            this.authChanged.next(false);
            return;
         }
         if (resp.chgpass==="chgpass"){
              this.router.navigate(['/auth/change']);
              return;
         }
          let token =JSON.parse(resp.data);
          //console.log(token);
          try{
                //this.jwtHelper.isTokenExpired(token.auth_token);
                this.userId=name;               
                localStorage.setItem('_token',token.auth_token);
                this.isvalidUser =true;
                this.authChanged.next(true);
                this.storeUserInfo(token.auth_token);
                this.subsev.subscribeToNotifications(this.getAuthToken()); 
                console.log("success login");
          }catch(e)
          {
            console.log(e);
            this.authMsgChanged.next('Error '+e);
            this.authChanged.next(false);
          }
        },
        (err)=>{
          console.log(err)
          this.authMsgChanged.next('Error '+err);
          this.authChanged.next(false);
        },
        ()=>{
          console.log('Complete post login')
        }
      )
  }

  afterChangePass(userid:string,token:any){
    this.userId=name;               
    localStorage.setItem('_token',token.auth_token);
    this.isvalidUser =true;
    this.authChanged.next(true);
    this.storeUserInfo(token.auth_token);
  }

  storeUserInfo(jwttoken:string){
    let token= this.jwtHelper.decodeToken(jwttoken);
    this.user.name= token.id;
    this.user.fullname= token.name;
    this.user.country= token.country;
    this.user.state = token.state;
    this.user.area = token.area;
    this.user.companyCode= token.company;
    this.user.branchCode = token.branch;
    this.user.location= token.location;
    this.user.city = token.city;
    this.user.role = token.role;
    console.log(this.user);   
  }

  getUserInfo():UserInfo{
    let jwttoken= localStorage.getItem('_token');
    this.storeUserInfo(jwttoken);
    return this.user;
  }

  logOut() {
    this.isvalidUser =false;
     this.authChanged.next(false);
     localStorage.removeItem('_token');
  }

   isAuthenticated() {
    let token= localStorage.getItem('_token');
    let isvalid:boolean=false;
    if (token!=null){
        try{
          isvalid =!this.jwtHelper.isTokenExpired(token);
        }catch(e)
        {
        //  console.log('invalid token');
          
        }
    }
   // console.log('isvalid'+isvalid);
    return isvalid;
  }
  
  getAuthToken(){
    let authToken="";
    let token= localStorage.getItem('_token');
    let isvalid:boolean=false;
    if (token!=null){
        try{
         // authToken= this.jwtHelper.decodeToken(token);
          authToken = token;
        }catch(e)
        {
          console.log('invalid token');
          
        }
    }
    return "Bearer "+ authToken;
  }
  
  requestAccess(screenid: string) {
    let body = JSON.stringify({	"name":this.getUserID(),"password":'nill',"fullname":screenid});
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.getAuthToken());
    return this.http.post(this.apiUrl+'api/auth/access',
                   body,{ headers: headers });
  }

  getUserID(){
    this.userId ="";
    let token= localStorage.getItem('_token');
    let isvalid:boolean=false;
    if (token!=null){
        try{
          var decode= this.jwtHelper.decodeToken(token);
          this.userId = decode.aud;
        }catch(e)
        {
          console.log('invalid token');
          
        }
    }
    return this.userId;
  }

  changePassword(user:UserInfo):Observable<any> {
    let body = JSON.stringify(user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.apiUrl+'api/auth/change',
                  body,{ headers: headers });
 }

 resetPassword(userid:string):Observable<any> {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  return this.http.get(this.apiUrl+'api/auth/reset/'+userid,
                { headers: headers });
}

 TestAccess(screenid: string) {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', this.getAuthToken());
  return this.http.get(this.apiUrl+'api/items',
                 { headers: headers });
}
getCurrentOrders():Observable<any>{
  let headers = new HttpHeaders()
    .set('Authorization', this.getAuthToken());
  return this.httpcl.get<any>(this.apiUrl+'api/order/currentno',{ headers: headers });
}
}
