import { Controller, Post, Body, UseGuards, Patch, Param, ParseIntPipe, Delete, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create category (ADMIN only)' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'List categories (authenticated)' })
  @ApiQuery({ name: 'page', required: false })
  async list(@Query('page') page?: string) {
    const p = Math.max(1, parseInt(page || '1'));
    const take = 20;
    const skip = (p - 1) * take;
    return this.service.findAll({ skip, take });
  }

  @Get(':id')
  @Roles('ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Get category by id (authenticated)' })
  @ApiParam({ name: 'id' })
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update category (ADMIN only)' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete category (ADMIN only) — fails if events exist' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
