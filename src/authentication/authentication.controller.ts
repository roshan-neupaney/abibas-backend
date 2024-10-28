import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateAuthenticationDto } from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { CreateRefreshDto } from './dto/create-refresh.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Get('signup')
  Get() {
    try{
      return "hello";
    } catch(e) {
      console.log(e)
    }
  }
  @Public()
  @Post('signup')
  @UsePipes(new ValidationPipe())
  create(@Body() createAuthenticationDto: CreateAuthenticationDto) {
    try{
      return this.authenticationService.create(createAuthenticationDto);
    } catch(e) {
      console.log(e)
    }
  }

  @Public()
  @Post('refresh')
  refresh(@Body() createRefreshDto: CreateRefreshDto) {
    try {
      return this.authenticationService.refresh(createRefreshDto);
    } catch (error) {
      return error;
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: CreateLoginDto){
    try {
      return this.authenticationService.login(body)
    } catch (error) {
      return new HttpException(error.message, error.status)
    }
  }

  @Public()
  @Get()
  findAll() {
    return this.authenticationService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authenticationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthenticationDto: UpdateAuthenticationDto) {
  //   return this.authenticationService.update(+id, updateAuthenticationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authenticationService.remove(+id);
  // }
}
