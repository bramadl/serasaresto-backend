export interface ICartDTO {
  id: string;
  table: {
    number: string;
    token: string;
    isReserved: boolean;
  };
  total: number;
  cartItems: {
    quantity: number;
    note: string;
    menu: {
      name: string;
      description: string;
      price: number;
      thumbnail: string;
      inStock: boolean;
      type: string;
    };
  }[];
}
