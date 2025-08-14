import { Component, inject } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { OrderStateService } from '../order-state.service';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs/operators';
import { OrderPriceValidating, UserCartItem } from '../../../Core/common/CommonModels/ProductModel';
import { AuthService, JwtPayload } from '../../../Auth/auth/auth.service';
export interface Product {
  productId: number;
  productName: string;
  productType: string;
  description: string;
  productPricePerCase: number;
  productPricePerCarton: number;
  productBase64: string;
  productPrice:number
  isFeatured: boolean;
  orderCases: number;
  orderCartons: number;
  subtotal: number;
  actualSubTotal?: number;
}
@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  productType:string = "sales";
  products: Product[] = [];
  user:JwtPayload | null = null;
  selectedProductModal?: Product;
  TotalAmount: number = 0;
  isConfirmed: boolean = false;
  cart: Product[] = [];
  actualCart: UserCartItem[] = [];
  savedCartLength: number = 0;
    showConfirmValidation: boolean = false;

  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private toaster = inject(ToastrService);
  private orderStateService = inject(OrderStateService);
  private router = inject(Router);




  constructor() {
    this.authService.user$.pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    this.orderStateService.cart$.subscribe(items => {
      this.cart = items;    
    });
    this.getProducts();
    this.getCartItems();
  } 

  getProducts() {
    const filterModel = {
      productType: this.productType,
      userClassification: ""
    }
    this.dashboardService.getAllProducts(filterModel).subscribe((res: any) => {
      if (res.statusCode == 200) {
        const freshProducts = res.data as Product[];
        const cart = this.orderStateService.getCart();

        // Merge cart values into fresh products
        const mergedProducts = freshProducts.map(p => {
          const match = cart.find(c => c.productId === p.productId);
          return {
            ...p,
            orderCases: match?.orderCases || 0,
            orderCartons: match?.orderCartons || 0,
            subtotal: match?.subtotal || 0
          };
        });

        this.products = mergedProducts;
        this.calculateTotal();
      }
      else {
        this.toaster.error(res.message);
      }
    })
  }

  openProductDetailModal(product: Product) {
    this.selectedProductModal = product;
    // @ts-ignore
    this.selectedProductModal = {
      ...this.selectedProductModal,
      productBase64: `data:image/jpeg;base64,${this.selectedProductModal?.productBase64}`,
    }
    const modal = new (window as any).bootstrap.Modal(document.getElementById('exampleModal')!);
    modal.show();
  }


 

  onCartonsInput(event: any, product: any) {
    debugger
  const value = parseInt(event.target.value, 10);

  if (!isNaN(value)) {
    if (value >= 5 && value % 5 === 0) {
      product.orderCartons = value;
    } else {
      // Invalid value: not a multiple of 5 or less than 5
      product.orderCartons = 0;
      //this.toaster.error('Cartons must be at least 5 and in multiples of 5.');
      event.target.value = ''; // Clear the input field
      this.onBlur(product, 'orderCartons'); // Reset to 0 if left empty
    }
  } else {
    product.orderCartons = 0;
  }

  this.updateSubtotal(event, product, 'orderCartons');
}


  updateSubtotal(event:any,product: Product,field: 'orderCases' | 'orderCartons'): void {
      const inputValue = event.target.value;

     if (/^\d*$/.test(inputValue)) {

       const cases = Number(product.orderCases) || 0;
       const cartons = Number(product.orderCartons) || 0;
       if (cases > 0 || cartons > 0) {
         const subtotal = (cases * product.productPricePerCase) +
         (cartons * product.productPricePerCarton);
         product.subtotal = +subtotal.toFixed(2);
         
       }
       else {
         product.subtotal = 0;
       }
       this.orderStateService.addOrUpdateProduct(product);
       this.calculateTotal();
     }
     else {
    // Strip non-digits
      event.target.value = product[field] || '';
  }
  }
  calculateTotal(): void {
    this.TotalAmount = this.products
      .filter(p => (p.orderCases || 0) > 0 || (p.orderCartons || 0) > 0)
      .reduce((sum, p) => sum + (p.subtotal || 0), 0);
  }

//   goToConfirmation(): void {
//     
//     const invalidCartonItem = this.cart.find(item => item.orderCartons < 5 && item.orderCartons > 0 && item.orderCartons % 5 !== 0);
    
//   if (invalidCartonItem) {
//     this.toaster.error('Cartons must be in multiples of 5.');
//     return;
//   }

  


//   this.actualCart = this.cart.map(item => {
//     return {
//       productId: item.productId,
//       orderCases: item.orderCases,
//       orderCartons: item.orderCartons
//     } as UserCartItem;
//   });

//   this.dashboardService.addOrGetCartItems(this.actualCart).subscribe((res: any) => {
//     if (res.statusCode === 200) {
//       const serverCart = res.data as OrderPriceValidating[];
//       let allValid = true;

//       serverCart.forEach(item => {
//         const product = this.cart.find(p => p.productId === item.ProductId);
//         if (product) {
//           const isCasesEqual = product.orderCases === item.OrderCases;
//           const isCartonsEqual = product.orderCartons === item.OrderCartons;
//           const isPricePerCaseEqual = product.productPricePerCase === item.PricePerCase;
//           const isPricePerCartonEqual = product.productPricePerCarton === item.PricePerCarton;

//           const calculatedSubtotal = +(item.OrderCases * item.PricePerCase + item.OrderCartons * item.PricePerCarton).toFixed(2);
//           const isSubtotalEqual = +product.subtotal.toFixed(2) === calculatedSubtotal;

//           const isProductValid = isCasesEqual && isCartonsEqual && isPricePerCaseEqual && isPricePerCartonEqual && isSubtotalEqual;

//           if (!isProductValid) {
//             allValid = false;
            

//           } else {
//             product.orderCases = item.OrderCases;
//             product.orderCartons = item.OrderCartons;
//             product.subtotal = calculatedSubtotal;
//             this.orderStateService.addOrUpdateProduct(product);
//             // Apply backend-validated values (optional)
//           }
//         }
//       });

//       if (allValid) {
//         // Navigate if all validations passed
//         this.router.navigateByUrl('/dashboard/order-confirmation');
//       } else {
//         this.toaster.error(res.message);
//       }
//     } else {
//       this.toaster.error(res.message);
//     }
//   });
// }



goToConfirmation(form: NgForm): void {
  // ✅ Confirm checkbox validation
  if (!this.isConfirmed) {
    this.showConfirmValidation = true;
    return;
  } else {
    this.showConfirmValidation = false;
  }

  const invalidCartonItem = this.cart.find(item => item.orderCartons < 5 && item.orderCartons > 0 && item.orderCartons % 5 !== 0);
  if (invalidCartonItem) {
    this.toaster.error('Cartons must be in multiples of 5.');
    return;
  }

  this.actualCart = this.cart.map(item => {
    return {
      productId: item.productId,
      orderCases: item.orderCases,
      orderCartons: item.orderCartons
    } as UserCartItem;
  });

  this.dashboardService.addOrGetCartItems(this.actualCart).subscribe((res: any) => {
    if (res.statusCode === 200) {
      const serverCart = res.data as OrderPriceValidating[];
      let allValid = true;

      serverCart.forEach(item => {
        const product = this.cart.find(p => p.productId === item.ProductId);
        if (product) {
          const isCasesEqual = product.orderCases === item.OrderCases;
          const isCartonsEqual = product.orderCartons === item.OrderCartons;
          const isPricePerCaseEqual = product.productPricePerCase === item.PricePerCase;
          const isPricePerCartonEqual = product.productPricePerCarton === item.PricePerCarton;

          const calculatedSubtotal = +(item.OrderCases * item.PricePerCase + item.OrderCartons * item.PricePerCarton).toFixed(2);
          const isSubtotalEqual = +product.subtotal.toFixed(2) === calculatedSubtotal;

          const isProductValid = isCasesEqual && isCartonsEqual && isPricePerCaseEqual && isPricePerCartonEqual && isSubtotalEqual;

          if (!isProductValid) {
            allValid = false;
          } else {
            product.orderCases = item.OrderCases;
            product.orderCartons = item.OrderCartons;
            product.subtotal = calculatedSubtotal;
            this.orderStateService.addOrUpdateProduct(product);
          }
        }
      });

      if (allValid) {
        this.router.navigateByUrl('/dashboard/order-confirmation');

        // ✅ RESET after successful confirmation
        this.isConfirmed = false;                    // Uncheck the box
        this.showConfirmValidation = false;          // Hide validation
        form.resetForm({ isConfirmed: false });      // Reset form state if needed
      } else {
        this.toaster.error(res.message);
      }
    } else {
      this.toaster.error(res.message);
    }
  });
}

getCartItems(){
    this.dashboardService.getCartItems().subscribe((res:any)=>{
      if(res.statusCode == 200 && res.data && res.data.length > 0){
        this.savedCartLength = res.data.length;
      }
      else{
        this.savedCartLength = 0;
      }

    })
  }

  onFocus(product: any, field: 'orderCases' | 'orderCartons') {
  if (product[field] === 0 || product[field] === null) {
    product[field] = ''; // Clear for better UX
  }
}

onBlur(product: any, field: 'orderCases' | 'orderCartons') {
  if (product[field] === '' || product[field] === null) {
    product[field] = 0; // Reset to 0 if left empty
  }
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

}
