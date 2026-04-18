export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'superadmin';
  language: 'en' | 'es' | 'fr';
  isEmailVerified: boolean;
  tokenBalance: number;
  createdAt: string;
}
