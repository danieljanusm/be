import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Hello ${user.email}`,
      template: './confirmation',
      context: {
        name: user.email,
      },
    });
  }
}
