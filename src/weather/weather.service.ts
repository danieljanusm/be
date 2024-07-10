import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { WEATHER_ERROR } from './errors/weather.errors';
import { WeatherApiResponse } from './models/weather.model';
import { WEATHER_API } from './constants/weather.constants';

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
    const url: string = `${WEATHER_API.WEATHER_DEFAULT}/forecast.json?key=${this.apiKey}&q=${lat},${lng}`;

    try {
      const response: AxiosResponse<WeatherApiResponse> = await firstValueFrom(
        this.httpService.get<WeatherApiResponse>(url),
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new BadRequestException(
          {
            ...WEATHER_ERROR.RESPONSE_ERROR,
            error: error.response.data,
          },
          '400',
        );
      } else if (error.request) {
        throw new BadRequestException(
          {
            ...WEATHER_ERROR.NO_RESPONSE_ERROR,
            error: error.request,
          },
          '400',
        );
      } else {
        throw new BadRequestException(
          {
            ...WEATHER_ERROR.REQUEST_ERROR,
            error: error.message,
          },
          '400',
        );
      }
    }
  }
}
