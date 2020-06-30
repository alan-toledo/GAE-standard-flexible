import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadFileComponent } from './load-file.component';
import { HttpClientTestingModule} from '@angular/common/http/testing';

describe('LoadFileComponent', () => {
  let component: LoadFileComponent;
  let fixture: ComponentFixture<LoadFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadFileComponent ],
      imports: [ReactiveFormsModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Test upload file`, async(() => {
    (<HTMLInputElement>document.getElementById('name')).value = 'TEST_NAME';
  }));
});
