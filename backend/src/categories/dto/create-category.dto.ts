import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name (unique)', example: 'Workshop' })
  @IsString()
  name: string;
}
