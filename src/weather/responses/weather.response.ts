import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class LocationDto {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  region: string;

  @ApiProperty({ type: String })
  country: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  lat: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  lon: number;

  @ApiProperty({ type: String })
  tz_id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  localtime_epoch: number;

  @ApiProperty({ type: String })
  localtime: string;
}

export class ConditionDto {
  @ApiProperty({ type: String })
  text: string;

  @ApiProperty({ type: String })
  icon: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  code: number;
}

export class DayForecastDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  maxtemp_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  maxtemp_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  mintemp_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  mintemp_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  avgtemp_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  avgtemp_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  maxwind_mph: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  maxwind_kph: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  totalprecip_mm: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  totalprecip_in: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  totalsnow_cm: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  avgvis_km: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  avgvis_miles: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  avghumidity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  daily_will_it_rain: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  daily_chance_of_rain: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  daily_will_it_snow: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  daily_chance_of_snow: number;

  @ApiProperty({ type: ConditionDto })
  condition: ConditionDto;

  @ApiProperty({ type: Number })
  @IsNumber()
  uv: number;
}

export class AstroDto {
  @ApiProperty({ type: String })
  sunrise: string;

  @ApiProperty({ type: String })
  sunset: string;

  @ApiProperty({ type: String })
  moonrise: string;

  @ApiProperty({ type: String })
  moonset: string;

  @ApiProperty({ type: String })
  moon_phase: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  moon_illumination: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  is_moon_up: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  is_sun_up: number;
}

export class HourDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  time_epoch: number;

  @ApiProperty({ type: String })
  time: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  temp_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  temp_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  is_day: number;

  @ApiProperty({ type: ConditionDto })
  condition: ConditionDto;

  @ApiProperty({ type: Number })
  @IsNumber()
  wind_mph: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  wind_kph: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  wind_degree: number;

  @ApiProperty({ type: String })
  wind_dir: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  pressure_mb: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  pressure_in: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  precip_mm: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  precip_in: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  snow_cm: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  humidity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  cloud: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  feelslike_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  feelslike_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  windchill_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  windchill_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  heatindex_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  heatindex_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  dewpoint_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  dewpoint_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  will_it_rain: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  chance_of_rain: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  will_it_snow: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  chance_of_snow: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  vis_km: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  vis_miles: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  gust_mph: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  gust_kph: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  uv: number;
}

export class CurrentDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  last_updated_epoch: number;

  @ApiProperty({ type: String })
  last_updated: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  temp_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  temp_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  is_day: number;

  @ApiProperty({ type: ConditionDto })
  condition: ConditionDto;

  @ApiProperty({ type: Number })
  @IsNumber()
  wind_mph: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  wind_kph: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  wind_degree: number;

  @ApiProperty({ type: String })
  wind_dir: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  pressure_mb: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  pressure_in: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  precip_mm: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  precip_in: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  humidity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  cloud: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  feelslike_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  feelslike_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  windchill_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  windchill_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  heatindex_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  heatindex_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  dewpoint_c: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  dewpoint_f: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  vis_km: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  vis_miles: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  uv: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  gust_mph: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  gust_kph: number;
}

export class ForecastDayDto {
  @ApiProperty({ type: String })
  date: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  date_epoch: number;

  @ApiProperty({ type: DayForecastDto })
  day: DayForecastDto;

  @ApiProperty({ type: AstroDto })
  astro: AstroDto;

  @ApiProperty({ type: [HourDto] })
  hour: HourDto[];
}

export class ForecastDto {
  @ApiProperty({ type: [ForecastDayDto] })
  forecastday: ForecastDayDto[];
}

export class WeatherApiResponseDto {
  @ApiProperty({ type: LocationDto })
  location: LocationDto;

  @ApiProperty({ type: CurrentDto })
  current: CurrentDto;

  @ApiProperty({ type: ForecastDto })
  forecast: ForecastDto;
}

export class WeatherDto {
  @ApiProperty({ type: Date })
  @IsDate()
  doba: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  cen_prog: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ckoeb_prog: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ceb_pp_prog: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ceb_sr_prog: number;

  @ApiProperty({ type: String })
  udtczas_oreb: string;

  @ApiProperty({ type: Date })
  @IsDate()
  business_date: Date;

  @ApiProperty({ type: Date })
  @IsDate()
  source_datetime: Date;
}
