export interface ICartDTO {
  id: string;
  total: number;
  cartItems: {
    quantity: number;
    note: string;
    menu: {
      id: string;
      name: string;
      description: string;
      price: number;
      thumbnail: string;
      inStock: boolean;
      type: string;
    };
  }[];
}
