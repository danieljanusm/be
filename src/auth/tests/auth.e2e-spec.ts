import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../auth.module';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from '../input/auth.dto';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const mockedUser = {
    id: '1',
    email: 'test@example.com',
    hash: 'password',
    hashedRt: 'refresh_token',
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          updateMany: jest.fn(),
          create: jest.fn(() => ({ catch: jest.fn(), ...mockedUser })),
          catch: jest.fn(),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto)
      .expect(HttpStatus.CREATED);

    console.log(response.body);
    // Assert response body has tokens
    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
  });

  it('/auth/login (POST)', async () => {
    const dto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto)
      .expect(HttpStatus.OK);

    // Assert response body has tokens
    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
  });

  it('/auth/logout (POST)', async () => {
    // Assume userId for testing purposes
    const userId = '123';

    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${generateAccessToken()}`)
      .send({ userId })
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(true);
  });

  it('/auth/refresh (POST)', async () => {
    // Assume userId and refreshToken for testing purposes
    const userId = '123';
    const refreshToken = 'sample_refresh_token';

    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Authorization', `Bearer ${generateAccessToken()}`)
      .send({ userId, refreshToken })
      .expect(HttpStatus.OK);

    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
  });

  function generateAccessToken() {
    return 'dummy_access_token';
  }
});
