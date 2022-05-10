import { Component, OnInit } from '@angular/core';
import {ScatterPlotVisualizerComponent} from '../scatter-plot-visualizer/scatter-plot-visualizer.component'
@Component({
  selector: 'app-inspector-panel',
  templateUrl: './inspector-panel.component.html',
  styleUrls: ['./inspector-panel.component.less'],
  providers: [ScatterPlotVisualizerComponent]
})
export class InspectorPanelComponent implements OnInit {

  constructor(private scatterPlotVisualizerComponent:ScatterPlotVisualizerComponent) { }
  searchContent = ''
  searchBy = 'label'
  confidenceTo:number = 0
  confidenceFrom:number = 0
  searchByOptions = [
    {value:'type',label:'type'},
    {value:'label',label:'label'},
    {value:'new_selection',label:'new_selection'}
  ]
  ngOnInit(): void {
  }

  query(){
    this.scatterPlotVisualizerComponent.queryByCondition({chart:this.scatterPlotVisualizerComponent.myDemo},this.searchBy,this.searchContent,this.confidenceFrom,this.confidenceTo,()=>{
      this.scatterPlotVisualizerComponent.formPointByTriangle({chart:this.scatterPlotVisualizerComponent.myDemo})
    })
  }

}
