import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberProfileComponent } from './profile/member-profile/member-profile.component';
import { ItemComponent } from './merchant-item/item/item.component';
import { ItemListComponent } from './merchant-item/item-list/item-list.component';
import { MembermainComponent } from './membermain.component';
import { BusinesHoursComponent } from './busines-hours/busines-hours.component';
import { ItemImagesComponent } from './merchant-item/item-images/item-images.component';
import { MemberListComponent } from './profile/member-list/member-list.component';
import { AuthguardService } from '../shared/AuthguardService';
import { RegisterComponent } from './register/register.component';
import { CanDeactivateGuard } from '../shared/CanDeactivateGuard';

const routes: Routes = [
  { path: '',  component: MembermainComponent,canActivate: [AuthguardService] },
  { path: 'register',  component: RegisterComponent },
  { path: 'profile',  component: MemberProfileComponent,canActivate: [AuthguardService]  },
  { path: 'items',  component: ItemListComponent ,canActivate: [AuthguardService]  },
  { path: 'item/:id',  component: ItemComponent ,canActivate: [AuthguardService], canDeactivate: [CanDeactivateGuard]  },
  { path: 'itemimages',  component: ItemImagesComponent ,canActivate: [AuthguardService] },
  { path: 'bizhours',  component: BusinesHoursComponent ,canActivate: [AuthguardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
