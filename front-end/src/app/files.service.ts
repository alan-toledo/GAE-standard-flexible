import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { File } from './models/file';



@Injectable({
	providedIn: 'root'
})

export class FilesService {

	subject = new Subject<any>();

	constructor(private http: HttpClient) {}

	sendMessage(message: string) {
        this.subject.next({ text: message });
	}
	
	getMessage(): Observable<any> {
        return this.subject.asObservable();
	}
    
    //POST: Insert register in Datastore
	uploadFile(formData: FormData): Observable<any>{
		return this.http.post('/api/upload', formData, {responseType: 'text'}).pipe(
			map((message: any) => {
				return message;
			}), catchError( error => {
				return throwError(error);
			})
		 )
	}
    //GET: Get registers from Datastore
	getFiles(): Observable<any>{
		return this.http.get('/api/files').pipe(
			map((message: any) => {
				return message.map(obj => {
					return new File(obj.id, obj.name, obj.url, obj.last_modified);
				})
			}), catchError( error => {
				return throwError(error);
			})
		 )
	}
    //PUT: Update register in Datastore
	editFile(file: File): Observable<any>{
		return this.http.put('/api/update/' + file.id, file).pipe(
			map((message: any) => {
				return message;
			}), catchError( error => {
				return throwError(error);
			})
		 )
	}
	//DELETE: Remove register in DataStore
	removeFile(file: File): Observable<any>{
		let filename = file.url.split('/').pop()
		return this.http.delete('/api/remove/' + file.id + '/' + filename).pipe(
			map((message: any) => {
				return message.fileId;
			}), catchError( error => {
				return throwError(error);
			})
		 )
	}
}

