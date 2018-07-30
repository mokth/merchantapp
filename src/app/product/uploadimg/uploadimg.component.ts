import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-uploadimg',
  templateUrl: './uploadimg.component.html',
  styleUrls: ['./uploadimg.component.css']
})
export class UploadimgComponent implements OnInit {

  fileToUpload: File = null;
  constructor(private httpClient: HttpClient,
    @Inject('API_URL') private apiUrl: string) { }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  OnUploadFIle() {
    this.postFile(this.fileToUpload)
      .subscribe(resp => {
        console.log(resp);
      });
  }

  postFile(fileToUpload: File) {
    const endpoint = this.apiUrl + "api/prod/upload";
    const formData: FormData = new FormData();
    const myheaders = new HttpHeaders().append('Content-Type', 'multipart/form-data');
    formData.append('fileKey', fileToUpload, fileToUpload.name);
     console.log(fileToUpload);
    return this.httpClient
      .post(endpoint, formData);

  }
}
