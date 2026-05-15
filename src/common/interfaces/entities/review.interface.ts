export interface IReview {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}
