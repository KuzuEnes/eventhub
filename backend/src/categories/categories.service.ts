import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ data: dto });
    } catch (e) {
      // let global Prisma filter handle uniqueness (P2002) or rethrow
      throw e;
    }
  }

  async findAll(opts?: { skip?: number; take?: number }) {
    const { skip = 0, take = 20 } = opts || {};
    return this.prisma.category.findMany({ skip, take, orderBy: { id: 'asc' } });
  }

  async findById(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findById(id);
    try {
      return this.prisma.category.update({ where: { id }, data: dto });
    } catch (e) {
      throw e;
    }
  }

  async remove(id: number) {
    // prevent deletion if events exist in this category
    const count = await this.prisma.event.count({ where: { categoryId: id } });
    if (count > 0) throw new BadRequestException('Category has associated events and cannot be deleted');
    return this.prisma.category.delete({ where: { id } });
  }
}
