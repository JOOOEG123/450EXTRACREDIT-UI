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
  subData: Subscription;
  private getData(path = '') {
    const baseUrl = 'http://localhost:8080';
    const url = `${baseUrl}${path}`;
    return this.http.get(url);
  }
  subscribe: Subscription[] = [];
  allKeys = ['title', 'type', 'summary', 'year', 'author', 'publicationid'];
  constructor(private http: HttpClient, private formbuilder: FormBuilder) {}
  title = 'APP450';
  formControls = this.formbuilder.group({
    title: '',
    search: '',
    type: '',
    summary: '',
    year: '',
    id: '',
  });
  ispub = true;
  allIds = [];
  ngOnInit(): void {
    this.searchFilter();
    this.subscribe.push(
      this.formControls.get('search').valueChanges.subscribe((value) => {
        this.viewItem = this.publish.filter((item) => {
          return this.allKeys.some((key) => {
            return item[key]?.toLowerCase()?.includes(value?.toLowerCase());
          });
        });
      })
    );
    this.subscribe.push(
      this.formControls.get('id').valueChanges.subscribe((value) => {
        if (!value) {
          this.searchFilter();
        } else {
          this.getById(value);
        }
      })
    );
  }
  getById(id: any) {
    let url = `/paper${this.ispub ? '' : '/author'}/${id}`;
    this.getData(url).subscribe((data) => {
      console.log(data);
      this.viewItem = [data];
    });
  }
  searchFilter() {
    this.subData?.unsubscribe();
    this.subData = this.getData().subscribe((data: any[]) => {
      console.log(this.allIds);
      this.publish = data;
      this.viewItem = clone(data);
      console.log(data);
      this.allIds = [];
      data.forEach((o) => {
        if (!this.allIds.includes(o.publicationid)) {
          this.allIds.push(o.publicationid);
        }
      });
    });
  }
  switchSearch() {
    if (this.ispub) {
      this.searchFilter();
    } else {
      this.getData('/paper/author').subscribe((data) => {
        this.publish = clone(data);
        this.viewItem = clone(data);
      });
    }
    this.formControls.reset();
  }
}
