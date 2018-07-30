import 'bootstrap/dist/css/bootstrap.css';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DxCalendarModule,
         DxDateBoxModule,
         DxRadioGroupModule, 
         DxTemplateModule,
         DxDataGridModule,
         DxNumberBoxModule, 
         DxTagBoxModule,
         DxSelectBoxModule,
         DxCheckBoxModule, 
         DxFileUploaderModule,
         DxGalleryModule ,
         DxTextBoxModule} from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';


import { MembermainComponent } from './membermain.component';
import { ItemComponent } from './merchant-item/item/item.component';
import { MemberProfileComponent } from './profile/member-profile/member-profile.component';
import { MemberRoutingModule } from './member-routing.module';
import { BusinesHoursComponent } from './busines-hours/busines-hours.component';
import { ItemListComponent } from './merchant-item/item-list/item-list.component';
import { ItemImagesComponent } from './merchant-item/item-images/item-images.component';
import { ApiServicesService } from './services/api-services.service';
import { MemberListComponent } from './profile/member-list/member-list.component';
import { SharedModule } from '../shared/SharedModule';
import { RegisterComponent } from './register/register.component';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MemberRoutingModule,  
    FontAwesomeModule,
    DxCalendarModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxTemplateModule,
    DxNumberBoxModule,
    DxRadioGroupModule,
    DxCheckBoxModule,
    DxTagBoxModule,
    DxTextBoxModule,
    DxFileUploaderModule,
    DxSelectBoxModule,
    DxGalleryModule,
    SharedModule,  
    TranslateModule,
 
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDs3FY2F4-59e0V0o6qXzCCTSpyZqYS6eA'
    }),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }), 
  ],
  declarations: [MemberProfileComponent,
                 ItemComponent,
                 MembermainComponent, 
                 BusinesHoursComponent,
                 ItemListComponent,
                 ItemImagesComponent,
                 MemberListComponent,
                 RegisterComponent,
                ],
  providers: [
    ApiServicesService           
                ],
})
export class MemberModule { }
