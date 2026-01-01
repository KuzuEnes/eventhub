import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoleUpdateDto {
  @ApiProperty({ example: 'ADMIN', enum: ['ADMIN', 'STUDENT'] })
  @IsIn(['ADMIN', 'STUDENT'])
  role: 'ADMIN' | 'STUDENT';
}
