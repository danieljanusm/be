import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class PricesDto {
  @ApiProperty({ type: Date })
  @IsDate()
  doba: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  cen_prog: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ckoeb_prog: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ceb_pp_prog: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ceb_sr_prog: number;

  @ApiProperty({ type: String })
  udtczas_oreb: string;

  @ApiProperty({ type: Date })
  @IsDate()
  business_date: Date;

  @ApiProperty({ type: Date })
  @IsDate()
  source_datetime: Date;
}

export class PricesResponseDto {
  @ApiProperty({ type: [PricesDto] })
  value: PricesDto[];
}
