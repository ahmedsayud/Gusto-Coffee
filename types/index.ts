export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  degree: string; // e.g., "درجة 1" أو "درجة 2"
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  delivery: boolean;
  completed: boolean;
  createdAt: string; // ISO string
}
