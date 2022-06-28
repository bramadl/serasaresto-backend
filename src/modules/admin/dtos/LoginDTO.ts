export interface AdminDTO {
  id: string;
  avatar: string;
  name: string;
  email: string;
  lastLoggedInAt: Date;
  role: string;
}

export interface LoginDTO {
  user: AdminDTO;
  token: string;
}
