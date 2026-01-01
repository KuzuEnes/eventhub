import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; passwordHash: string; role?: string }) {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAll(opts?: { skip?: number; take?: number }) {
    const { skip = 0, take = 20 } = opts || {};
    return this.prisma.user.findMany({ skip, take, orderBy: { id: 'asc' } });
  }

  async updateRole(id: number, role: string) {
    return this.prisma.user.update({ where: { id }, data: { role } });
  }
}
