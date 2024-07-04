import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WeatherModule } from './weather/weather.module';
import { DatabaseModule } from './database/database.module';

@Module({
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WeatherModule,
  controllers: [AppController],
})
export class AppModule {}
