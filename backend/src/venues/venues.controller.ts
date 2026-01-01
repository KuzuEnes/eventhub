import { Controller, Post, Body, UseGuards, Patch, Param, ParseIntPipe, Delete, Get, Query, BadRequestException } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Venues')
@Controller('venues')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class VenuesController {
  constructor(private service: VenuesService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a venue (ADMIN only)' })
  async create(@Body() dto: CreateVenueDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'List venues (authenticated users)' })
  @ApiQuery({ name: 'page', required: false })
  async list(@Query('page') page?: string) {
    const p = Math.max(1, parseInt(page || '1'));
    const take = 20;
    const skip = (p - 1) * take;
    return this.service.findAll({ skip, take });
  }

  @Get(':id')
  @Roles('ADMIN', 'STUDENT')
  @ApiOperation({ summary: 'Get venue by id (authenticated users)' })
  @ApiParam({ name: 'id' })
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update venue (ADMIN only)' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVenueDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete venue (ADMIN only) — fails if events exist' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.service.remove(id);
    } catch (e) {
      // meaningful error
      throw new BadRequestException(e.message || 'Could not delete venue');
    }
  }
}
