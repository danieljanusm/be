import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../weather.service';
import { BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, of, Subscriber } from 'rxjs';
import { WEATHER_ERROR } from '../errors/weather.errors';
import { AxiosResponse } from 'axios';
import { WeatherResponseMock } from '../constants/weather-response.mock';

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let httpService: HttpService;

  const requestErrorResponse = (status = 400): AxiosResponse => ({
    status,
    statusText: 'Bad Request',
    headers: null,
    config: null,
    data: {
      statusCode: status,
      error: 'Bad Request',
      message: {},
    },
  });

  const requestCorrectResponse = (data: any): AxiosResponse => ({
    status: 200,
    statusText: 'Success',
    headers: null,
    config: null,
    data,
  });

  beforeAll(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockImplementation(() => of()),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'dummy_api_key'),
          },
        },
      ],
    }).compile();

    httpService = module.get(HttpService);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(weatherService).toBeDefined();
  });

  describe('getForecast', () => {
    // it's no longer necessary once there is class validator

    // const invalidValues: number[] = [undefined, null, NaN];
    //
    // for (const lat of invalidValues) {
    //   it(`should throw BadRequestException for ${lat} as latitude`, async (): Promise<void> => {
    //     const expectedError = new BadRequestException(
    //       WEATHER_ERROR.INVALID_LATITUDE_ERROR,
    //       '400',
    //     );
    //
    //     const response = weatherService.getForecast(lat, 10);
    //
    //     await expect(response).rejects.toThrow(expectedError);
    //     await expect(response).rejects.toBe(
    //       WEATHER_ERROR.INVALID_LATITUDE_ERROR,
    //     );
    //   });
    // }
    //
    // for (const lng of invalidValues) {
    //   it(`should throw BadRequestException for ${lng} as longitude`, async (): Promise<void> => {
    //     const expectedError = new BadRequestException(
    //       WEATHER_ERROR.INVALID_LONGITUDE_ERROR,
    //       '400',
    //     );
    //
    //     await expect(weatherService.getForecast(10, lng)).rejects.toThrow(
    //       expectedError,
    //     );
    //   });
    // }

    it('should throw BadRequestException for response error', async (): Promise<void> => {
      const mockResponse = new BadRequestException(
        {
          ...WEATHER_ERROR.RESPONSE_ERROR,
          error: {},
        },
        '400',
      );
      jest.spyOn(httpService, 'get').mockImplementation(
        () =>
          new Observable(
            (observer: Subscriber<AxiosResponse<any, any>>): void => {
              observer.error({
                response: requestErrorResponse(),
                config: null,
                isAxiosError: true,
                name: '',
                message: 'error message',
                toJSON: jest.fn(),
              });
            },
          ),
      );
      await expect(weatherService.getForecast(100, 100)).rejects.toThrow(
        mockResponse,
      );
    });

    it('should return data on successful request', async (): Promise<void> => {
      jest.spyOn(httpService, 'get').mockImplementation(
        () =>
          new Observable(
            (observer: Subscriber<AxiosResponse<any, any>>): void => {
              observer.next(requestCorrectResponse(WeatherResponseMock));
            },
          ),
      );

      await expect(weatherService.getForecast(50, 50)).resolves.toEqual(
        WeatherResponseMock,
      );
    });
  });
});
