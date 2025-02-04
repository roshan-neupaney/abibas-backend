import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtPayload } from 'src/authentication/types/jwtPayload.type';
import { tokens } from 'src/authentication/types/token.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { Role } from './role.enum';
import { CreateRefreshDto } from './dto/create-refresh.dto';
import { CreateLoginDto } from './dto/create-login.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async create(createAuthenticationDto: CreateAuthenticationDto) {
    try {
      const hashed = await argon.hash(createAuthenticationDto.password);
      const user = await this.prisma.myUsers.create({
        data: {
          email: createAuthenticationDto.email,
          firstName: createAuthenticationDto.firstName,
          lastName: createAuthenticationDto.lastName,
          mobile: createAuthenticationDto.mobile,
          hash: hashed,
          role: Role[createAuthenticationDto.role],
        },
      });
      // const token = await this.getToken(user.id, user.email, user.role);
      // await this.updateRtHash(user.id, token.refresh_token);
      return {...user, password: createAuthenticationDto.password};
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('The user already exists by this email');
        }
      }
      throw error;
    }
  }

  async refresh(createRefreshDto: CreateRefreshDto) {
    const { refresh } = createRefreshDto;
    const payload = this.jwtService.verify(refresh, {
      secret: this.config.get<string>('RT_SECRET'),
    });

    const user = await this.prisma.myUsers.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user || !(await argon.verify(user.hashedRt, refresh))) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokens = await this.getToken(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async getToken(
    userId: string,
    userEmail: string,
    userRole: string,
  ): Promise<tokens> {
    const jwtPayload: JwtPayload = {
      email: userEmail,
      sub: userId,
      role: userRole,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '8d',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '14d',
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRtHash(userId: string, refreshToken: string): Promise<void> {
    const hashedRt = await argon.hash(refreshToken);
    await this.prisma.myUsers.update({
      where: { id: userId },
      data: { hashedRt: hashedRt },
    });
  }

  async findAll() {
    const users = await this.prisma.myUsers.findMany();
    return users;
  }

  async login(body: CreateLoginDto) {
      const user = await this.prisma.myUsers.findUnique({
        where: {
          email: body.email,
          role: body.role,
        },
      });
      if (!user || !(await argon.verify(user.hash, body.password))) {
        throw new ForbiddenException(
          "You've entered an incorrect email or password",
        );
      }

      const tokens = await this.getToken(user.id, user.email, user.role);
      await this.updateRtHash(user.id, tokens.refresh_token);

      return tokens;
   
  }
}
