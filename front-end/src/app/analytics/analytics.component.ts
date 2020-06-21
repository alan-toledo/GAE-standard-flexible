import { Component, OnInit } from '@angular/core';
import { FilesService } from '../files.service';
import { File } from '../models/file';

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
    constructor(private fileService: FilesService) { }

    ngOnInit() {
		this.getRecentFiles(false);
    }

    viewFile(file: File){
        this.dict = {}
        this.loading = true;
		this.error = null;
        this.fileService.processFile(file.url.split('/').pop()).subscribe(
			(res) => {
                this.dict = res;
                this.loading = false;
			},(err) => {
                console.log(err);
                this.error = "Failed to get stats file.";
                this.loading = false;
		});
    }

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
