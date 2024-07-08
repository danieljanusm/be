import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class GetForecastQuery {
  @ApiProperty({ type: 'number', minimum: -90, maximum: 90 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ type: 'number', minimum: -180, maximum: 180 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}
