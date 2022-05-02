import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterPlotVisualizerComponent } from './scatter-plot-visualizer.component';

describe('ScatterPlotVisualizerComponent', () => {
  let component: ScatterPlotVisualizerComponent;
  let fixture: ComponentFixture<ScatterPlotVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScatterPlotVisualizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterPlotVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
