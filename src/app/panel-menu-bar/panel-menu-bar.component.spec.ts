import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelMenuBarComponent } from './panel-menu-bar.component';

describe('PanelMenuBarComponent', () => {
  let component: PanelMenuBarComponent;
  let fixture: ComponentFixture<PanelMenuBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelMenuBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelMenuBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
