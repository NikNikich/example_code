import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { EquipmentService } from '../../../../application/services/equipment.service';

import { User } from '../../../../core/domain/entity/user.entity';
import { GetUser } from '../../../decorators/get.user.decorator';
import { DeleteBaseResponse } from '../../../response/base/delete.base.response';
import { GetRequestId } from '../../../decorators/get.request.id.decorator';
import { NumberIdDto } from '../documentation/shared/number.id.dto';
import { Equipment } from '../../../../core/domain/entity/equipment.entity';
import { Auth } from '../../../../core/common/decorators/auth';
import { UserRolesEnum } from '../../../shared/user.roles.enum';

@ApiUseTags('equipments')
@Controller('equipments')
export class EquipmentController {
  constructor(private equipmentService: EquipmentService) {}

  // TODO сделать нормально гард ролей юзера
  @Get()
  @Auth([UserRolesEnum.ADMIN])
  /*@UseGuards(AuthGuard())
  @ApiBearerAuth()*/
  @ApiResponse({ status: HttpStatus.OK, isArray: true, type: Equipment })
  @ApiOperation({ title: 'Список оборудование' })
  async equipmentList(@GetUser() user: User): Promise<Equipment[]> {
    return await this.equipmentService.getActiveEquipments(user);
  }

  @Delete('/:id')
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: DeleteBaseResponse })
  @ApiOperation({ title: 'Удалить Equipment' })
  async delete(
    @GetRequestId() requestId: string,
    @GetUser() user: User,
    @Param(ValidationPipe) idDto: NumberIdDto,
  ): Promise<DeleteBaseResponse> {
    await this.equipmentService.delete(user, idDto.id);
    return new DeleteBaseResponse(requestId, null);
  }
}
