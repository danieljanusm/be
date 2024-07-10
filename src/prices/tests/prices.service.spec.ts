import { Test, TestingModule } from '@nestjs/testing';
import { PricesService } from '../prices.service';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { BadRequestException } from '@nestjs/common';
import { PRICES_RESPONSE_MOCK } from '../constants/prices-response.mock';
import * as dayjs from 'dayjs';
import { PRICES_ERROR } from '../errors/errors';

describe('PricesService', () => {
  let pricesService: PricesService;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockImplementation(() => of()),
          },
        },
      ],
    }).compile();

    httpService = module.get(HttpService);
    pricesService = module.get<PricesService>(PricesService);
  });

  it('should be defined', () => {
    expect(pricesService).toBeDefined();
  });

  describe('getCurrentPrices', () => {
    it('should throw BadRequestException for response error', async (): Promise<void> => {
      const mockResponse = new BadRequestException(
        {
          ...PRICES_ERROR.RESPONSE_ERROR,
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
      await expect(pricesService.getCurrentPrices()).rejects.toThrow(
        mockResponse,
      );
    });

    it('should return data on successful request', async (): Promise<void> => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() =>
          of(requestCorrectResponse(PRICES_RESPONSE_MOCK)),
        );

      await expect(pricesService.getCurrentPrices()).resolves.toEqual(
        PRICES_RESPONSE_MOCK,
      );
    });
  });

  describe('getForecastedPrices', () => {
    const date = dayjs().format('YYYY-DD-MM');

    it('should throw BadRequestException for response error', async (): Promise<void> => {
      const mockResponse = new BadRequestException(
        {
          ...PRICES_ERROR.RESPONSE_ERROR,
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
      await expect(pricesService.getForecastedPrices(date)).rejects.toThrow(
        mockResponse,
      );
    });

    it('should return data on successful request', async (): Promise<void> => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() =>
          of(requestCorrectResponse(PRICES_RESPONSE_MOCK)),
        );

      await expect(pricesService.getForecastedPrices(date)).resolves.toEqual(
        PRICES_RESPONSE_MOCK,
      );
    });
  });
});
