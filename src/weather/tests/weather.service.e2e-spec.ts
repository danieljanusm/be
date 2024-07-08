import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WeatherApiResponse } from '../models/weather.model';
import { WeatherModule } from '../weather.module';
import { WeatherService } from '../weather.service';
import { WeatherResponseMock } from '../constants/weather-response.mock';

describe('Weather', () => {
  let app: INestApplication;
  const weatherService = {
    getForecast: (): WeatherApiResponse => WeatherResponseMock,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [WeatherModule],
    })
      .overrideProvider(WeatherService)
      .useValue(weatherService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET weather`, () => {
    return request(app.getHttpServer())
      .get('/weather')
      .expect(200)
      .expect(WeatherResponseMock);
  });

  afterAll(async () => {
    await app.close();
  });
});
