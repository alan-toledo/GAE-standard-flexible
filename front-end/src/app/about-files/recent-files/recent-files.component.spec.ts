import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentFilesComponent } from './recent-files.component';

describe('RecentFilesComponent', () => {
  let component: RecentFilesComponent;
  let fixture: ComponentFixture<RecentFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
