import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http'
import * as echart from 'echarts';

declare global {
  interface Window {
    dviData: any,
    dviIterationList: any[],
    selectedPoints: number[]
  }
}
@Component({
  selector: 'app-scatter-plot-visualizer',
  templateUrl: './scatter-plot-visualizer.component.html',
  styleUrls: ['./scatter-plot-visualizer.component.less']
})
export class ScatterPlotVisualizerComponent implements OnInit {

  public myDemo: any
  private result: any
  private grid_index: any
  private grid_color: any
  private label_list: any
  private label_color_list: any
  private resLenght: any
  private isHiddingBg: boolean
  constructor() {
    this.isHiddingBg = false
  }
  ngOnInit(): void {
    this.myDemo = echart.init(document.getElementById('echarts') as HTMLDivElement)
    this.updateProjection()
    window.onresize = () => {
      //  根据窗口大小调整曲线大小
      this.myDemo.resize();
    };
  }

  updateProjection(params?: any, callback?: Function) {
    if (params?.chart) {
      this.myDemo = params.chart
    }
    if (this.myDemo) {
      this.myDemo = null
    }
    let iteration = 1, resolution = 400, predicates = {}
    if (params) {
      iteration = Number(params.iteration) || 1
      resolution = Number(params.resolution) || 400
      predicates = params.predicates || {}
    }
    this.myDemo = echart.init(document.getElementById('echarts') as HTMLDivElement)
    this.myDemo.resize({ height: null });
    this.myDemo.showLoading({
      text: 'loading...',
      color: '#3f51b5',
      textColor: '#000',
      maskColor: 'rgba(255, 255, 255, 0.7)',
      zlevel: 10,
    })
    if (window.dviIterationList?.length) {
      let result = window.dviIterationList.findIndex(item => {
        return item.iteration == iteration
      })
      if (result !== -1) {
        window.dviData = window.dviIterationList[result].data
        this.renderChart(this.isHiddingBg, callback)
        return
      }
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    fetch("http://localhost:5001/updateProjection", {
      method: 'POST',
      body: JSON.stringify({
        "path": "/Users/zhangyifan/Downloads/toy_model/resnet18_cifar10", "iteration": iteration,
        "resolution": resolution, "predicates": predicates
      }),
      headers: headers,
      mode: 'cors'
    }).then(response => response.json()).then((data: any) => {
      data.iteration = iteration
      window.dviData = data
      if (!window.dviIterationList) {
        window.dviIterationList = []
      }
      window.dviIterationList.push({
        iteration: iteration,
        data: data
      })
      this.result = data.result;
      this.resLenght = data.result.length

      this.grid_index = data.grid_index;
      this.grid_color = data.grid_color;
      this.label_list = data.label_list
      this.label_color_list = data.label_color_list

      window.dviData.coverBackground = data.grid_index.concat(data.result)
      window.dviData.coverBackgroundColor = data.grid_color.concat(data.label_color_list)
      this.renderChart(this.isHiddingBg, callback)
    })
  }
  queryByCondition(params: any, fileName: string, searchContent: string, confidenceFrom: number, confidenceTo: number, callback: Function) {
    if (params?.chart) {
      this.myDemo = params.chart
    }
    let headers = new Headers();
    let predicates: any = {}
    predicates[fileName] = searchContent
    predicates.confidence = [confidenceFrom, confidenceTo]
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    fetch(`http://localhost:5001/query`, {
      method: 'POST',
      body: JSON.stringify({
        "predicates": predicates,
        "content_path": '/Users/zhangyifan/Downloads/toy_model/resnet18_cifar10',
        "iteration": window.dviData?.iteration || 1
      }),
      headers: headers,
      mode: 'cors'
    }).then(response => response.json()).then(data => {
      console.log('query', data.selectedPoints)
      window.selectedPoints = data.selectedPoints
      callback()
      // this.inspectorPanel.filteredPoints = indices;
    }).catch(error => {
      // this.formPointByTriangle(window.selectedPoints)
      console.log('err123')
      callback()
    });
  }

  renderChart(withoutBg?: boolean, callback?: Function) {
    let data: any, colorList: any
    if (withoutBg == true) {
      data = window.dviData.result
      colorList = window.dviData.label_color_list
    } else {
      data = window.dviData.coverBackground
      colorList = window.dviData.coverBackgroundColor
    }
    let _this = this
    this.myDemo.setOption({
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
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
          if (withoutBg == true) {
            return window.dviData.label_list[params.dataIndex]
          } else {
            if (params.dataIndex > window.dviData.result.length - 1) {
              let index = params.dataIndex - window.dviData.grid_index.length
              let label = window.dviData.label_list[index] as any
              return label
            } else {
              return 'background'
            }
          }
        }
      },

      series: [
        {
          symbolSize: 5,
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
    if (callback) {
      callback()
    }
  }

  hiddenBgClicked(e: any) {
    console.log(e)
    console.log(e.target.classList.contains('actived'))
    if (e.currentTarget.classList.contains('actived') == true) {
      e.currentTarget.classList.remove('actived')
      this.renderChart(false)
      this.isHiddingBg = false
    } else {
      e.currentTarget.classList.add('actived')
      this.renderChart(true)
      this.isHiddingBg = true
    }
  }
  handdleTriangle(e: any) {
    if (e.currentTarget.classList.contains('actived') == true) {
      e.currentTarget.classList.remove('actived')
      this.renderChart(this.isHiddingBg)
    } else {
      e.currentTarget.classList.add('actived')
      this.formPointByTriangle()
    }
  }

  formPointByTriangle(params?: any) {
    if (params?.chart) {
      this.myDemo = params.chart
    }
    if (this.myDemo) {
      this.myDemo = null
    }
    this.myDemo = echart.init(document.getElementById('echarts') as HTMLDivElement)
    let selections = window.selectedPoints
    let data = window.dviData.result
    let colorList = window.dviData.label_color_list
    this.myDemo.setOption({
      xAxis: { type: 'value' },
      yAxis: { type: 'value' },
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
          let label = window.dviData.label_list[params.dataIndex] as any
          return label
        }
      },

      series: [
        {
          symbolSize: (e: any, params: any) => {
            if (selections?.length) {
              if (selections.indexOf(params.dataIndex) !== -1) {
                return 10
              } else {
                return 5
              }
            } else {
              if (params.dataIndex < 5000) {
                return 10
              } else {
                return 5
              }
            }
          },
          symbol: (e: any, params: any) => {
            if (selections?.length) {
              if (selections.indexOf(params.dataIndex) !== -1) {
                return 'triangle'
              } else {
                return 'cricle'
              }
            } else {
              if (params.dataIndex < 5000) {
                return 'triangle'
              } else {
                return 'cricle'
              }
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
