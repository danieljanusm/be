import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from '../auth/input/auth.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DatabaseRecord } from '../common/models/databaseRecord.model';
import { User } from './models/user.type';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  public async createUser(
    userDto: CreateUserDto,
  ): Promise<DatabaseRecord<User>> {
    const salt: string = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(userDto.password, salt);

    const user = await this.prisma.user
      .create({
        data: {
          email: userDto.email,
          hash,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new ForbiddenException('Credentials incorrect');
        }
        throw error;
      });

    return user;
  }

  public async updateUser<T>(
    userId: string,
    parameterToUpdate: keyof User,
    value: T,
  ): Promise<DatabaseRecord<User>> {
    return this.prisma.user
      .findFirst({
        where: {
          id: userId,
        },
      })
      .then(() =>
        this.prisma.user.update({
          where: { id: userId },
          data: { [parameterToUpdate]: value },
        }),
      )
      .catch(() => {
        throw new NotFoundException();
      });
  }

  public async getUserById(id: string): Promise<DatabaseRecord<User>> {
    return this.prisma.user
      .findUnique({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  public async getUserByEmail(email: string): Promise<DatabaseRecord<User>> {
    return this.prisma.user
      .findUnique({
        where: { email },
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }
}
