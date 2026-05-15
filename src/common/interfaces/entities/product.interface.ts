import { ICategory } from './category.interface';
import { IBrand } from './brand.interface';

export type SwitchType = 'LINEAR' | 'TACTILE' | 'CLICKY';
export type Connectivity = 'WIRED' | 'WIRELESS' | 'BLUETOOTH';
export type Layout =
  | 'FULL'
  | 'TKL'
  | 'SEVENTY_FIVE'
  | 'SIXTY_FIVE'
  | 'SIXTY'
  | 'SPLIT';

export interface IProductImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
}

export interface IProductSpec {
  id: string;
  key: string;
  value: string;
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  thumbnail: string;
  brand: IBrand;
  category: ICategory;
  switchType: SwitchType | null;
  layout: Layout | null;
  connectivity: Connectivity | null;
  colors: string[];
  material: string | null;
  weight: number | null;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  tags: string[];
  featured: boolean;
  images: IProductImage[];
  specs: IProductSpec[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
