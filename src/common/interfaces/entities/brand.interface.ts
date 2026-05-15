export interface IBrand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  website: string | null;
  country: string | null;
  createdAt: Date;
  updatedAt: Date;
}
