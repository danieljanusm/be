import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherApiResponse } from './models/weather.model';
import { GetForecastQuery } from './input/get-forecast.query';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(
    @Query() query: GetForecastQuery,
  ): Promise<WeatherApiResponse | { error: string }> {
    return await this.weatherService.getForecast(query.lat, query.lng);
  }
}
