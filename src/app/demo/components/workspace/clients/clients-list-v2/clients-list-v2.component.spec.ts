import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsListV2Component } from './clients-list-v2.component';

describe('ClientsListV2Component', () => {
  let component: ClientsListV2Component;
  let fixture: ComponentFixture<ClientsListV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientsListV2Component]
    });
    fixture = TestBed.createComponent(ClientsListV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
