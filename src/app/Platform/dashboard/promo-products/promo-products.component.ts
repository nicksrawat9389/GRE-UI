import { Component, inject } from '@angular/core';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { PromoOrderStateService } from '../Services/promo-order-state.service';
import { take } from 'rxjs';
import { PromoProductsService } from '../Services/promo-products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromoOrderPriceValidating, UserPromoCartItem } from '../../../Core/common/CommonModels/ProductModel';
export interface PromoProduct {
  productId: number;
  productName: string;
  productType: string;
  description: string;
  productPrice: number;
  productBase64: string;
  productQuantity: number;
  subtotal: number;
  actualSubTotal?: number;
  masterSizes: any[];
  masterSizeId: number;
  sizeName:string;
}
@Component({
  selector: 'app-promo-products',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './promo-products.component.html',
  styleUrl: './promo-products.component.css'
})
export class PromoProductsComponent {

  productType: string = "promo";
  user: JwtPayload | null = null;
  promoProducts: PromoProduct[] = []
  totalAmount: number = 0;
  actualPromoCart: UserPromoCartItem[] = [];
  isConfirmed: boolean = false;
  showConfirmValidation: boolean = false;
  savedCartLength: number = 0;

  private authService = inject(AuthService);
  private promoProductsService = inject(PromoProductsService);
  private toaster = inject(ToastrService);
  private promoOrderStateService = inject(PromoOrderStateService);
  private router = inject(Router);
  cart: PromoProduct[] = [];
    selectedProductModal?: PromoProduct;


  constructor() {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    this.promoOrderStateService.cart$.subscribe(items => {
      this.cart = items;
    });
    this.getPromoProducts();
    this.getCartItems();
  }



  getPromoProducts() {
    const filterModel = {
      productType: this.productType,
      userClassification: ""
    }
    this.promoProductsService.getAllProducts(filterModel).subscribe((res: any) => {
      if (res.statusCode == 200) {
        const freshProducts = res.data as PromoProduct[];
        console.log('Promo Products', freshProducts)
        const cart = this.promoOrderStateService.getCart();

        // Merge cart values into fresh products
        const mergedProducts = freshProducts.map(p => {
          const match = cart.find(c => c.productId === p.productId);
          return {
            ...p,
            masterSizeId: match?.masterSizeId || (p.masterSizes?.[0]?.sizeId || 1),
            productQuantity: match?.productQuantity || 0,
            subtotal: match?.subtotal || 0
          };
        });

        this.promoProducts = mergedProducts;
        this.calculateTotal();
      }
      else {
        this.toaster.error(res.message);
      }
    })
  }
  calculateTotal(): void {
    this.totalAmount = this.promoProducts
      .filter(p => (p.productQuantity || 0) > 0)
      .reduce((sum, p) => sum + (p.subtotal || 0), 0);
  }


  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'
    ];

    // Allow digits and control keys only
    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault(); // Block letters and other keys
    }
  }
  onFocus(product: any, field: 'productQuantity') {
    if (product[field] === 0 || product[field] === null) {
      product[field] = ''; // Clear for better UX
    }
  }

  onBlur(product: any, field: 'productQuantity') {
    if (product[field] === '' || product[field] === null) {
      product[field] = 0; // Reset to 0 if left empty
    }
  }

  updateSubtotal(event: any, product: PromoProduct, field: 'productQuantity'): void {
    debugger
    const inputValue = event.target.value;

    if (/^\d*$/.test(inputValue)) {

      const productQuantity = Number(product.productQuantity) || 0;
      product.productQuantity = productQuantity;
      if (productQuantity > 0) {
        const subtotal = (product.productQuantity * product.productPrice)
        product.subtotal = +subtotal.toFixed(2);

      }
      else {
        product.subtotal = 0;
      }
      this.promoOrderStateService.addOrUpdateProduct(product);
      this.calculateTotal();
    }
    else {
      // Strip non-digits
      event.target.value = product[field] || '';
    }
  }
  getCartItems(){
    
    this.promoProductsService.getPromoCartItems().subscribe((res:any)=>{
      if(res.statusCode == 200 && res.data && res.data.length > 0){
        this.savedCartLength = res.data.length;
      }
      else{
        this.savedCartLength = 0;
      }

    })
  }

  toNumber(value: any): number {
    return value ? +value : 0;
  }

  goToConfirmation(): void {
    debugger

     if (!this.isConfirmed) {
    this.showConfirmValidation = true;
    return;
  }

  this.showConfirmValidation = false;

    const invalidQuantity = this.cart.find(item => item.productQuantity <= 0);

    if (invalidQuantity) {
      this.toaster.error('Quantity must be in greater than 0.');
      return;
    }




    this.actualPromoCart = this.cart.map(item => {
      return {
        productId: item.productId,
        productQuantity: item.productQuantity,
        masterSizeId: item.masterSizeId
      } as UserPromoCartItem;
    });

    this.promoProductsService.addOrGetPromoCartItems(this.actualPromoCart).subscribe((res: any) => {
      if (res.statusCode === 200) {
        const serverCart = res.data as PromoOrderPriceValidating[];
        let allValid = true;

        serverCart.forEach(item => {
          const product = this.cart.find(p => p.productId === item.ProductId);
          if (product) {
            const isQuantityEqual = product.productQuantity === item?.ProductQuantity;
            const isPriceEqual = product.productPrice === item?.ProductPrice;

            const calculatedSubtotal = +(item.ProductQuantity * item.ProductPrice).toFixed(2);
            const isSubtotalEqual = +product.subtotal.toFixed(2) === calculatedSubtotal;

            const isProductValid = isQuantityEqual && isPriceEqual && calculatedSubtotal && isSubtotalEqual;

            if (!isProductValid) {
              allValid = false;


            } else {
              product.productQuantity = item.ProductQuantity;

              product.subtotal = calculatedSubtotal;
              this.promoOrderStateService.addOrUpdateProduct(product);
              // Apply backend-validated values (optional)
            }
          }
        });

        if (allValid) {
          // Navigate if all validations passed
          this.router.navigateByUrl('/dashboard/promo-order-confirmation');
        } else {
          this.toaster.error(res.message);
        }
      } else {
        this.toaster.error(res.message);
      }
       this.isConfirmed = false;
    this.showConfirmValidation = false;
    });
  }



    openProductDetailModal(product: PromoProduct) {
        debugger
        this.selectedProductModal = product;
        // @ts-ignore
        this.selectedProductModal = {
          ...this.selectedProductModal,
          productBase64: `data:image/jpeg;base64,${this.selectedProductModal?.productBase64}`,
        }
        const modal = new (window as any).bootstrap.Modal(document.getElementById('exampleModal')!);
        modal.show();
      }
}
