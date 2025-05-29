import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { AuthUserType } from 'src/common/FileType.type';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('interaction')
@ApiTags('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  @Public()
  create(@Body() createInteractionDto: CreateInteractionDto, @AuthUser() user: AuthUserType) {
    createInteractionDto.user_id = user.sub;
    return this.interactionService.create(createInteractionDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.interactionService.findAll();
  }
  // @Get('/transfer')
  // @Public()
  // transferAll() {
  //   return this.interactionService.transferAll();
  // }
  // @Get('/transfer-user')
  // @Public()
  // transferAllUser() {
  //   return this.interactionService.transferAllUsers();
  // }

  @Get('/hybrid-recomendation/:shoe_id')
  @Public()
  findHybridRecommendation(@Param('shoe_id') shoe_id: string, @AuthUser() user: AuthUserType) {
    const user_id = user.sub;
    return this.interactionService.findHybridRecommendation(user_id, shoe_id);
  }
  @Get('/collborative-recomendation')
  @Public()
  findCollaborativeRecomnendation(@AuthUser() user: AuthUserType) {
    const user_id = user.sub;
    return this.interactionService.findCollaborativeRecommendation(user_id);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.interactionService.findOne(+id);
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateInteractionDto: UpdateInteractionDto) {
    return this.interactionService.update(+id, updateInteractionDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.interactionService.remove(+id);
  }
}
