import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';
import { MailService } from '../mail/mail.service';

@Module({
  providers: [UsersService, PrismaService, MailService],
})
export class UsersModule {}
