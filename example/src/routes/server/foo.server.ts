import type { LoaderFunctionArgs } from 'react-router';
import { Injectable, Req, UseGuards } from '@nestjs/common';
import { Loader, Action, useServer } from 'nest-react-router';
import { AppService } from '~/modules/app/app.service';
import { UserAuthGuard } from '~/common/user.auth.guard';

@Injectable()
@UseGuards(
  new UserAuthGuard({
    // redirectUrl: '/',
  }),
)
export class FooBackend {
  constructor(private readonly appService: AppService) {}

  @Loader()
  loader(@Req() req: Request) {
    return 'Congratulations you have permission to access this page';
  }

  @Action()
  action() {
    this.appService.logout();
    return true;
  }
}

export const useFooServer = (args: LoaderFunctionArgs) =>
  useServer(FooBackend)(args);
