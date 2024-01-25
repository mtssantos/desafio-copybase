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

      const monthlyPlan = this.appService.separatePlanType(data, "30");
      const yearlyPlan = this.appService.separatePlanType(data, "365") || this.appService.separatePlanType(data, "360");

      const monthlyPlanActivesClients = monthlyPlan.filter((client) => client.status === 'Ativa');
      const monthlyPlanCanceledClients = monthlyPlan.filter((client) => client.status === 'Cancelada');

      const yearlyPlanActivesClients = yearlyPlan.filter((client) => client.status === 'Ativa');
      const yearlyPlanCanceledClients = yearlyPlan.filter((client) => client.status === 'Cancelada');

      const mrrClientActivesMonthly = this.appService.calcMRRMonthly(monthlyPlanActivesClients);
      const mrrClientCanceledMonthly = this.appService.calcMRRMonthly(monthlyPlanCanceledClients);
      
      const mrrClientActivesYear = this.appService.calcMRR(yearlyPlanActivesClients);
      const mrrClientCanceledYear = this.appService.calcMRR(yearlyPlanCanceledClients);

      // const countActives = this.appService.countStatus(data, 'Ativa');
      // const countCanceled = this.appService.countStatus(data, 'Cancelada');

      // const churnRateMonthly = this.appService.calcChurnRate(clientCanceledMonthly, clientActivesMonthly);
      // const churnRateYear = this.appService.calcChurnRate(clientCanceledYears, clientActiveYears);

      return{
        file: tempFilePath,
        results: {
          mrr:{
            monthly: {
              mrrClientActivesMonthly,
              mrrClientCanceledMonthly
            },
            yearly: {
              mrrClientActivesYear,
              mrrClientCanceledYear
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
