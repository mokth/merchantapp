import { PassData } from './model';
import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class PassDataService {

  public subject = new ReplaySubject(1) ;//new Subject<PassData>();
  constructor() 
  { }
 
  sendData(message: PassData) {
      this.subject.next(message);
      console.log('emit'+message.messageType);
  }

  clearData() {
      //this.subject.next();
  }

  getData(): Observable<any> {
      return this.subject.asObservable();
  }
}
