import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
 // @ts-ignore 
private renderSubject: BehaviorSubject<any> = new BehaviorSubject<string>(null);

public getSubject(): Observable<any> {
return this.renderSubject;
}

public emitInfo(msg: any): void {
if (msg) {
this.renderSubject.next(msg)
	}
}

constructor() {}
}
