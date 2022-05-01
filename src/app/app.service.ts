import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http'
import { catchError, Observable,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private http:any;
  constructor(private Http: HttpClient) {
    this.http = Http
  }
  // get方法
  public get(url: string, options?: Object, params?: any): Observable<{}> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key in params) {
        if (params[key] === false || params[key]) {
          httpParams = httpParams.set(key, params[key]);
        }
      }
    }
    return this.http.get(url, { headers: options, params: httpParams }).pipe(catchError(this.handleError));
  }
   // post方法
   public post(url: string, body: any = null, options?: Object): Observable<{}> {
    return this.http.post(url, body, options).pipe(catchError(this.handleError));
  }

  /**
   * 处理请求失败的错误
   * @param error HttpErrorResponse
   */
   private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    console.log(error);
    return throwError(error.error);
  }
}
