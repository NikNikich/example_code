import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from '../../../../core/common/decorators/auth';
import { UserRolesEnum } from '../../../shared/user.roles.enum';

import { GetRequestId } from '../../../decorators/get.request.id.decorator';

import { BuildingService } from '../../../../application/services/building service';
import { FilterBuildingDto } from '../documentation/building/filter.building.dto';
import { GetBuildingResponse } from '../../../response/building/get.building.response';
import { NumberIdDto } from '../documentation/shared/number.id.dto';
import { GetByIdBuildingDto } from '../../../response/building/get.by.id.building.dto';
import { plainToClass } from 'class-transformer';

@ApiUseTags('buildings')
@Controller('buildings')
export class BuildingController {
  constructor(private buildingService: BuildingService) {}

  @Get()
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: GetBuildingResponse })
  @ApiOperation({
    title: 'Получить список зданий, отфильтрованных по региону и городу',
  })
  async get(
    @GetRequestId() requestId: string,
    @Query(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    filter: FilterBuildingDto,
  ): Promise<GetBuildingResponse> {
    const response = await this.buildingService.getListBuilding(filter);
    const getBuildingResponse = new GetBuildingResponse(requestId, response);
    return plainToClass(GetBuildingResponse, getBuildingResponse);
  }

  @Get(':id')
  @Auth([UserRolesEnum.ADMIN])
  @ApiResponse({ status: HttpStatus.OK, type: GetByIdBuildingDto })
  @ApiOperation({
    title: 'Получить здание по id',
  })
  async getById(
    @GetRequestId() requestId: string,
    @Param(
      new ValidationPipe({
        transform: true,
      }),
    )
    idDto: NumberIdDto,
  ): Promise<GetByIdBuildingDto> {
    const response = await this.buildingService.getById(idDto);
    const getByIdBuildingDto = new GetByIdBuildingDto(requestId, response);
    return plainToClass(GetByIdBuildingDto, getByIdBuildingDto);
  }
}
