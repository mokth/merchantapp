import { Injectable } from '@angular/core';

@Injectable()
export class ShareservicesService {

  constructor() { }
  
  getTest(){
    return "this is shared services";
  }
}
