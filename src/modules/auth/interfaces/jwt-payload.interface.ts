import { Role } from '../../../common/constants/app.constant';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface JwtRefreshPayload extends JwtPayload {
  refreshToken: string;
}
