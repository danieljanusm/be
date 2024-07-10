import { Controller, Get, Query } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesResponse } from './models/prices.model';
import { ApiAcceptedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { PricesResponseDto } from './responses/prices.response';
import { GetForecastedPricesQuery } from './input/get-forecast.query';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get('current')
  @ApiAcceptedResponse({
    type: PricesResponseDto,
  })
  async getCurrentPrices(): Promise<PricesResponse> {
    return await this.pricesService.getCurrentPrices();
  }

  @Get('forecasted')
  @ApiAcceptedResponse({
    type: PricesResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: { type: 'object', properties: { message: { type: 'string' } } },
  })
  async getForecastedPrices(
    @Query() query: GetForecastedPricesQuery,
  ): Promise<PricesResponse> {
    return await this.pricesService.getForecastedPrices(query.date);
  }
}
