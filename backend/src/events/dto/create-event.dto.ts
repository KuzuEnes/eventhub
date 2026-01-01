import { IsString, IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false, example: 'A deep dive into X' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-01-10T10:00:00.000Z' })
  @IsDateString()
  startAt: string;

  @ApiProperty({ example: '2026-01-10T12:00:00.000Z' })
  @IsDateString()
  endAt: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  venueId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  categoryId: number;
}
