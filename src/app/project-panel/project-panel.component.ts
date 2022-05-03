import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import {ModalService} from '../module.service'
import {ScatterPlotVisualizerComponent} from '../scatter-plot-visualizer/scatter-plot-visualizer.component'

@Component({
  selector: 'app-project-panel',
  templateUrl: './project-panel.component.html',
  styleUrls: ['./project-panel.component.less'],
  providers: [ModalService,ScatterPlotVisualizerComponent]
})
export class ProjectPanelComponent implements OnInit {
  // private resolution
  // private iteration
  constructor(private scatterPlotVisualizerComponent: ScatterPlotVisualizerComponent,private ref:ChangeDetectorRef) {
     //this.resolution = 1
    //  this.resolution = 400
    //  this.iteration = 1
   }
   resolution = 400
   iteration = 1
   preDisabled = true
   nextDisabled = false

  ngOnInit(): void {
  }
  
  goNextResolution(){
    this.iteration++
    let dom = document.getElementById("nextDVIBtn") as HTMLButtonElement
    dom.classList.add('mat-button-disabled')
    // 在需要更新数据的地方引用
     this.ref.markForCheck();
    this.ref.detectChanges();
    this.scatterPlotVisualizerComponent.updateProjection({iteration:this.iteration,resolution:this.resolution,chart:this.scatterPlotVisualizerComponent.myDemo },()=>{
      dom.classList.remove('mat-button-disabled')
    })
  }

  goPreResolution(){
    this.iteration --
    let dom = document.getElementById("nextDVIBtn") as HTMLButtonElement
    dom.classList.add('mat-button-disabled')
    // 在需要更新数据的地方引用
    this.scatterPlotVisualizerComponent.updateProjection({iteration:this.iteration,resolution:this.resolution,chart:this.scatterPlotVisualizerComponent.myDemo },()=>{
      dom.classList.remove('mat-button-disabled')
    })
  }

}
