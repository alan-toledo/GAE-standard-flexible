import { Component, OnInit } from '@angular/core';
import { FilesService } from '../files.service';
import { File } from '../models/file';
import { Observable} from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {
    files: File[] = [];
    dict: any = {}
    index: number = 0;
    pageSize: number = 5;
    loading: boolean = false;
	error: string = null;
    count$: Observable<number>;

    constructor(private fileService: FilesService) {
    }

    ngOnInit() {
		this.getRecentFiles(false);
    }

    //Return stats from filename. Request to the service back-end
    viewFile(file: File){
        this.dict = {}
        this.loading = true;
		this.error = null;
        this.fileService.processFile(file.url.split('/').pop()).subscribe(
			(res) => {
                //Res is a dictionary object from python
                this.dict = res;
                this.loading = false;
			},(err) => {
                console.log(err);
                this.error = "Failed to get stats file.";
                this.loading = false;
		});
    }

    //Convert keys to array
    keys() : Array<string> {
        return Object.keys(this.dict);
	}
    
    getRecentFiles(step){
        this.dict = {}
		this.loading = true;
		this.error = null;
		//asynchronous: subscription to get files in fileService
		this.fileService.getFiles(step).subscribe(
			(res) => {
                if(step){this.index = this.index + this.pageSize}
                if(!step){this.index = 0}
				this.files = res;
                this.loading = false;
			},(err) => {
				console.log('getFiles', 'Error', err);
				this.error = "Failed to get recent files.";
                this.loading = false;
		});
    }
}
