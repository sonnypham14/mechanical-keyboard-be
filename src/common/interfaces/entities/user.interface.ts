import { Role } from '../../constants/app.constant';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IAddress {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  zipCode: string;
  isDefault: boolean;
}
