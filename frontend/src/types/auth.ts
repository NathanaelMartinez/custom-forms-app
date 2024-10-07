export interface DecodedToken {
  sub: string; // user ID
  username: string;
  email: string;
  role: string;
  status: string; // add status here
  createdAt: string; // ensure this matches the format (ISO string if using Date)
  exp: number;
}
