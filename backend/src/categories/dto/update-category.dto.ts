import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'New category name', example: 'Talk' })
  @IsOptional()
  @IsString()
  name?: string;
}
