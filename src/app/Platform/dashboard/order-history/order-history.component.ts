import { Component, inject } from '@angular/core';
import { OrderService } from '../Services/order.service';
import { OrderHistory, OrderHistoryFilterModel } from '../../../Core/common/CommonModels/OrderModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule,FormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {


  private orderService = inject(OrderService);
  private toasterService = inject(ToastrService);
  today: string = new Date().toISOString().split('T')[0];  // 'YYYY-MM-DD'

  filterModel:OrderHistoryFilterModel = new OrderHistoryFilterModel();
  orderHistory: OrderHistory[] = [];
  constructor() {
    // Initialize filterModel if needed
   

    this.getOrderHistory();
    
  }

  
get isInvalidDateRange(): boolean {
  if (!this.filterModel.fromDate || !this.filterModel.toDate) return false;
  return new Date(this.filterModel.fromDate) > new Date(this.filterModel.toDate);
}

  getOrderHistory() {
    if (this.isInvalidDateRange) {
      this.toasterService.error("Invalid date range selected. Please select a valid range.")
      this.filterModel.fromDate = null;
      this.filterModel.toDate = null;
      return;
    }
    this.orderService.getOrderHistory(this.filterModel).subscribe((res:any)=>{
      if(res.statusCode==200 ){

        this.orderHistory = res.data as OrderHistory[];
        console.log(this.orderHistory);
      }
      else{
        this.orderHistory = [];
      }
    })
  }


    
resetFilter(){
  this.filterModel = new OrderHistoryFilterModel();
  this.getOrderHistory(); // Refresh the order history after resetting the filter
}




}
