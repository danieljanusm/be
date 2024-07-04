import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WeatherModule } from './weather/weather.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WeatherModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
