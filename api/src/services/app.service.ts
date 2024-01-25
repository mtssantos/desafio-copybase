import { Injectable } from '@nestjs/common';
import { parse, getMonth } from 'date-fns';
import * as xlsx from 'xlsx';


@Injectable()
export class AppService {

  private isDateString(value: any): boolean {
    return typeof value === 'string' && !!value.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
  }

  private normalizeDate(dateString: string): string {
    const parts = dateString.split('/');

    if (parts[2].length === 2) {
      return `${parts[1]}/${parts[0]}/20${parts[2]}`;
    } else {
      return dateString;
    }
  }
  

  processWorksheet(fileBuffer: Buffer): any {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const dataString = xlsx.utils.sheet_to_json(worksheet, {raw:false});

    dataString.map((data) => {
      Object.keys(data).forEach(element => {
        if (this.isDateString(data[element])) {
          data[element] = this.normalizeDate(data[element]);
        }
      });

      return data;
    });

    return dataString;
  }

  separatePlanType(clients: any[], cobradaACadaXDias: string): any[] {
    return clients.filter((client) => client["cobrada a cada X dias"] === cobradaACadaXDias);
  }

  extractMonthlyDate(dateStatus: string): string { 
    try {
      if (!dateStatus) {
        throw new Error('String de data ausente ou vazia');
      }
  
      const data = parse(dateStatus, 'M/d/yy HH:mm', new Date());
  
      if (!isNaN(data.getTime())) {
        const month = (getMonth(data) + 1).toString();
        return month;
      } else {
        throw new Error('Formato de data inválido após a análise');
      }
    } catch (error) {
      console.error('Erro ao extrair mês da dateStatus:', error);
      return 'N/A';
    }
  }

  calcMRR(clients: any[]): number {
    const mrr = clients.reduce((total, client) => {
      return total + Number(client["valor"]);
    }, 0);

    const mrrFormatBrl = mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    return mrrFormatBrl;
  }

  calcMRRMonthly(clientsMonthly: any[]): any[] {
    const clientsperMonthly: { [key: string]: any[] } = {};

    clientsMonthly.forEach((client) => {
      const month = this.extractMonthlyDate(client["data início"]);
      if (!clientsperMonthly[month]) {
        clientsperMonthly[month] = [];
      }
      clientsperMonthly[month].push(client);
    });

    const mrrPormonth: any[] = [];

    for (const month in clientsperMonthly) {
      if (clientsperMonthly.hasOwnProperty(month)) {
        const clientesNomonth = clientsperMonthly[month];
        const mrr = this.calcMRR(clientesNomonth);
        mrrPormonth.push({
          month: month,
          mrr: mrr,
        });
      }
    }

    return mrrPormonth;
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
