export interface LoginDTO {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}
