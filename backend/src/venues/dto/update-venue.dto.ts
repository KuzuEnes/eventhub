import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVenueDto {
  @ApiPropertyOptional({ example: 'Main Hall' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '123 Event St' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 250 })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}
