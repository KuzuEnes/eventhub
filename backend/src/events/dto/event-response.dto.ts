import { ApiProperty } from '@nestjs/swagger';

export class VenueDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() address: string;
  @ApiProperty() capacity: number;
}

export class CategoryDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
}

export class EventResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() title: string;
  @ApiProperty({ required: false }) description?: string;
  @ApiProperty() startAt: Date;
  @ApiProperty() endAt: Date;
  @ApiProperty() capacity: number;
  @ApiProperty({ type: () => VenueDto }) venue: VenueDto;
  @ApiProperty({ type: () => CategoryDto }) category: CategoryDto;
  @ApiProperty() createdAt: Date;
}
