import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http'
import * as echart from 'echarts';

@Component({
  selector: 'app-scatter-plot-visualizer',
  templateUrl: './scatter-plot-visualizer.component.html',
  styleUrls: ['./scatter-plot-visualizer.component.less']
})
export class ScatterPlotVisualizerComponent implements OnInit {

  constructor(private httpClinet: HttpClient) { }
  ngOnInit(): void {
    const myDemo = echart.init(document.getElementById('echarts') as HTMLDivElement)
    myDemo.showLoading()
    let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
    fetch("http://localhost:5001/updateProjection", {
      method: 'POST',
      body: JSON.stringify({"path": "/Users/zhangyifan/Downloads/toy_model/resnet18_cifar10",  "iteration":1,
            "resolution":400, "predicates":{}}),
      headers: headers,
      mode: 'cors'
    }).then(response => response.json()).then((data:any) => {
        console.log('rees',data)
        const result = data.result;
        const grid_index = data.grid_index;
        const grid_color = data.grid_color;
        const label_list = data.label_list
        const label_color_list = data.label_color_list

        const coverBackground = grid_index.concat(result)
        const coverBackgroundColor = grid_color.concat(label_color_list)
        let pieces = []
        for(var i=0;i<result.lenght;i++){
            
        }
        myDemo.setOption({
          xAxis: {},
          yAxis: {},
          tooltip: {
          confine: true,
           formatter:function(params:any,tick:any,callback:any){
             if(params.dataIndex <=label_list.length-1){
              return label_list[params.dataIndex]
             } else{
               return 'background'
             }
           }
          },
          series: [
            {
              symbolSize: 2,
              itemStyle:{
                color:(e:any)=>{
                  let color = `rgb(${coverBackgroundColor[e.dataIndex][0]},${coverBackgroundColor[e.dataIndex][1]},${coverBackgroundColor[e.dataIndex][2]})`
                  return color
                }
              },
              data: coverBackground,
              type: 'scatter'
            }
          ]
        })
        myDemo.hideLoading()
    })
  }

  renderChart(){
    
  }


}
