import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {

  @Get()
  @Public()
  getHello(): string {
    return 'hello all';
  }
}
