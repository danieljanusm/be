import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { API } from '../constants/api-urls';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { WEATHER_ERROR } from '../errors/weather.errors';

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
      throw new BadRequestException(WEATHER_ERROR.INVALID_LATITUDE_ERROR);
    }
    if (lng === undefined || lng === null || isNaN(lng)) {
      throw new BadRequestException(WEATHER_ERROR.INVALID_LONGITUDE_ERROR);
    }

    const url: string = `${API.WEATHER_DEFAULT}/forecast.json?key=${this.apiKey}&q=${lat},${lng}`;

    try {
      const response: AxiosResponse<WeatherApiResponse> = await firstValueFrom(
        this.httpService.get<WeatherApiResponse>(url),
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new BadRequestException(
          WEATHER_ERROR.RESPONSE_ERROR,
          error.response.data,
        );
      } else if (error.request) {
        throw new BadRequestException(
          WEATHER_ERROR.NO_RESPONSE_ERROR,
          error.request,
        );
      } else {
        throw new BadRequestException(
          WEATHER_ERROR.REQUEST_ERROR,
          error.message,
        );
      }
    }
  }
}
