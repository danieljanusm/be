import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { API } from '../constants/api-urls';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('WEATHER_API_KEY');
  }

  public async getForecast(
    lat: number,
    lng: number,
  ): Promise<WeatherApiResponse> {
    if (lat === undefined || lat === null || isNaN(lat)) {
      throw new BadRequestException(
        'Invalid latitude: Latitude must be a number.',
      );
    }
    if (lng === undefined || lng === null || isNaN(lng)) {
      throw new BadRequestException(
        'Invalid longitude: Longitude must be a number.',
      );
    }

    const url = `${API.WEATHER_DEFAULT}/forecast.json?key=${this.apiKey}&q=${lat},${lng}`;

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get<WeatherApiResponse>(url),
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request error:', error.message);
      }
    }
  }
}
