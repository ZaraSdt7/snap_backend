import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';
import { AdminAuthService } from './auth.service';

import type { Response } from 'express';
import { AdminAuthGuard } from './auth.guard';
import { HttpExceptionFilter } from '../../../response/http.exeption.filter';
import { ResponseInterceptor } from '../../../response/response.interceptors';
import { Public } from '../../../common/public.decorator';
import { AdminSignInInputDto, AdminSignInOutputDto, GetAdminProfileOutputDto } from '../../../dtos/admin/admin.dto';
import { RequestWithUserData } from '../../../dtos/public.dto';

@ApiTags('Admin: Auth')
@UseGuards(AdminAuthGuard)
@ApiCookieAuth()
@Controller('auth')
@ApiBadRequestResponse({ description: 'Bad Request | Invalid Inputs' })
@ApiUnauthorizedResponse({ description: 'Session expired or Unauthorized' })
@ApiForbiddenResponse({ description: 'No Access | Permission denied' })
@ApiUnsupportedMediaTypeResponse({ description: 'Invalid Content-Type or Context' })
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
export class AdminAuthController {
  private readonly logger = new Logger(AdminAuthController.name);
  private readonly tokenName = 'auth_admin';

  constructor(private readonly authService: AdminAuthService) {}

  @Post('signin')
  @Public()
  @ApiOperation({ summary: 'Sign in as admin with email & password' })
  async signIn(
    @Body() body: AdminSignInInputDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GetAdminProfileOutputDto> {
    this.logger.log(`Admin signing in with email: ${body.email}`);
    const signInData: AdminSignInOutputDto = await this.authService.signIn(body);

    if (!signInData.tokenData) {
      throw new Error('Token data missing after signIn');
    }

    const { accessToken, expiresIn } = signInData.tokenData;
    res.cookie(this.tokenName, accessToken, {
      maxAge: expiresIn,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return {
      userType: 'ADMIN',
      profile: signInData.profile,
      session: signInData.session,
    };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get admin profile (guarded)' })
  async getProfile(
    @Req() req: RequestWithUserData,
  ): Promise<GetAdminProfileOutputDto> {
    this.logger.debug(`Fetching profile for admin id: ${req.acc_profile?.id}`);
    return {
      userType: 'ADMIN',
      profile: req.acc_profile,
      session: req.acc_session,
    };
  }

  @Post('signout')
  @ApiOperation({ summary: 'Sign out admin' })
  async signOut(
    @Req() req: RequestWithUserData,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    const session = req.acc_session;
    if (!session) {
      this.logger.warn('No admin session found for signout');
      throw new Error('No session found for logout');
    }

    this.logger.log(`Signing out admin id: ${req.acc_profile?.id}`);
    await this.authService.signOut(session);

    // Clear cookie securely
    res.clearCookie(this.tokenName, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { success: true };
  }
}
