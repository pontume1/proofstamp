import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SitelayoutComponent } from './_layout/sitelayout/sitelayout.component'

import { HomeComponent } from './home/home.component'
import { AnalysticComponent } from './analystic/analystic.component'
import { DocumantationComponent } from './documantation/documantation.component'
import { ProfileComponent } from './profile/profile.component'
import { PricingComponent } from './pricing/pricing.component'
import { PayoutComponent } from './payout/payout.component'
import { InvoiceComponent } from './invoice/invoice.component'
import { LoginComponent } from './login/login.component'


const routes: Routes = [
  {
    path: '',
    component: SitelayoutComponent, 
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'analystic', component: AnalysticComponent },
      { path: 'analystic/:id', component: AnalysticComponent },
      { path: 'documantation', component: DocumantationComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'payout/:id', component: PayoutComponent },
      { path: 'invoice', component: InvoiceComponent }
    ]
  },
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
