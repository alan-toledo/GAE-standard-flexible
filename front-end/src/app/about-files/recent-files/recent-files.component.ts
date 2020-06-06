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

	loading: boolean = false;
	success: string = null;
	error: string = null;
	files: File[] = [];
	subscription: Subscription;
	currentFile: File = null;
	form: FormGroup;
	constructor(private fileService: FilesService, private fb: FormBuilder) { 
		// Subscribe to load-file-component
        this.subscription = this.fileService.subject.subscribe(message => {
			this.getRecentFiles();
		});
	}

	ngOnInit() {
		this.getRecentFiles();
	}

	createForm(value: string) {
		this.form = this.fb.group({name: [value, Validators.required]});
	}

	getRecentFiles(){
		this.loading = true;
		this.error = null;
		this.fileService.getFiles().subscribe(
			(res) => {
				this.files = res;
				this.loading = false;
			},(err) => {
				console.log('getFiles', 'Error', err);
				this.error = "Failed to get recent files.";
				this.loading = false;
		});
	}

	setCurrentFile(file){
		this.currentFile = file;
		this.createForm(this.currentFile.name);
	}

	edit(file: File){
		this.error = null;
		this.success = null;
		file.busy = true;
		let temportalObj = JSON.parse(JSON.stringify(file));
		temportalObj['name'] = this.form.value['name'];
		this.fileService.editFile(temportalObj).subscribe(
			(res) => {
				file.busy = false;
				let index = this.files.map(function(obj) { return obj.id; }).indexOf(file.id);
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
		this.fileService.removeFile(file).subscribe(
			(res) => {
				file.busy = false;
				this.files = this.files.filter(f => f.id != file.id);
				this.success ="Successfully removed File with Id: " + file.id;
			},(err) => {
				console.log('Remove', 'Error', err);
				file.busy = false;
				this.error = "Failed to remove File with Id: " + file.id;
		});
	}
}
