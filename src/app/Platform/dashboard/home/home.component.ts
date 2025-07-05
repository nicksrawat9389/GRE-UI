import { Component, inject } from '@angular/core';
import { AuthService } from '../../../Auth/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  storeName: string = 'Default Store';

  featuredProduct: any = null;
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);

  constructor() {
    this.authService.user$.subscribe(user => {
      this.storeName = user?.StoreName || 'No Store';
    });

    this.getFeaturedProduct();
  }

  getFeaturedProduct() {
    this.dashboardService.getFeaturedProduct().subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.featuredProduct = res.data || null;
        this.featuredProduct = {
          ...this.featuredProduct,
          productBase64: `data:image/jpeg;base64,${this.featuredProduct?.productBase64}`,
        }
      }
      else {
        this.featuredProduct = res.data || null;
        console.log(this.featuredProduct);
      }
    })
  }
}
