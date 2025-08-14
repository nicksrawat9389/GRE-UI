export class OrderHistory {
  date!: Date;
  submittedBy!: string;
  numberOfProducts!: number;
  totalPrice!: number;
}

export class OrderHistoryFilterModel {
  fromDate: Date|null  = null;
  toDate: |null  = null; 
}