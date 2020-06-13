import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FilesService} from '../../files.service';

@Component({
	selector: 'app-load-file',
	templateUrl: './load-file.component.html',
	styleUrls: ['./load-file.component.css']
})


export class LoadFileComponent implements OnInit {
	
	form: FormGroup;
	uploading: boolean = false;
	success: string = null;
	error: string  = null;
	constructor(private fb: FormBuilder, private fileService: FilesService, private el: ElementRef) { }

	ngOnInit() {
		this.createForm();
	}

	createForm() {
		//Form with two fields: tag name file and filepath
		this.form = this.fb.group({name: ['', Validators.required], file: [null, Validators.required]});
	}

	onSubmit(){
		this.success = null;
		this.error = null;
		this.uploading = true;
		//Force parse HTMLInputElement, fix problem multer.single('file')
		let inputEl: HTMLInputElement =  this.el.nativeElement.querySelector('#upload');
		let fileCount: number = inputEl.files.length;
		//formData: object to multer
		let formData = new FormData();
		if (fileCount > 0) { 
			for (let i = 0; i < fileCount; i++) {
				formData.append('file', inputEl.files.item(i));
				formData.append('name', this.form.value['name']);
			}
		}
		//asynchronous: subscription to uploadFile in fileService
        this.fileService.uploadFile(formData).subscribe(
			(res) => {
				console.log('onSubmit', 'Success', res);
                this.uploading = false;
                //Send message to Subject (Listener to changes)
				this.fileService.sendMessage("File Upload Success.");
				this.success = "File Upload Success.";
			},(err) => {
				console.log('onSubmit', 'Error', err);
				this.uploading = false;
				this.error = "Error File Upload.";
		});
	}
}