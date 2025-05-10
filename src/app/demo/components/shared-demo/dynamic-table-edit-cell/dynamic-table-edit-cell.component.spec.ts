import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTableEditCellComponent } from './dynamic-table-edit-cell.component';

describe('DynamicTableEditCellComponent', () => {
  let component: DynamicTableEditCellComponent;
  let fixture: ComponentFixture<DynamicTableEditCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTableEditCellComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicTableEditCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
