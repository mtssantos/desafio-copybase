import { Injectable } from '@nestjs/common';
import { parse, getMonth } from 'date-fns';
import * as xlsx from 'xlsx';


@Injectable()
export class AppService {

  processWorksheet(fileBuffer: Buffer): any {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(worksheet);
    return data;
  }

  separatePlanType(clients: any[], cobradaACadaXDias: number): any[] {
    return clients.filter((client) => client["cobrada a cada X dias"] === cobradaACadaXDias);
  }

  calcMRR(clients: any[]): number {
    const mrr = clients.reduce((total, client) => {
      return total + client.valor;
    }, 0);

    const mrrFormatBrl = mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return mrrFormatBrl;
  }

  calcMRRMonthly(clientsMonthly: any[]): any[] {
    const clientsperMonthly: { [key: string]: any[] } = {};

    clientsMonthly.forEach((client) => {
      const mes = this.extractMonthlyDate(client.data_status);
      if (!clientsperMonthly[mes]) {
        clientsperMonthly[mes] = [];
      }
      clientsperMonthly[mes].push(client);
    });

    const mrrPorMes: any[] = [];

    for (const mes in clientsperMonthly) {
      if (clientsperMonthly.hasOwnProperty(mes)) {
        const clientesNoMes = clientsperMonthly[mes];
        const mrr = this.calcMRR(clientesNoMes);
        mrrPorMes.push({
          mes: mes,
          mrr: mrr,
        });
      }
    }

    return mrrPorMes;
  }

  countStatus(clients: any[], status: string): number {
    return clients.filter((client) => client.status === status).length;
  }

  calcChurnRate(clientsCanceled: any[], clientsActiveStart: any[]): number {
    if(clientsActiveStart.length === 0){
      return 0;
    }

    const churnRate = (clientsCanceled.length / clientsActiveStart.length) * 100;

    const churnRateFormat = Math.round(churnRate * 100) / 100;

    return churnRateFormat;
  }

}
