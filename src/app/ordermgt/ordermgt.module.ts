import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdermgtRoutingModule } from './ordermgt-routing.module';
import { OrdercompComponent } from './ordercomp.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { HttpClientModule } from '../../../node_modules/@angular/common/http';
import { FontAwesomeModule } from '../../../node_modules/@fortawesome/angular-fontawesome';
import { DxCalendarModule, DxDataGridModule, DxDateBoxModule, DxPopupModule } from '../../../node_modules/devextreme-angular';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';
import { OrderApiService } from './services/api-services.service';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderItemsComponent } from './order-items/order-items.component';
import { OrderTrxComponent } from './order-trx/order-trx.component';

 
@NgModule({
  imports: [
    CommonModule,
    ImageCropperModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DxCalendarModule,
    DxDataGridModule,
    DxDateBoxModule,    
    DxPopupModule, 
    TranslateModule,
    OrdermgtRoutingModule
  ],
  declarations: [
    OrdercompComponent,
    OrderListComponent,
    OrderItemsComponent,
    OrderTrxComponent
  ],
  providers: [
    OrderApiService
              
                ],
})
export class OrdermgtModule { }
