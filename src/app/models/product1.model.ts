export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;        // changed from imageUrl
  salesperson_id: number;   // changed from salespersonId
}
