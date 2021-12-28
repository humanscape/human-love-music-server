import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive, Max, Min } from 'class-validator';

export class PageRequest {
  @ApiProperty({ required: false })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  size: number = 10;
}
