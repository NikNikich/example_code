import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { EquipmentService } from '../../../../application/services/equipment.service';

import { User } from '../../../../core/domain/entity/user.entity';
import { GetUser } from '../../../decorators/get.user.decorator';
import { DeleteBaseResponse } from '../../../response/base/delete.base.response';
import { GetRequestId } from '../../../decorators/get.request.id.decorator';
import { NumberIdDto } from '../documentation/shared/number.id.dto';

import { Auth } from '../../../../core/common/decorators/auth';
import { UserRolesEnum } from '../../../shared/user.roles.enum';

import { EquipmentResponseDto } from '../../../response/equipment/equipment.response.dto';
import { EquipmentListResponseDto } from '../../../response/equipment/equipment.list.response.dto';
import { CreateEquipmentDto } from '../documentation/equipment/create.equipment.dto';
import { UpdateEquipmentDto } from '../documentation/equipment/update.equipment.dto';

@ApiUseTags('equipments')
@Controller('equipments')
export class EquipmentController {
  constructor(private equipmentService: EquipmentService) {}

  @Get()
  @Auth()
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: EquipmentListResponseDto,
  })
  @ApiOperation({ title: 'Список оборудование' })
  async getEquipmentList(
    @GetRequestId() requestId: string,
    @GetUser() user: User,
  ): Promise<EquipmentListResponseDto> {
    return new EquipmentListResponseDto(
      requestId,
      await this.equipmentService.getActiveEquipments(user),
    );
  }
  @Post()
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: EquipmentResponseDto })
  @ApiOperation({ title: 'Создание оборудования администратором' })
  async createEquipment(
    @GetRequestId() requestId: string,
    @Body(ValidationPipe) createEquipmentDto: CreateEquipmentDto,
  ): Promise<EquipmentResponseDto> {
    return new EquipmentResponseDto(
      requestId,
      await this.equipmentService.createEquipment(createEquipmentDto),
    );
  }

  @Put('/:id')
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: EquipmentResponseDto })
  @ApiOperation({ title: 'Изменение оборудования администратором' })
  async editEquipment(
    @GetRequestId() requestId: string,
    @Param(ValidationPipe) idDto: NumberIdDto,
    @Body(ValidationPipe) updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<EquipmentResponseDto> {
    return new EquipmentResponseDto(
      requestId,
      await this.equipmentService.editEquipment(idDto, updateEquipmentDto),
    );
  }

  @Get('/:id')
  @Auth()
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: EquipmentResponseDto,
  })
  @ApiOperation({ title: 'Список оборудование' })
  async getEquipment(
    @GetRequestId() requestId: string,
    @Param(ValidationPipe) idDto: NumberIdDto,
  ): Promise<EquipmentResponseDto> {
    return new EquipmentResponseDto(
      requestId,
      await this.equipmentService.getActiveEquipment(idDto),
    );
  }

  @Delete('/:id')
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: DeleteBaseResponse })
  @ApiOperation({ title: 'Удалить оборудование' })
  async delete(
    @GetRequestId() requestId: string,
    @GetUser() user: User,
    @Param(ValidationPipe) idDto: NumberIdDto,
  ): Promise<DeleteBaseResponse> {
    await this.equipmentService.delete(user, idDto.id);
    return new DeleteBaseResponse(requestId, null);
  }
}
