import { Controller, Post, Body, UseGuards, Patch, Param, ParseIntPipe, Delete, Get, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Events')
@Controller('events')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private service: EventsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create event (ADMIN only)' })
  async create(@Body() dto: CreateEventDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'List events (authenticated)' })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'venueId', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  async list(
    @Query('q') q?: string,
    @Query('categoryId') categoryId?: string,
    @Query('venueId') venueId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
  ) {
    const p = Math.max(1, parseInt(page || '1'));
    const take = 20;
    const skip = (p - 1) * take;
    return this.service.findAll({ q, categoryId: categoryId ? Number(categoryId) : undefined, venueId: venueId ? Number(venueId) : undefined, from, to, skip, take });
  }

  @Get(':id')
  @Roles('ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Get event by id (authenticated)' })
  @ApiParam({ name: 'id' })
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update event (ADMIN only)' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete event (ADMIN only)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
