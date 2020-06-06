
export class File{
	id: number
	name: string;
	url: string;
	last_modified: Date;
	busy: boolean;
	constructor(id: number, name: string, url: string, last_modified: Date){
		this.id = id;
		this.name = name;
		this.url = url;
		this.last_modified = last_modified;
		this.busy = false;
	}
}