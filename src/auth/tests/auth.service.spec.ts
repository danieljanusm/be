import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../input/auth.dto';
import { DatabaseRecord } from '../../common/models/databaseRecord.model';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              updateMany: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(() => 'token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'secret'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            getUserByEmail: jest.fn(),
            getUserById: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockUser: DatabaseRecord<User> = {
        id: '1',
        email: 'test@example.com',
        hash: 'hashedPassword',
        hashedRt: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(usersService, 'createUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'getTokens').mockResolvedValue({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });

      const tokens = await authService.register(createUserDto);

      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(authService.getTokens).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
      );
      expect(tokens.access_token).toEqual('access_token');
      expect(tokens.refresh_token).toEqual('refresh_token');
    });
  });

  describe('login', () => {
    it('should login with correct credentials and return tokens', async () => {
      const loginUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        hash: await bcrypt.hash('password', 10),
        hashedRt: await bcrypt.hash('refresh_token', 10),
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);
      jest.spyOn(authService, 'getTokens').mockResolvedValue({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });

      const tokens = await authService.login(loginUserDto);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(
        loginUserDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginUserDto.password,
        mockUser.hash,
      );
      expect(authService.getTokens).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
      );
      expect(tokens.access_token).toEqual('access_token');
      expect(tokens.refresh_token).toEqual('refresh_token');
    });

    it('should throw ForbiddenException if user is not found', async () => {
      const loginUserDto: CreateUserDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if password is incorrect', async () => {
      const loginUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        hashedRt: null,
        updatedAt: new Date(),
        createdAt: new Date(),
        hash: await bcrypt.hash('password', 10),
      };

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('logout', () => {
    it('should logout user and return true', async () => {
      const userId = '1';

      jest
        .spyOn(prismaService.user, 'updateMany')
        .mockResolvedValue({ count: 1 });

      const result = await authService.logout(userId);

      expect(prismaService.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: userId,
          hashedRt: {
            not: null,
          },
        },
        data: {
          hashedRt: null,
        },
      });
      expect(result).toBe(true);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens for valid user and return tokens', async () => {
      const userId = '1';
      const rt = 'refresh_token';

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        hash: null,
        hashedRt: await bcrypt.hash(rt, 10),
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);
      jest.spyOn(authService, 'getTokens').mockResolvedValue({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });
      jest.spyOn(authService, 'updateRtHash').mockResolvedValue();

      const tokens = await authService.refreshTokens(userId, rt);

      expect(usersService.getUserById).toHaveBeenCalledWith(userId);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockUser.hashedRt, rt);
      expect(authService.getTokens).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
      );
      expect(authService.updateRtHash).toHaveBeenCalledWith(
        mockUser.id,
        'refresh_token',
      );
      expect(tokens.access_token).toEqual('access_token');
      expect(tokens.refresh_token).toEqual('refresh_token');
    });

    it('should throw ForbiddenException if user is not found', async () => {
      const userId = 'nonexistent';
      const rt = 'refresh_token';

      jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);

      await expect(authService.refreshTokens(userId, rt)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if refresh token does not match', async () => {
      const userId = '1';
      const rt = 'invalid_refresh_token';

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        hashedRt: await bcrypt.hash('refresh_token', 10),
        hash: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(usersService, 'getUserById').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

      await expect(authService.refreshTokens(userId, rt)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateRtHash', () => {
    it('should update refresh token hash for user', async () => {
      const userId = '1';
      const rt = 'new_refresh_token';
      const hashedRt = 'hashed_refresh_token';

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        hashedRt: hashedRt,
        hash: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };

      jest.spyOn(bcrypt, 'genSalt').mockImplementationOnce(() => 'salt');
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => hashedRt);
      jest
        .spyOn(usersService, 'updateUser')
        .mockImplementationOnce(() => Promise.resolve(mockUser));

      await authService.updateRtHash(userId, rt);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(rt, 'salt');
      expect(usersService.updateUser).toHaveBeenCalledWith(
        userId,
        'hashedRt',
        hashedRt,
      );
    });
  });
});
