import { Controller, Post, Param, UseGuards, Delete, Get, Request, ParseIntPipe } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Registrations')
@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class RegistrationsController {
  constructor(private service: RegistrationsService) {}

  // STUDENT registers themself for an event
  @Post('events/:eventId/register')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Register current user to event (STUDENT)' })
  @ApiParam({ name: 'eventId' })
  async register(@Param('eventId', ParseIntPipe) eventId: number, @Request() req) {
    const userId = req.user.id;
    return this.service.register(userId, eventId);
  }

  // STUDENT unregisters themself
  @Delete('events/:eventId/register')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Unregister current user from event (STUDENT)' })
  @ApiParam({ name: 'eventId' })
  async unregister(@Param('eventId', ParseIntPipe) eventId: number, @Request() req) {
    const userId = req.user.id;
    return this.service.unregister(userId, eventId);
  }

  // STUDENT list own registrations
  @Get('me/registrations')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'List my registrations (STUDENT)' })
  async myRegistrations(@Request() req) {
    return this.service.listMyRegistrations(req.user.id);
  }

  // ADMIN: list registrations for an event
  @Get('events/:eventId/registrations')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List registrations for an event (ADMIN)' })
  @ApiParam({ name: 'eventId' })
  async listForEvent(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.service.listEventRegistrations(eventId);
  }

  // ADMIN: remove a registration
  @Delete('events/:eventId/registrations/:registrationId')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remove registration (ADMIN)' })
  @ApiParam({ name: 'eventId' })
  @ApiParam({ name: 'registrationId' })
  async remove(@Param('eventId', ParseIntPipe) eventId: number, @Param('registrationId', ParseIntPipe) registrationId: number) {
    return this.service.removeRegistration(eventId, registrationId);
  }
}
