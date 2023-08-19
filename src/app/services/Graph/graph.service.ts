import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  
  public valueChange: EventEmitter<number> = new EventEmitter();
  public BarData: EventEmitter<number> = new EventEmitter();

  constructor() { }

  emitValueChangeEvent(gaugedata: number) {
    this.valueChange.emit(gaugedata);
  }
  
  getValueChangeEmitter() {
    return this.valueChange;
  }

  emitBarDataEvent(bardata: number) {
    this.BarData.emit(bardata);
  }
  
  getBarDataEmitter() {
    return this.BarData;
  }



}
