import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetForecastQuery {
  @ApiProperty({ type: 'number', minimum: -90, maximum: 90 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ type: 'number', minimum: -180, maximum: 180 })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}
