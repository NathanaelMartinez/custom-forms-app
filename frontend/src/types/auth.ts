export interface DecodedToken {
  sub: string; // userId
  username: string;
  email: string;
  role: string; // ('admin' || 'user')
}
