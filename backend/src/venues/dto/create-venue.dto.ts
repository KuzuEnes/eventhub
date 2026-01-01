import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVenueDto {
  @ApiProperty({ description: 'Venue name', example: 'Main Hall' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Venue address', example: '123 Event St' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Capacity, integer >= 1', example: 200 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ description: 'Optional extra info', required: false, example: 'Near parking' })
  @IsOptional()
  @IsString()
  extra?: string;
}
