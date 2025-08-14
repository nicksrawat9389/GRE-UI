import { Component, inject, ViewChild } from '@angular/core';
import { PromoProductsService } from '../Services/promo-products.service';
import { PromoOrderStateService } from '../Services/promo-order-state.service';
import { PromoProduct } from '../promo-products/promo-products.component';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderConfirmModalComponent } from '../../../Core/common/order-confirm-modal/order-confirm-modal.component';

@Component({
  selector: 'app-promo-order-confirmation',
  imports: [CommonModule, FormsModule, RouterLink, OrderConfirmModalComponent],
  templateUrl: './promo-order-confirmation.component.html',
  styleUrl: './promo-order-confirmation.component.css'
})
export class PromoOrderConfirmationComponent {

  private promoProductsService = inject(PromoProductsService);
  private promoOrderStateService = inject(PromoOrderStateService);
  private toasterService = inject(ToastrService);
  modalRef: any; // Bootstrap modal reference

  private router = inject(Router);
  cartItems = this.promoOrderStateService.cart$;
  isConfirmed: boolean = false;
showConfirmValidation: boolean = false; 
  selectedProductModal?: PromoProduct;
 @ViewChild('successModal') successModal!: OrderConfirmModalComponent;
  orderType:string='Promo'


  totalAmount$ = this.cartItems.pipe(
    map(items =>
      items.reduce((sum, p) => sum + (p.subtotal || 0), 0)
    )
  );
  constructor() {
    this.getCartItems();
  }


  getCartItems() {
    this.promoProductsService.getPromoCartItems().subscribe((res: any) => {
      if (res.statusCode == 200 && res.data && res.data.length > 0) {
        console.log('simple', res.data);
        this.promoOrderStateService.clearCart();
        res.data.forEach((item: PromoProduct) => {
          item.sizeName = item.sizeName;
          item.subtotal = item.subtotal || 0;
        });
        this.promoOrderStateService.setCart(res.data as PromoProduct[]);
      }

    })
  }

  submitOrder() {
    debugger
    if (!this.isConfirmed) {
    this.showConfirmValidation = true;
    return;
  }

  this.showConfirmValidation = false;
    console.log(this.isConfirmed);
    debugger
    this.promoProductsService.orderPromoProducts().subscribe((res: any) => {
      if (res.statusCode == 200) {
               this.successModal.show();

        // this.toasterService.success(res.message);
        this.promoOrderStateService.clearCart();
        this.getCartItems();
        // this.router.navigate(['/dashboard/promo-products']);
      }
      else {
        this.router.navigate(['/dashboard/promo-products']);
      }
      this.isConfirmed = false;
    this.showConfirmValidation = false;
    });
  }


  openProductDetailModal(product: PromoProduct) {
    this.selectedProductModal = {
      ...product,
      productBase64: `data:image/jpeg;base64,${product.productBase64}`,
    };

    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      // Only initialize once
      if (!this.modalRef) {
        this.modalRef = new (window as any).bootstrap.Modal(modalElement, {
          keyboard: true
        });
      }
      this.modalRef.show();
    }
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
      
    }
  }
  onSuccessModalClosed(): void {
  this.router.navigate(['/dashboard/home']);
}
}
