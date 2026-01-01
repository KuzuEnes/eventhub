import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async register(userId: number, eventId: number) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    const regCount = await this.prisma.registration.count({ where: { eventId } });
    if (regCount >= event.capacity) throw new BadRequestException('Event is full');

    const existing = await this.prisma.registration.findFirst({ where: { userId, eventId } });
    if (existing) throw new ConflictException('User already registered for this event');

    return this.prisma.registration.create({ data: { userId, eventId }, include: { user: true, event: true } });
  }

  async unregister(userId: number, eventId: number) {
    const existing = await this.prisma.registration.findFirst({ where: { userId, eventId } });
    if (!existing) throw new NotFoundException('Registration not found');
    await this.prisma.registration.delete({ where: { id: existing.id } });
    return { success: true };
  }

  async listMyRegistrations(userId: number) {
    return this.prisma.registration.findMany({ where: { userId }, include: { event: { include: { venue: true, category: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async listEventRegistrations(eventId: number) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    return this.prisma.registration.findMany({ where: { eventId }, include: { user: true }, orderBy: { createdAt: 'asc' } });
  }

  async removeRegistration(eventId: number, registrationId: number) {
    const reg = await this.prisma.registration.findUnique({ where: { id: registrationId } });
    if (!reg || reg.eventId !== eventId) throw new NotFoundException('Registration not found for this event');
    await this.prisma.registration.delete({ where: { id: registrationId } });
    return { success: true };
  }
}
