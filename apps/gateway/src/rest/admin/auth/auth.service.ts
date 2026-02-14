import { Injectable, Logger } from '@nestjs/common';

import { AuthorizeOutputDto, RequestWithUserData, StatusResponseDto } from '../../../dtos/public.dto';
import { handleSrvCliResponse } from '../../../response/http.exeption.filter';
import { AdminSessionModel, AdminSignInInputDto, AdminSignInOutputDto, GetAdminProfileOutputDto } from '../../../dtos/admin/admin.dto';
import { MainServiceClient } from '../../../services/service.main';


@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(private readonly mainSrvCli: MainServiceClient) {}

  async authorize(token: string): Promise<AuthorizeOutputDto> {
    this.logger.debug(`Authorizing admin token: ${token}`);

    const response = await this.mainSrvCli.callAction({
      provider: 'ADMINS',
      action: 'authorize',
      query: { token },
    });

    const result = handleSrvCliResponse<AuthorizeOutputDto>(response);
    this.logger.debug(`Authorization result: ${JSON.stringify(result)}`);

    return result;
  }

  async signIn(signInData: AdminSignInInputDto): Promise<AdminSignInOutputDto> {
    this.logger.log(`Signing in admin: ${signInData.email}`);

    const response = await this.mainSrvCli.callAction({
      provider: 'ADMINS',
      action: 'signIn',
      query: signInData,
    });

    const result = handleSrvCliResponse<AdminSignInOutputDto>(response);

    this.logger.log(`SignIn successful for: ${signInData.email}`);
    return result;
  }

  async signOut(session: AdminSessionModel): Promise<StatusResponseDto> {
    if (!session?.id) {
      this.logger.warn('Attempted to sign out without a valid session ID');
      throw new Error('Invalid session');
    }

    this.logger.log(`Signing out admin session: ${session.id}`);

    const response = await this.mainSrvCli.callAction({
      provider: 'ADMINS',
      action: 'signOut',
      query: { id: session.id },
    });

    const result = handleSrvCliResponse<StatusResponseDto>(response);

    this.logger.log(`SignOut successful for session: ${session.id}`);
    return result;
  }

  async getProfile(
    req: RequestWithUserData,
  ): Promise<GetAdminProfileOutputDto> {
    if (!req?.acc_profile || !req?.acc_session) {
      this.logger.warn('No admin session/profile found in request');
      throw new Error('Admin not authenticated');
    }

    return {
      userType: 'ADMIN',
      profile: req.acc_profile,
      session: req.acc_session,
    };
  }
}
