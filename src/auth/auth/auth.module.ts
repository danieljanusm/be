import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RtStrategy } from './strategy/rt.strategy';
import { AtStrategy } from './strategy/at.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, PrismaService],
})
export class AuthModule {}
