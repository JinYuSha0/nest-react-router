import { redirect } from 'react-router';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from '~/modules/app/app.service';
import { ReactRouterUnauthorizedException } from './react-router.exceptions';

@Injectable()
export class UserAuthGuard implements CanActivate {
  private readonly redirectUrl?: string;

  constructor(options?: { redirectUrl?: string }) {
    this.redirectUrl = options?.redirectUrl;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (AppService.logged) {
      return true;
    }
    if (
      this.redirectUrl != null &&
      req.method === 'GET' &&
      req.handleByReactRouter
    ) {
      throw redirect(this.redirectUrl);
    }
    throw ReactRouterUnauthorizedException();
  }
}
