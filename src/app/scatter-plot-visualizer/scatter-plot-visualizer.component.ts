import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http'
import * as echart from 'echarts';

@Component({
  selector: 'app-scatter-plot-visualizer',
  templateUrl: './scatter-plot-visualizer.component.html',
  styleUrls: ['./scatter-plot-visualizer.component.less']
})
export class ScatterPlotVisualizerComponent implements OnInit {
 
  private myDemo: any
  private result:any
  private grid_index:any
  private grid_color:any
  private label_list:any
  private label_color_list:any
  private resLenght: any
  private coverBackground:any
  private coverBackgroundColor:any
  private isHiddingBg:boolean
  constructor() {
    this.isHiddingBg = false
   }
  ngOnInit(): void {
    this.myDemo = echart.init(document.getElementById('echarts') as HTMLDivElement)
    this.updateProjection()
  }

  updateProjection() {
    this.myDemo.showLoading()
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    fetch("http://localhost:5001/updateProjection", {
      method: 'POST',
      body: JSON.stringify({
        "path": "/Users/zhangyifan/Downloads/toy_model/resnet18_cifar10", "iteration": 1,
        "resolution": 400, "predicates": {}
      }),
      headers: headers,
      mode: 'cors'
    }).then(response => response.json()).then((data: any) => {
      this.result = data.result;
      this.resLenght = data.result.length

      this.grid_index = data.grid_index;
      this.grid_color = data.grid_color;
      this.label_list = data.label_list
      this.label_color_list = data.label_color_list

      this.coverBackground = this.grid_index.concat(this.result)
      this.coverBackgroundColor = this.grid_color.concat(this.label_color_list)
      this.renderChart()
    })
  }

  renderChart(withoutBg?:boolean) {
    let data:any,colorList:any
    if(withoutBg == true){
      data = this.result
      colorList = this.label_color_list
    } else{
      data = this.coverBackground
      colorList = this.coverBackgroundColor
    }
    let _this = this
    this.myDemo.setOption({
      xAxis: {type: 'value'},
      yAxis: {type: 'value'},
        dataZoom: [// 这个dataZoom组件，若未设置xAxisIndex或yAxisIndex，则默认控制x轴。
            {
                id: 'dataZoomX',
                type: 'inside',
                xAxisIndex: [0],
                filterMode: 'empty'
            },
            {
                id: 'dataZoomY',
                type: 'inside',
                yAxisIndex: [0],
                filterMode: 'empty'
            } 
      ],
      tooltip: {
        confine: true,
        formatter: function (params: any, tick: any, callback: any) {
          if (params.dataIndex <= _this.resLenght- 1) {
            let label = _this.label_list[params.dataIndex] as any
            return label
          } else {
            return 'background'
          }
        }
      },
      
      series: [
        {
          symbolSize:2,
          itemStyle: {
            color: (e: any) => {
              let color = `rgb(${colorList[e.dataIndex][0]},${colorList[e.dataIndex][1]},${colorList[e.dataIndex][2]})`
              return color
            }
          },
          data: data,
          type: 'scatter'
        }
      ]
    })
    this.myDemo.hideLoading()
  }

  hiddenBgClicked(e:any){
    console.log(e)
    console.log(e.target.classList.contains('actived'))
    if(e.currentTarget.classList.contains('actived') == true){
      e.currentTarget.classList.remove('actived')
      this.renderChart(false)
      this.isHiddingBg = false
    } else{
      e.currentTarget.classList.add('actived')
      this.renderChart(true)
      this.isHiddingBg = true
    }
  }
  handdleTriangle(e:any){
    if(e.currentTarget.classList.contains('actived') == true){
      e.currentTarget.classList.remove('actived')
      this.renderChart(this.isHiddingBg)
    } else{
      e.currentTarget.classList.add('actived')
      this.formPointByTriangle()
    }
  }

  formPointByTriangle(){
    let data = this.result
    let colorList = this.label_color_list
    let _this = this
    this.myDemo.setOption({
      xAxis: {type: 'value'},
    yAxis: {type: 'value'},
      dataZoom: [// 这个dataZoom组件，若未设置xAxisIndex或yAxisIndex，则默认控制x轴。
      
          {
              id: 'dataZoomX',
              type: 'inside',
              xAxisIndex: [0],
              filterMode: 'empty'
          },
          {
              id: 'dataZoomY',
              type: 'inside',
              yAxisIndex: [0],
              filterMode: 'empty'
          }
      
    ],
      tooltip: {
        confine: true,
        formatter: function (params: any, tick: any, callback: any) {
          if (params.dataIndex <= _this.resLenght- 1) {
            let label = _this.label_list[params.dataIndex] as any
            return label
          } else {
            return 'background'
          }
        }
      },
      
      series: [
        {
          symbolSize:(e:any,params:any)=>{
            console.log('e',e,params)
            if(params.dataIndex < 5000){
              return 10
            } else{
              return 2
            }
          },
          symbol:(e:any,params:any)=>{
            if(params.dataIndex < 5000){
              return 'triangle'
            } else{
              return 'cricle'
            }
          },
          itemStyle: {
            color: (e: any) => {
              let color = `rgb(${colorList[e.dataIndex][0]},${colorList[e.dataIndex][1]},${colorList[e.dataIndex][2]})`
              return color
            }
          },
          data: data,
          type: 'scatter'
        }
      ]
    })
  }


}
