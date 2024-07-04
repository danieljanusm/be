import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from '../weather.service';
import { BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { WEATHER_ERROR } from '../../errors/weather.errors';

describe('WeatherService', () => {
  let weatherService: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() => of({ data: {} })),
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

    weatherService = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(weatherService).toBeDefined();
  });

  describe('getForecast', () => {
    it('should throw BadRequestException for invalid latitude', async () => {
      const invalidLatitudes = [undefined, null, NaN];
      for (const lat of invalidLatitudes) {
        try {
          await weatherService.getForecast(lat, 10);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.response.code).toEqual(
            WEATHER_ERROR.INVALID_LATITUDE_ERROR.code,
          );
        }
      }
    });

    it('should throw BadRequestException for invalid longitude', async () => {
      const invalidLongitudes = [undefined, null, NaN];
      for (const lng of invalidLongitudes) {
        try {
          await weatherService.getForecast(10, lng);
        } catch (error) {
          expect(error.response.code).toEqual(
            WEATHER_ERROR.INVALID_LONGITUDE_ERROR.code,
          );
        }
      }
    });

    it('should throw BadRequestException for response error', async () => {
      const error = {
        response: WEATHER_ERROR.RESPONSE_ERROR,
      };
      jest.spyOn(weatherService, 'getForecast').mockRejectedValue(error);

      try {
        await weatherService.getForecast(100, 100);
      } catch (error) {
        expect(error.response.code).toEqual(WEATHER_ERROR.RESPONSE_ERROR.code);
      }
    });

    it('should return data on successful request', async () => {
      const mockResponse: WeatherApiResponse = {
        location: null,
        current: null,
        forecast: null,
      };

      jest.spyOn(weatherService, 'getForecast').mockResolvedValue(mockResponse);

      await weatherService
        .getForecast(100, 100)
        .then((response) => expect(response).toEqual(mockResponse));
    });
  });
});
