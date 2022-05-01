import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaDataContainerComponent } from './meta-data-container.component';

describe('MetaDataContainerComponent', () => {
  let component: MetaDataContainerComponent;
  let fixture: ComponentFixture<MetaDataContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaDataContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaDataContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
