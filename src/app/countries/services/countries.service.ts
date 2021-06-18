import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country, CountrySmall } from '../interfaces/countries.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _baseUrl: string = 'https://restcountries.eu/rest/v2'
  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions() {
    return [...this._regions];
  }

  constructor(private http: HttpClient) { }

  getCountriesByRegion(region: string): Observable<CountrySmall[]>{
    const url:string = `${this._baseUrl}/region/${region}?fields=alpha3Code;name`;
    return this.http.get<CountrySmall[]>(url);
  }


  getCountryByAlphaCode(code: string): Observable<Country | null> {
    if(!code) {
      return of(null)
    }
    const url = `${this._baseUrl}/alpha/${code}`;
    return this.http.get<Country>(url)
  }

  getCountryNameByAlphaCode(code: string): Observable<CountrySmall> {
    const url = `${this._baseUrl}/alpha/${code}`;
    return this.http.get<CountrySmall>(url)
  }

  getCountriesByBorders(borders: string[]): Observable<CountrySmall[]>{
    if(!borders) {
      return of([])
    }

    const requests: Observable<CountrySmall>[] = [];

    borders.forEach(alpha3Code => {
      const request = this.getCountryNameByAlphaCode(alpha3Code);
      requests.push(request);
    })

    return combineLatest(requests);
  }

}
