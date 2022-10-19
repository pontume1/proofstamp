import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './_layout/header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AnalysticComponent } from './analystic/analystic.component';
import { DocumantationComponent } from './documantation/documantation.component';
import { ActivityComponent } from './profile/activity/activity.component';
import { PurchacesComponent } from './profile/purchaces/purchaces.component';
import { ProfileComponent } from './profile/profile.component';
import { PricingComponent } from './pricing/pricing.component';
import { PayoutComponent } from './payout/payout.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './_layout/menu/menu.component';
import { SitelayoutComponent } from './_layout/sitelayout/sitelayout.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartjsModule } from 'ng-chartjs';
import { AgGridModule } from 'ag-grid-angular';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AnalysticComponent,
    DocumantationComponent,
    ActivityComponent,
    PurchacesComponent,
    ProfileComponent,
    PricingComponent,
    PayoutComponent,
    InvoiceComponent,
    LoginComponent,
    MenuComponent,
    SitelayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartjsModule,
    AgGridModule,
    NgxPayPalModule,
    NgxDaterangepickerMd.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
