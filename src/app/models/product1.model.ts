export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  salesperson_id: number;   // changed from sellerId to salesperson_id
}
