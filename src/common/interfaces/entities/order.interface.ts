export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface IOrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  productSnapshot: Record<string, unknown>;
}

export interface IOrder {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  addressSnapshot: Record<string, unknown>;
  items: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
