export interface IWishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    thumbnail: string;
    rating: number;
    reviewCount: number;
  };
  createdAt: Date;
}
