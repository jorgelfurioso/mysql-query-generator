import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryGeneratorComponent } from './query-generator.component';

describe('QueryGeneratorComponent', () => {
  let component: QueryGeneratorComponent;
  let fixture: ComponentFixture<QueryGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryGeneratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
