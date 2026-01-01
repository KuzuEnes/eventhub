import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({ data: dto, include: { venue: true, category: true } });
  }

  async findAll(filters: {
    q?: string;
    categoryId?: number;
    venueId?: number;
    from?: string;
    to?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};
    if (filters.q) where.title = { contains: filters.q, mode: 'insensitive' };
    if (filters.categoryId) where.categoryId = Number(filters.categoryId);
    if (filters.venueId) where.venueId = Number(filters.venueId);
    if (filters.from || filters.to) where.startAt = {};
    if (filters.from) where.startAt.gte = new Date(filters.from);
    if (filters.to) where.startAt.lte = new Date(filters.to);

    const skip = filters.skip ?? 0;
    const take = filters.take ?? 20;

    return this.prisma.event.findMany({ where, skip, take, orderBy: { startAt: 'asc' }, include: { venue: true, category: true } });
  }

  async findById(id: number) {
    const ev = await this.prisma.event.findUnique({ where: { id }, include: { venue: true, category: true } });
    if (!ev) throw new NotFoundException('Event not found');
    return ev;
  }

  async update(id: number, dto: UpdateEventDto) {
    await this.findById(id);
    return this.prisma.event.update({ where: { id }, data: dto, include: { venue: true, category: true } });
  }

  async remove(id: number) {
    await this.findById(id);
    return this.prisma.event.delete({ where: { id } });
  }
}
