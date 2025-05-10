import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestButtonComponent } from './test-button.component';

describe('TestButtonComponent', () => {
  let component: TestButtonComponent;
  let fixture: ComponentFixture<TestButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestButtonComponent]
    });
    fixture = TestBed.createComponent(TestButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
