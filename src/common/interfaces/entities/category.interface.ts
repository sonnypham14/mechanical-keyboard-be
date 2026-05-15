export interface ICategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}
