import { GetRequestId } from '../../../decorators/get.request.id.decorator';
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from '../../../../application/services/app.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { RootResponse } from '../../../response/app.response';
import {
  SettingsData,
  SettingsResponse,
} from '../../../response/settings/settings.response';
import * as config from 'config';
import path = require('path');
import { Auth } from '../../../../core/common/decorators/auth';
import { UserRightsEnum } from '../../../shared/enum/user.rights.enum';

@ApiUseTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth([UserRightsEnum.ALL])
  @ApiResponse({ status: HttpStatus.OK, type: RootResponse })
  @ApiOperation({
    title: 'Служебная информация для разработчиков',
  })
  getRoot(@GetRequestId() requestId: string): RootResponse {
    return new RootResponse(requestId, this.appService.getUptime());
  }

  @ApiOperation({
    title: 'Получить privacy',
    description: '',
  })
  @Get('/privacy')
  @Auth([UserRightsEnum.ALL])
  @ApiResponse({ status: HttpStatus.OK })
  async getPrivacy(@Res() res: Response): Promise<void> {
    res.sendFile(path.join(__dirname, '/../static/privacy.html'));
  }

  @ApiOperation({
    title: 'Получить terms',
    description: '',
  })
  @Get('/terms')
  @Auth([UserRightsEnum.ALL])
  @ApiResponse({ status: HttpStatus.OK })
  async getTerm(@Res() res: Response): Promise<void> {
    res.sendFile(path.join(__dirname, '/../static/terms.html'));
  }

  @Get('/settings')
  @Auth([UserRightsEnum.ALL])
  @ApiResponse({ status: HttpStatus.OK, type: SettingsResponse })
  @ApiOperation({
    title: 'Get start settings',
  })
  async getSettings(
    @GetRequestId() requestId: string,
  ): Promise<SettingsResponse> {
    const settingsData: SettingsData = {
      cdnUrl: config.get<string>('settings.cdnUrl'),
    };

    return new SettingsResponse(requestId, settingsData);
  }
}
