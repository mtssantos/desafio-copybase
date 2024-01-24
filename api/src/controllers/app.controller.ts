import { Controller, Get, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as tmp from 'tmp';
import { SampleDto } from '../sample.dto';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return 'Hello World!'
  }
  
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  uploadFile(
    @Body() body: SampleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const tempFilePath = tmp.tmpNameSync();
      const fs = require('fs');

      fs.writeFileSync(tempFilePath, file.buffer);

      const data = this.appService.processWorksheet(file.buffer);

      const clientsMonthly = this.appService.separatePlanType(data, 30);
      const clientsYears = this.appService.separatePlanType(data, 365);

      const clientActivesMonthly = clientsMonthly.filter((client) => client.status === 'Ativa');
      const clientCanceledMonthly = clientsMonthly.filter((client) => client.status === 'Cancelada');

      const clientActiveYears = clientsYears.filter((client) => client.status === 'Ativa');
      const clientCanceledYears = clientsYears.filter((client) => client.status === 'Cancelada');

      const mrrClientActivesMonthly = this.appService.calcMRRMonthly(clientActivesMonthly);
      const mrrClientCanceledMonthly = this.appService.calcMRRMonthly(clientCanceledMonthly);
      
      // const mrrClientActivesYear = this.appService.calcMRR(clientActiveYears);
      // const mrrClientCanceledYear = this.appService.calcMRR(clientCanceledYears);

      // const countActives = this.appService.countStatus(data, 'Ativa');
      // const countCanceled = this.appService.countStatus(data, 'Cancelada');

      // const churnRateMonthly = this.appService.calcChurnRate(clientCanceledMonthly, clientActivesMonthly);
      // const churnRateYear = this.appService.calcChurnRate(clientCanceledYears, clientActiveYears);


      return{
        file: tempFilePath,
        results: {
          mrr:{
            monthly: {
              clientsMonthly
            }
          },
        
        },
      }
    } else {
      return {
        message: 'File not found!',
      };
    }
  }

}
