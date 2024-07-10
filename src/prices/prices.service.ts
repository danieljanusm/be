import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PRICES_API } from './constants/prices.constants';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { PricesResponse } from './models/prices.model';
import { PRICES_ERROR } from './errors/errors';
import * as dayjs from 'dayjs';

@Injectable()
export class PricesService {
  constructor(private readonly httpService: HttpService) {}

  public async getCurrentPrices(): Promise<PricesResponse> {
    const convertedDate: string = dayjs().format('YYYY-MM-DD');
    const url: string = `${
      PRICES_API.PRICES_DEFAULT
    }${PRICES_API.REPORTS.CURRENT_PRICES(convertedDate)}`;

    try {
      const response: AxiosResponse<PricesResponse> = await firstValueFrom(
        this.httpService.get<PricesResponse>(url),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(
        {
          ...PRICES_ERROR.RESPONSE_ERROR,
          error: error.response.data,
        },
        '400',
      );
    }
  }

  public async getForecastedPrices(date: string): Promise<PricesResponse> {
    if (!dayjs(date).isValid()) {
      throw new BadRequestException(
        {
          ...PRICES_ERROR.INVALID_DATE_ERROR,
        },
        '400',
      );
    }
    const convertedDate = dayjs().format('YYYY-MM-DD');

    const url: string = `${
      PRICES_API.PRICES_DEFAULT
    }${PRICES_API.REPORTS.FORECASTED_PRICES(convertedDate)}`;

    try {
      const response: AxiosResponse<PricesResponse> = await firstValueFrom(
        this.httpService.get<PricesResponse>(url),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(
        {
          ...PRICES_ERROR.RESPONSE_ERROR,
          error: error.response.data,
        },
        '400',
      );
    }
  }
}
