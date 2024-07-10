import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { WeatherApiResponse } from '../models/weather.model';
import { WeatherModule } from '../weather.module';
import { WeatherService } from '../weather.service';
import { WEATHER_RESPONSE_MOCK } from '../constants/weather-response.mock';
import { Response } from 'supertest';

describe('Weather', () => {
  let app: INestApplication;
  const weatherService = {
    getForecast: (): WeatherApiResponse => WEATHER_RESPONSE_MOCK,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [WeatherModule],
    })
      .overrideProvider(WeatherService)
      .useValue(weatherService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`/GET weather should return data for correct params`, () => {
    const lat = 50;
    const lng = 50;
    return request(app.getHttpServer())
      .get(`/weather?lat=${lat}&lng=${lng}`)
      .expect(200)
      .expect(WEATHER_RESPONSE_MOCK);
  });

  it(`/GET weather should return error for incorrect lat`, async () => {
    const lat = NaN;
    const lng = 50;
    const response: Response = await request(app.getHttpServer())
      .get('/weather')
      .query({ lat, lng });
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toContain('lat must not be greater than 90');
    expect(response.body.message).toContain('lat must not be less than -90');
    expect(response.body.message).toContain(
      'lat must be a number conforming to the specified constraints',
    );
  });

  it(`/GET weather should return error for incorrect lng`, async () => {
    const lat = 50;
    const lng = NaN;
    const response: Response = await request(app.getHttpServer()).get(
      `/weather?lat=${lat}&lng=${lng}`,
    );
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toContain('lng must not be greater than 180');
    expect(response.body.message).toContain('lng must not be less than -180');
    expect(response.body.message).toContain(
      'lng must be a number conforming to the specified constraints',
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
