import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PricesModule } from '../prices.module';
import * as request from 'supertest';
import { Response } from 'supertest';
import { PricesService } from '../prices.service';
import { PRICES_RESPONSE_MOCK } from '../constants/prices-response.mock';
import * as dayjs from 'dayjs';

describe('PricesController', () => {
  let app: INestApplication;
  const pricesService = {
    getCurrentPrices: () => PRICES_RESPONSE_MOCK,
    getForecastedPrices: () => PRICES_RESPONSE_MOCK,
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PricesModule],
    })
      .overrideProvider(PricesService)
      .useValue(pricesService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`/GET CurrentPrices should return correct data`, () => {
    return request(app.getHttpServer())
      .get('/prices/current')
      .expect(200)
      .expect(PRICES_RESPONSE_MOCK);
  });

  it(`/GET ForecastedPrices should return correct data`, () => {
    return request(app.getHttpServer())
      .get('/prices/forecasted')
      .query({ date: dayjs().toISOString() })
      .expect(200)
      .expect(PRICES_RESPONSE_MOCK);
  });

  it(`/GET ForecastedPrices should return error for incorrect date`, async () => {
    const date = null;
    const response: Response = await request(app.getHttpServer())
      .get('/prices/forecasted')
      .query({ date });
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toContain(
      'date must be a valid ISO 8601 date string',
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
