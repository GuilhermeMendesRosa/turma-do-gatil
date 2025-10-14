export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  name: string;
}

export interface User {
  username: string;
  name: string;
  token: string;
}
