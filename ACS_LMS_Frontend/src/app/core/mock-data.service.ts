import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private readonly MAX_VALUE = 200;
  private readonly MIN_VALUE = 1;

  generateData(period: 'week' | 'month' | 'year'): { dates: string[], values: number[] } {
    const currentDate = new Date();
    const startDate = this.calculateStartDate(period, currentDate);

    const dates: string[] = [];
    const values: number[] = [];

    for (let date = startDate; date <= currentDate; date.setDate(date.getDate() + 1)) {
      dates.push(this.getLabel(period, date));
      values.push(this.getRandomValue());
    }

    return { dates, values };
  }

  private calculateStartDate(period: 'week' | 'month' | 'year', currentDate: Date): Date {
    const startDate = new Date(currentDate);
  
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 6); // Go back 6 days from the current date
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setMonth(0);
      startDate.setDate(1);
    }
  
    return startDate;
  }

  
private getLabel(period: 'week' | 'month' | 'year', date: Date): string {
  if (period === 'week') {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const index = date.getDay();
    return daysOfWeek[index];
  } else if (period === 'month') {
    return this.formatDate(date);
  } else if (period === 'year') {
    const week = Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return 'Week ' + week;
  }
  return "";
}
  
private formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

private getRandomValue(): number {
  return Math.floor(Math.random() * (this.MAX_VALUE - this.MIN_VALUE + 1)) + this.MIN_VALUE;
}
  constructor() { }
}
