export interface LoginDTO {
  user: {
    id: string;
    avatar: string;
    name: string;
    email: string;
    lastLoggedInAt: Date;
  };
  token: string;
}
