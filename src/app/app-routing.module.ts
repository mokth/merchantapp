import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductComponent } from './product/product.component';
import { UploadimgComponent } from './product/uploadimg/uploadimg.component';
import { AuthguardService } from './shared/AuthguardService';
import { MainpageComponent } from './mainpage/mainpage.component';

const routes: Routes = [
  
  {
    path: '', component:MainpageComponent    
  },
  {
    path: 'home', component:MainpageComponent    
  },
  {
    path: 'auth', 
    loadChildren: 'app/authmodule/authmodule.module#AuthmoduleModule'
  },
  {
    path: 'order',canActivate: [AuthguardService],
    loadChildren: 'app/ordermgt/ordermgt.module#OrdermgtModule'
  },
  {
    path: 'member',
    loadChildren: 'app/member/member.module#MemberModule'
  },
  
  {
    path: 'product',component: ProductComponent,canActivate: [AuthguardService],
  },
  {
    path: 'upload',component: UploadimgComponent,canActivate: [AuthguardService],
  },
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
