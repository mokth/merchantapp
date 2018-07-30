import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Observable } from 'rxjs/Observable';
import { AdUser, UserInfo } from './../../shared/model';

@Injectable()
export class AdUserService {

 constructor(private http:HttpClient,
        private auth:AuthService,
        @Inject('API_URL') private apiUrl:string) 
  { }

  getUsers():Observable<AdUser[]>{
    let headers = new HttpHeaders()
      .set('Authorization', this.auth.getAuthToken());
    return this.http.get<AdUser[]>(this.apiUrl+'api/auth',{ headers: headers });
  }

  saveUser(item:AdUser):Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type',"application/json")
      .set('Authorization', this.auth.getAuthToken());
    let body: string = JSON.stringify(item);
    return this.http.post(this.apiUrl+'api/auth/save',
                   body, { headers: headers });
  }

  saveNewUser(item:AdUser):Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type',"application/json")
      .set('Authorization', this.auth.getAuthToken());
    let body: string = JSON.stringify(item);
    return this.http.post(this.apiUrl+'api/auth/new',
                   body, { headers: headers });
  }

  changePassword(user:UserInfo) {
    let body = JSON.stringify(user);
    let headers = new HttpHeaders()
    .set('Content-Type',"application/json")
    .set('Authorization', this.auth.getAuthToken());
   
    this.http.post(this.apiUrl+'api/auth/change',
                  body,{ headers: headers });
     
 }
}