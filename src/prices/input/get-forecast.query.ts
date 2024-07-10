import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';

export class GetForecastedPricesQuery {
  @ApiProperty({ type: 'date' })
  @IsDateString()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  date: string;
}
