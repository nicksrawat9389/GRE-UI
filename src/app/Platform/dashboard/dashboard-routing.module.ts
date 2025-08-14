import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProductsComponent } from './products/products.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { PrivacyAndCookiesComponent } from './privacy-and-cookies/privacy-and-cookies.component';
import { PromoProductsComponent } from './promo-products/promo-products.component';
import { PromoOrderConfirmationComponent } from './promo-order-confirmation/promo-order-confirmation.component';
import { PromoOrderHistoryComponent } from './promo-order-history/promo-order-history.component';

const routes: Routes = [
  {
    path:'',
    component:DashboardComponent,
    children:[
      {
        path:'products',
        component:ProductsComponent
      },
      {
        path:'promo-products',
        component:PromoProductsComponent
      },
      {
        path:'faq',
        component:FaqComponent
      },
      {
        path:'home',
        component:HomeComponent
      },
      {
        path:'newsletter',
        component:NewsletterComponent
      },
      {
        path:'order-confirmation',
        component:OrderConfirmationComponent 
      },
      {
        path: 'account',
        loadChildren: () => import('../accounts/accounts.module').then(m => m.AccountsModule)
      },
      {
        path: 'order-history',
        component:OrderHistoryComponent
      },
      {
        path: 'promo-order-history',
        component:PromoOrderHistoryComponent
      },
      {
        path:'T&C',
        component:TermsAndConditionComponent
      },
      {
        path:'cookies&policy',
        component:PrivacyAndCookiesComponent
      },
      {
        
        path:'promo-order-confirmation',
        component:PromoOrderConfirmationComponent 
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
