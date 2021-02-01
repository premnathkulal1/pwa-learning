import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryListService {

  apiBaseUrl = 'https://api.jsonbin.io/b/6014039eef99c57c734b83ad/11';
  constructor(private httpClient: HttpClient) { }

  getCountryList = (): Observable<any[]> => {
    const url = `${this.apiBaseUrl}`;
    return this.httpClient.get<any[]>(url)
      .pipe(
        retry(3)
      );
  }
}
