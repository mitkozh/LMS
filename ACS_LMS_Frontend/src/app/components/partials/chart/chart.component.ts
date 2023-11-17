import { Component, OnInit } from '@angular/core';
import { MockDataService } from 'app/core/mock-data.service';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          color: 'red', // Customize the label colors here
        },
      },
    },
    plugins: {
      title: {
        align: 'start',
        display: true,
        text: 'Visitors and Borrowers Statistics',
      },
      legend:{
        align: 'start',

      }
    }
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset[] = [];

  selectedOption: 'week' | 'month' | 'year' = 'week';

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.onChange();
  }

  onChange() {
    console.log(this.selectedOption);

    const data = this.mockDataService.generateData(this.selectedOption);

    this.barChartData = [
      { data: data.values, label: 'Borrowed Books' },
      { data: data.values, label: 'Library Visitors' }
    ];

    this.barChartLabels = data.dates;
  }
}
