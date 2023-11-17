import { Component, Input, OnInit } from '@angular/core';
import { IStatBoxData } from 'app/core/book.service';

@Component({
  selector: 'app-stat-box',
  templateUrl: './stat-box.component.html',
  styleUrls: ['./stat-box.component.scss']
})
export class StatBoxComponent implements OnInit {
  @Input() statBoxData: IStatBoxData = {
    label: "",
    icon: "",
    stat: 0.02,
    change: 1,
    bgColor: '',
    iconColor: '',
    iconBgColor: ''
  };

  constructor() {}

  ngOnInit(): void {
  }
}