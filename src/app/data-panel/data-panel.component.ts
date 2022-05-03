import { Component, OnInit } from '@angular/core';
interface Option {
  value: string,
  label: string
}
@Component({
  selector: 'app-data-panel',
  templateUrl: './data-panel.component.html',
  styleUrls: ['./data-panel.component.less']
})
export class DataPanelComponent implements OnInit {
  
  constructor() { }
  tensorSelected='0'
  tensorOptions:Option[] = [
    {value: '0', label: 'CIFAR10 with images'}
  ]
  labelBySelected = '0'
  labelByOptions:Option[] = [
    {value: '0', label: 'label'}
  ]
  colorBySelected = '1'
  colorByOptions:Option[] = [
    {value: '0', label: 'No color map'},
    {value: '1', label: 'label 10 color'}
  ]
  SphereizeDatachecked = false
  ngOnInit(): void {
  }

}
