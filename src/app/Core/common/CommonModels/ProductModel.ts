export class UserCartItem {
    productId: number = 0;
    orderCases: number = 0;
    orderCartons: number = 0;
}
export class UserPromoCartItem {
    productId: number = 0;
    productQuantity: number = 0;
    masterSizeId:number = 0;
}
export class OrderPriceValidating {
    ProductId: number = 0;
    ProductName: string = '';
    ProductImageName: string = '';
    Description: string = '';
    OrderCases: number = 0;
    OrderCartons: number = 0;
    PricePerCase: number = 0;
    PricePerCarton: number = 0;
    ActualSubTotal: number = 0;
}


export class PromoOrderPriceValidating {
    ProductId: number = 0;
    ProductName: string = '';
    ProductImageName: string = '';
    Description: string = '';
    ProductQuantity: number = 0;
    ProductPrice:number=0;
    SubTotal: number = 0;
}