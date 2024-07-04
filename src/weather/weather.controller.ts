import { Controller, Get, ParseFloatPipe, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getForecast(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
  ): Promise<WeatherApiResponse | { error: string }> {
    if (!lat || !lng) {
      return { error: 'Latitude and longitude are required' };
    }
    return await this.weatherService.getForecast(lat, lng);
  }
}
