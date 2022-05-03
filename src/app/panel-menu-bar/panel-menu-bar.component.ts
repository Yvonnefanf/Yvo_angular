import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ScatterPlotVisualizerComponent} from '../scatter-plot-visualizer/scatter-plot-visualizer.component'
@Component({
  selector: 'app-panel-menu-bar',
  templateUrl: './panel-menu-bar.component.html',
  styleUrls: ['./panel-menu-bar.component.less'],
  providers: [ScatterPlotVisualizerComponent]
})
export class PanelMenuBarComponent implements OnInit {

  constructor(  private scatterPlotVisualizerComponent: ScatterPlotVisualizerComponent) { }
  ngOnInit(): void {

  }
  hiddenBgClicked(e:any){
    console.log(e)
    console.log(e.target.classList.contains('actived'))
    if(e.currentTarget.classList.contains('actived') == true){
      e.currentTarget.classList.remove('actived')
      this.scatterPlotVisualizerComponent.renderChart()
    } else{
      e.currentTarget.classList.add('actived')
      // ScatterPlotVisualizerComponent.renderChart()
      this.scatterPlotVisualizerComponent.renderChart()
    }
    
  }


}
