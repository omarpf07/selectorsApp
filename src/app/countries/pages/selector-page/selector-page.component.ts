import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { CountrySmall } from '../../interfaces/countries.interface';
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {

  countriesForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required]
  });

  // Used to fill selectors
  public regions: string[] = [];
  public countries: CountrySmall[] = [];
  public borders: CountrySmall[] = [];

  public appIsLoading: boolean = false;


  constructor(private fb: FormBuilder, private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions;
    this.getCountriesByRegionInput();
    this.getBordersByCountryInput();
  }

  getCountriesByRegionInput() {
    this.countriesForm.get('region')?.valueChanges.pipe(
      tap(_ => {
        this.countriesForm.get('country')?.reset('');
        this.renderLoadingAlert(true)
      }),
      switchMap(region =>
        this.countriesService.getCountriesByRegion(region))).subscribe(countries => {
          this.countries = countries;
          this.renderLoadingAlert(false);
        });
  }

  getBordersByCountryInput(){
    this.countriesForm.get('country')?.valueChanges.pipe(tap(_ => {
      this.borders = [];
      this.countriesForm.get('border')?.reset('');
      this.renderLoadingAlert(true)

    }),
      switchMap( countryAlphaCode => this.countriesService.getCountryByAlphaCode(countryAlphaCode)),
      switchMap(country => this.countriesService.getCountriesByBorders(country?.borders!))
    ).subscribe(countries => {
      this.renderLoadingAlert(false);
      this.borders = countries;
    },(error) => console.error(error), () => this.renderLoadingAlert(false));
  }

  renderLoadingAlert(isLoading: boolean) {
    this.appIsLoading = isLoading;
  }


  saveForm() {
    console.log(this.countriesForm.value);
  }

}
