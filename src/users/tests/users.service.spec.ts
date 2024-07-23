import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../database/prisma.service';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../../auth/input/auth.dto';
import { DatabaseRecord } from '../../common/models/databaseRecord.model';
import { User } from '../models/user.type';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const user: DatabaseRecord<User> = {
        id: '1',
        email: userDto.email,
        hash: hashedPassword,
        hashedRt: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);

      const result = await service.createUser(userDto);
      expect(result).toEqual(user);
    });

    it('should throw ForbiddenException if Prisma error occurs', async () => {
      const userDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(prismaService.user, 'create').mockRejectedValue(
        new PrismaClientKnownRequestError('Error', {
          code: 'P2002',
          clientVersion: '1',
        }),
      );

      await expect(service.createUser(userDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = '1';
      const parameterToUpdate = 'email';
      const value = 'newemail@example.com';
      const user = {
        id: userId,
        email: value,
        hash: 'hashedPassword',
        hashedRt: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(user);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(user);

      const result = await service.updateUser(userId, parameterToUpdate, value);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = '1';
      const parameterToUpdate = 'email';
      const value = 'newemail@example.com';

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(
        service.updateUser(userId, parameterToUpdate, value),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const userId = '1';
      const user = {
        id: userId,
        email: 'test@example.com',
        hash: 'hashedPassword',
        hashedRt: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await service.getUserById(userId);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = '1';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const email = 'test@example.com';
      const user = {
        id: '1',
        email,
        hash: 'hashedPassword',
        hashedRt: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

      const result = await service.getUserByEmail(email);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const email = 'test@example.com';

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.getUserByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
