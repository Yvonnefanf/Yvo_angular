import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-meta-data-container',
  templateUrl: './meta-data-container.component.html',
  styleUrls: ['./meta-data-container.component.less']
})
export class MetaDataContainerComponent implements OnInit {

  constructor(private http:AppService) { }
  public testGet(url:string, successCallback:Function, failCallBack:Function){
    const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type': 'application/json; charset=UTF-8'
      })
    }
    this.http.get(url, httpOptions.headers).subscribe((res:any)=>{
      successCallback(res);
    }, (err:HttpErrorResponse) => {
      failCallBack(err)
    })
  }

  ngOnInit(): void {
    this.testGet('https://gist.githubusercontent.com/hzf1174/3a7e85af7d09ebdfafac3d4d3ba5e71f/raw/502ad8aedc40fab7e56db917c57b48eaf0bd28fa/metadata.csv',(res:any)=>{
      console.log('success',parseMetadata(res))
    },()=>{

    })
  }
}
const NUM_COLORS_COLOR_MAP = 50;
export interface PointMetadata {
  [key: string]: number | string;
}

export interface ColumnStats {
  name: string;
  isNumeric: boolean;
  tooManyUniqueValues: boolean;
  uniqueEntries?: Array<{
    label: string;
    count: number;
  }>;
  min: number;
  max: number;
}
export interface SpriteMetadata {
  imagePath: string;
  singleImageDim: [number, number];
}

export interface SpriteAndMetadataInfo {
  stats?: ColumnStats[];
  pointsInfo?: PointMetadata[];
  spriteImage?: HTMLImageElement;
  spriteMetadata?: SpriteMetadata;
}

export function parseMetadata(
  content: ArrayBuffer
): Promise<SpriteAndMetadataInfo> {
  return new Promise<SpriteAndMetadataInfo>((resolve, reject) => {
    let pointsMetadata: PointMetadata[] = [];
    let hasHeader = false;
    let lineNumber = 0;
    let columnNames = ['label'];
    streamParse(content, (line: string) => {
      if (line.trim().length === 0) {
        return;
      }
      if (lineNumber === 0) {
        hasHeader = line.indexOf('\t') >= 0;
        // If the first row doesn't contain metadata keys, we assume that the
        // values are labels.
        if (hasHeader) {
          columnNames = line.split('\t');
          lineNumber++;
          return;
        }
      }
      lineNumber++;
      let rowValues = line.split('\t');
      let metadata: PointMetadata = {};
      pointsMetadata.push(metadata);
      columnNames.forEach((name: string, colIndex: number) => {
        let value:any = rowValues[colIndex];
        // Normalize missing values.
        value = value === '' ? null : value;
        metadata[name] = value;
      });
    }).then(() => {
      //logging.setModalMessage(null, METADATA_MSG_ID);
      resolve({
        stats: analyzeMetadata(columnNames, pointsMetadata),
        pointsInfo: pointsMetadata,
      });
    });
  });
}
export function analyzeMetadata(
  columnNames:any,
  pointsMetadata: PointMetadata[]
): ColumnStats[] {
  const columnStats: ColumnStats[] = columnNames.map((name:any) => {
    return {
      name: name,
      isNumeric: true,
      tooManyUniqueValues: false,
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY,
    };
  });
  const mapOfValues: [
    {
      [value: string]: number;
    }
  ] = columnNames.map(() => new Object());
  pointsMetadata.forEach((metadata) => {
    columnNames.forEach((name: string, colIndex: number) => {
      const stats = columnStats[colIndex];
      const map = mapOfValues[colIndex];
      const value = metadata[name];
      // Skip missing values.
      if (value == null) {
        return;
      }
      if (!stats.tooManyUniqueValues) {
        if (value in map) {
          map[value]++;
        } else {
          map[value] = 1;
        }
        if (Object.keys(map).length > NUM_COLORS_COLOR_MAP) {
          stats.tooManyUniqueValues = true;
        }
      }
      if (isNaN(value as any)) {
        stats.isNumeric = false;
      } else {
        metadata[name] = +value;
        stats.min = Math.min(stats.min, +value);
        stats.max = Math.max(stats.max, +value);
      }
    });
  });
  columnStats.forEach((stats, colIndex) => {
    stats.uniqueEntries = Object.keys(mapOfValues[colIndex]).map((label) => {
      return {label, count: mapOfValues[colIndex][label]};
    });
  });
  return columnStats;
}

function streamParse(
  content: ArrayBuffer,
  callback: (line: string) => void,
  chunkSize = 1000000,
  delim = '\n'
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let offset = 0;
    let bufferSize = content.byteLength - 1;
    let data = '';
    function readHandler(str:string) {
      offset += chunkSize;
      let parts = str.split(delim);
      let first = data + parts[0];
      if (parts.length === 1) {
        data = first;
        readChunk(offset, chunkSize);
        return;
      }
      data = parts[parts.length - 1];
      callback(first);
      for (let i = 1; i < parts.length - 1; i++) {
        callback(parts[i]);
      }
      if (offset >= bufferSize) {
        if (data) {
          callback(data);
        }
        resolve();
        return;
      }
      readChunk(offset, chunkSize);
    }
    function readChunk(offset: number, size: number) {
      const contentChunk = content.slice(offset, offset + size);
      const blob = new Blob([contentChunk]);
      const file = new FileReader();
      file.onload = (e: any) => readHandler(e.target.result);
      file.readAsText(blob);
    }
    readChunk(offset, chunkSize);
  });
}
