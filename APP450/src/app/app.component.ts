import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

const clone = (o) => JSON.parse(JSON.stringify(o));
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  publish: any[] = [];
  viewItem: any[];
  private getData(path = '') {
    const baseUrl = 'http://localhost:8080';
    const url = `${baseUrl}${path}`;
    return this.http.get(url);
  }
  subscribe: Subscription[] = [];
  allKeys = ['title', 'type', 'summary', 'year'];
  constructor(private http: HttpClient, private formbuilder: FormBuilder) {}
  title = 'APP450';
  formControls = this.formbuilder.group({
    title: '',
    search: '',
    type: '',
    summary: '',
    year: '',
  });
  ngOnInit(): void {
    this.getData().subscribe((data: any[]) => {
      console.log(data);
      this.publish = data;
      this.viewItem = clone(data);
    });
    this.subscribe.push(
      this.formControls.get('search').valueChanges.subscribe((value) => {
        this.viewItem = this.publish.filter((item) => {
          return this.allKeys.some((key) => {
            return item[key].toLowerCase().includes(value.toLowerCase());
          });
        });
      })
    );
  }
}
