import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import type { Response } from 'express';
import { UtilsService } from 'src/_utils/utils.service';
import { Reflector } from '@nestjs/core/services/reflector.service';
import { IS_PUBLIC_KEY } from '../../../common/public.decorator';
import { RequestWithUserData } from '../../../dtos/public.dto';


@Injectable()
export class AdminAuthGuard implements CanActivate {
  private readonly logger = new Logger(AdminAuthGuard.name);
  private readonly tokenName = 'auth_admin'; 

  constructor(
    private readonly authService: AdminAuthService,
    private readonly utils: UtilsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: RequestWithUserData = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const token = request.cookies[this.tokenName];

    // public route - allow if no token, block if token present (already logged in)
    if (isPublic) {
      if (token) {
        this.logger.warn('Attempt to access public route while logged in');
        throw new UnauthorizedException('already_logged_in');
      }
      return true;
    }

    //token validation for protected routes
    if (!token) {
      this.logger.warn('No auth token found for admin');
      throw new UnauthorizedException('no_token_found');
    }

    let authorized;
    try {
      authorized = await this.authService.authorize(token);
    } catch (err) {
      this.logger.error('Token validation failed', err);
      response.clearCookie(this.tokenName, { path: '/' });
      throw new UnauthorizedException('invalid_token');
    }

    // attach profile & session to request
    request.acc_profile = authorized.profile;
    request.acc_session = authorized.session;
    request.acc_type = 'ADMIN';
    request.acc_isActive = authorized.isActive;

    if (!authorized.isAuthorized) {
      response.clearCookie(this.tokenName, { path: '/' });
      throw new UnauthorizedException('err_auth_unauthorized');
    }

    // refresh token in cookie if provided
    if (authorized.tokenData) {
      const { token: newToken, ttl } = authorized.tokenData;
      response.cookie(this.tokenName, newToken, {
        maxAge: ttl,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
    }

    this.logger.debug(`Admin authorized: ${request.acc_profile?.id}`);
    return true;
  }
}
