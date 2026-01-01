import { Controller, Get, Query, Param, ParseIntPipe, NotFoundException, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { RoleUpdateDto } from './dto/role-update.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

function toSafe(user: any): UserResponseDto {
  const { passwordHash, ...rest } = user || {};
  return rest as UserResponseDto;
}

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List users (ADMIN only)' })
  @ApiQuery({ name: 'page', required: false })
  async list(@Query('page') page?: string) {
    const p = Math.max(1, parseInt(page || '1'));
    const take = 20;
    const skip = (p - 1) * take;
    const users = await this.usersService.findAll({ skip, take });
    return users.map(toSafe);
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get a user by id (ADMIN only)' })
  @ApiParam({ name: 'id' })
  async get(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException();
    return toSafe(user);
  }

  @Patch(':id/role')
  @Roles('ADMIN')
  @ApiOperation({ summary: "Update user's role (ADMIN only)" })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: RoleUpdateDto) {
    const updated = await this.usersService.updateRole(id, dto.role);
    return toSafe(updated);
  }
}
