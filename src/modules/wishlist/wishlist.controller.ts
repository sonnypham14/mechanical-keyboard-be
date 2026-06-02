import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Wishlist')
@ApiBearerAuth('access-token')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get my wishlist' })
  findAll(@CurrentUser() user: JwtPayload, @Query() query: PaginationDto) {
    return this.wishlistService.findMyWishlist(user.sub, query);
  }

  @Post()
  @ApiOperation({ summary: 'Add product to wishlist' })
  add(@CurrentUser() user: JwtPayload, @Body() dto: AddToWishlistDto) {
    return this.wishlistService.add(user.sub, dto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.remove(user.sub, productId);
  }
}
