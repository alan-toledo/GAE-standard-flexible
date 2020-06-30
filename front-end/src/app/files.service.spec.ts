import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { FilesService } from './files.service';
import { Observable} from 'rxjs';
import { of } from 'rxjs';

let httpClientSpy: { get: jasmine.Spy };
let fileservice: FilesService;

export function asyncData<T>(data: T) {
    return (() => Promise.resolve(data));
}

describe('FilesService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        })
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        fileservice = new FilesService(<any> httpClientSpy);
    });

  it('should be created', () => {
    const service: FilesService = TestBed.get(FilesService);
    expect(service).toBeTruthy();
  });

});
