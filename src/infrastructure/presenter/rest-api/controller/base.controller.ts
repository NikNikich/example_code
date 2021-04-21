import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { BaseService } from '../../../../application/services/base.service';
import { GetRequestId } from '../../../decorators/get.request.id.decorator';
import { CreateBaseResponse } from '../../../response/base/create.base.response';
import { DeleteBaseResponse } from '../../../response/base/delete.base.response';
import { GetBaseResponse } from '../../../response/base/get.base.response';
import { GetManyBaseResponse } from '../../../response/base/get.many.base.response';
import { UpdateBaseResponse } from '../../../response/base/update.base.response';
import { CreateBaseDto } from '../documentation/base/create.base.dto';
import { UpdateBaseDto } from '../documentation/base/update.base.dto';
import { DirectionSortingDto } from '../documentation/shared/direction.sorting.dto';
import { NumberIdDto } from '../documentation/shared/number.id.dto';
import { LimitOffsetDto } from '../documentation/shared/limit.offset.dto';

@ApiUseTags('bases')
@Controller('bases')
export class BaseController {
  constructor(private baseService: BaseService) {}

  @Post('/')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateBaseResponse })
  @ApiOperation({ title: 'Создать Base' })
  async create(
    @GetRequestId() requestId: string,
    @Body(ValidationPipe) createBaseDto: CreateBaseDto,
  ): Promise<CreateBaseResponse> {
    const response = await this.baseService.create(createBaseDto);
    return new CreateBaseResponse(requestId, response);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: GetBaseResponse })
  @ApiOperation({ title: 'Получить Base' })
  async get(
    @GetRequestId() requestId: string,
    @Param(ValidationPipe) idDto: NumberIdDto,
  ): Promise<GetBaseResponse> {
    const response = await this.baseService.get(idDto.id);
    return new GetBaseResponse(requestId, response);
  }

  @Get('/')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: GetManyBaseResponse })
  @ApiOperation({ title: 'Получить список Base' })
  async getMany(
    @GetRequestId() requestId: string,
    @Query(ValidationPipe) limitOffset: LimitOffsetDto,
    @Query(ValidationPipe) direction: DirectionSortingDto,
  ): Promise<GetManyBaseResponse> {
    const response = await this.baseService.getMany(limitOffset, direction);
    return new GetManyBaseResponse(requestId, response);
  }

  @Put('/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: UpdateBaseResponse })
  @ApiOperation({ title: 'Получить Base' })
  async update(
    @GetRequestId() requestId: string,
    @Param(ValidationPipe) idDto: NumberIdDto,
    @Body(ValidationPipe) updateBaseDto: UpdateBaseDto,
  ): Promise<UpdateBaseResponse> {
    const response = await this.baseService.update(idDto.id, updateBaseDto);
    return new UpdateBaseResponse(requestId, response);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: DeleteBaseResponse })
  @ApiOperation({ title: 'Удалить Base' })
  async delete(
    @GetRequestId() requestId: string,
    @Param(ValidationPipe) idDto: NumberIdDto,
  ): Promise<DeleteBaseResponse> {
    await this.baseService.delete(idDto.id);
    return new DeleteBaseResponse(requestId, null);
  }
}
