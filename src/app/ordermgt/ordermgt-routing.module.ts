import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdercompComponent } from './ordercomp.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderItemsComponent } from './order-items/order-items.component';
import { OrderTrxComponent } from './order-trx/order-trx.component';

const routes: Routes = [
  { path: '',  component: OrdercompComponent  },
  { path: 'orders',  component: OrderListComponent  },
  { path: 'trxorders',  component: OrderTrxComponent  },
  { path: 'orderitem',  component: OrderItemsComponent  }
];
//OrderItemsComponent
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdermgtRoutingModule { }
