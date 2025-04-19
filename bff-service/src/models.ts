export interface CartItem {
  product: ProductItem;
  count: number;
}

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface CreateOrderDto {
  items: CartItem[];
  address: Address;
}

export interface Address {
  address: string;
  firstName: string;
  lastName: string;
  comment: string;
}
