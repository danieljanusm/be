import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../weather.service';
import { BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { WEATHER_ERROR } from '../errors/weather.errors';
import { AxiosResponse } from 'axios';
import { WEATHER_RESPONSE_MOCK } from '../constants/weather-response.mock';

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
    it('should throw BadRequestException for response error', async (): Promise<void> => {
      const mockResponse = new BadRequestException(
        {
          ...WEATHER_ERROR.RESPONSE_ERROR,
          error: {},
        },
        '400',
      );
      jest.spyOn(httpService, 'get').mockImplementation(() =>
        throwError(() => ({
          response: requestErrorResponse(),
          config: null,
          isAxiosError: true,
          name: '',
          message: 'error message',
          toJSON: jest.fn(),
        })),
      );
      await expect(weatherService.getForecast(100, 100)).rejects.toThrow(
        mockResponse,
      );
    });

    it('should return data on successful request', async (): Promise<void> => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() =>
          of(requestCorrectResponse(WEATHER_RESPONSE_MOCK)),
        );

      await expect(weatherService.getForecast(50, 50)).resolves.toEqual(
        WEATHER_RESPONSE_MOCK,
      );
    });
  });
});
