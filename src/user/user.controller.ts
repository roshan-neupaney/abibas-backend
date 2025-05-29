import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { AuthUserType } from 'src/common/FileType.type';
import { uploadImageWithNoSizes } from 'src/common/helper';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedFile: any;
    if (file) {
      uploadedFile = await uploadImageWithNoSizes(file);
    }
    if (uploadedFile) {
      createUserDto.image_name = file?.filename;
    }
    return this.userService.create(createUserDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('all/myDetail')
  findUserDetail(@AuthUser() user: AuthUserType) {
    return this.userService.findUserDetail(user.sub);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedFile: any;
    if (file) {
      uploadedFile = await uploadImageWithNoSizes(file);
    }
    if (uploadedFile) {
      updateUserDto.image_name = file?.filename;
    }
    return this.userService.update(id, updateUserDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
