export interface BaseCustomer {
  id: string;
  name: string;
}

export interface CustomerDTO extends BaseCustomer {
  token: string;
}

export interface FullCustomerDTO extends BaseCustomer {
  tableNumber: string;
  ordersCount: number;
  reserveTableAt: Date;
  loggedOutAt: Date;
}
