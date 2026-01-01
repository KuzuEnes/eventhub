import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenuesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVenueDto) {
    return this.prisma.venue.create({ data: dto });
  }

  async findAll(opts?: { skip?: number; take?: number }) {
    const { skip = 0, take = 20 } = opts || {};
    return this.prisma.venue.findMany({ skip, take, orderBy: { id: 'asc' } });
  }

  async findById(id: number) {
    const venue = await this.prisma.venue.findUnique({ where: { id } });
    if (!venue) throw new NotFoundException('Venue not found');
    return venue;
  }

  async update(id: number, dto: UpdateVenueDto) {
    await this.findById(id);
    return this.prisma.venue.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    // don't delete if events exist
    const count = await this.prisma.event.count({ where: { venueId: id } });
    if (count > 0) {
      throw new Error('Venue has associated events and cannot be deleted');
    }
    return this.prisma.venue.delete({ where: { id } });
  }
}
