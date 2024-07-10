import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherApiResponse } from './models/weather.model';
import { GetForecastQuery } from './input/get-forecast.query';
import { ApiAcceptedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { WeatherApiResponseDto } from './responses/weather.response';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: { type: 'object', properties: { message: { type: 'string' } } },
  })
  @ApiAcceptedResponse({
    type: WeatherApiResponseDto,
  })
  async getWeather(
    @Query() query: GetForecastQuery,
  ): Promise<WeatherApiResponse | { error: string }> {
    return await this.weatherService.getForecast(query.lat, query.lng);
  }
}
