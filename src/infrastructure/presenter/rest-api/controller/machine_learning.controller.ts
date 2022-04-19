import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from '../../../../core/common/decorators/auth';
import { UserRightsEnum } from '../../../shared/enum/user.rights.enum';
import { GetBuildingResponse } from '../../../response/building/get.building.response';
import { GetRequestId } from '../../../decorators/get.request.id.decorator';
import { GetUser } from '../../../decorators/get.user.decorator';
import { User } from '../../../../core/domain/entity/user.entity';
import { plainToClass } from 'class-transformer';
import { GetByIdBuildingDto } from '../../../response/building/get.by.id.building.dto';
import { MachineLearningService } from '../../../../application/services/machine_learning.service';
import { GetIdListResponse } from '../../../response/machine_learning/get.id.list.response';
import { GetLogListResponse } from '../../../response/machine_learning/get.log.list.response';
import { LogMachineLearningDto } from '../documentation/machine_learning/log.machine_learning.dto';

@ApiUseTags('machine_learning')
@Controller('machine_learning')
export class MachineLearningController {
  constructor(private machineLearningService: MachineLearningService) {}

  @Get('/id')
  @Auth([UserRightsEnum.MACHINE_LEARNING_READ])
  @ApiResponse({ status: HttpStatus.OK, type: GetBuildingResponse })
  @ApiOperation({
    title: 'Получить список id борудования',
  })
  async getId(
    @GetRequestId() requestId: string,
    @GetUser() user: User,
  ): Promise<GetIdListResponse> {
    const response = await this.machineLearningService.getIds();
    const getIdListResponse = new GetIdListResponse(requestId, response);
    return plainToClass(GetIdListResponse, getIdListResponse);
  }

  @Get('/log')
  @Auth([UserRightsEnum.MACHINE_LEARNING_READ])
  @ApiResponse({ status: HttpStatus.OK, type: GetByIdBuildingDto })
  @ApiOperation({
    title: 'Получить логи по id оборудования',
  })
  async getLogs(
    @GetRequestId() requestId: string,
    @GetUser() user: User,
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    filter: LogMachineLearningDto,
  ): Promise<GetLogListResponse> {
    const response = await this.machineLearningService.getLogs(filter);
    const getLogListResponse = new GetLogListResponse(requestId, response);
    return plainToClass(GetLogListResponse, getLogListResponse);
  }
}
