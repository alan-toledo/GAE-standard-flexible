import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { FilesService } from '../../files.service';
import { File } from '../../models/file';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recent-files',
  templateUrl: './recent-files.component.html',
  styleUrls: ['./recent-files.component.css']
})


export class RecentFilesComponent implements OnInit {

    index: number = 0;
    pageSize: number = 5;
    loading: boolean = false;
	success: string = null;
	error: string = null;
	files: File[] = [];
	subscription: Subscription;
	currentFile: File = null;
	form: FormGroup;
	constructor(private fileService: FilesService, private fb: FormBuilder) { 
		// Subscription to load-file-component
		//If a new file is uploaded, a new resquest it is done.
        this.subscription = this.fileService.subject.subscribe(message => {
			this.getRecentFiles(false);
		});
	}

	ngOnInit() {
		this.getRecentFiles(false);
	}

	createForm(value: string) {
		//Form with one field: tag name file
		this.form = this.fb.group({name: [value, Validators.required]});
	}

	getRecentFiles(step){
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
    
	setCurrentFile(file){
		//Se current file to edit (modal)
		this.currentFile = file;
		this.createForm(this.currentFile.name);
	}

	edit(file: File){
		this.error = null;
		this.success = null;
		//Se to busy
		file.busy = true;
		let temportalObj = JSON.parse(JSON.stringify(file)); //Without Angular reference
		//Only tag name is edited
		temportalObj['name'] = this.form.value['name'];
		//asynchronous: subscription to edit file in fileService
		this.fileService.editFile(temportalObj).subscribe(
			(res) => {
				file.busy = false;
				//If the edit is successful (DataStore), according its index the object file is updated in memory
				let index = this.files.map(function(obj) { return obj.id; }).indexOf(file.id);
				//Name and Last Modified
				this.files[index].name = res.name;
				this.files[index].last_modified = res.last_modified;
				this.success ="Successfully editing File with Id: " + file.id;
			},(err) => {
				console.log('Edit', 'Error', err);
				file.busy = false;
				this.error = "Failed to edit File with Id: " + file.id;
		});
	}

	remove(file: File){
		this.error = null;
		this.success = null;
		file.busy = true;
		//asynchronous: subscription to remove file in fileService
		this.fileService.removeFile(file).subscribe(
			(res) => {
				file.busy = false;
				//If the remove is successful (DataStore), according its file.id the object file is removed
				this.files = this.files.filter(f => f.id != file.id);
				this.success ="Successfully removed File with Id: " + file.id;
			},(err) => {
				console.log('Remove', 'Error', err);
				file.busy = false;
				this.error = "Failed to remove File with Id: " + file.id;
		});
	}
}
