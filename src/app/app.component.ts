import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from "rxjs";

interface Geonames {
  geonames: Array<Geoname>;
}

interface Geoname {
  adminCode1: string;
  lng: string;
  distance: string;
  geonameId: number;
  toponymName: string;
  countryId: string;
  fcl: string;
  population: number;
  countryCode: string;
  name: string;
  fclName: string;
  adminCodes1: {
    ISO3166_2: string;
  };
  countryName: string;
  fcodeName: string;
  adminName1: string;
  lat: string;
  fcode: string;
  temp: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  title = 'WeatherApp';
  geonames$: Observable<Geonames>;
  latitude: string;
  longitude: string;
  
  private _mobileQueryListener: () => void;

  constructor(private http: HttpClient, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  findMe() {
    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');

    mapLink.textContent = '';

    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;

      status.textContent = '';
      mapLink.textContent = `Szélesség: ${latitude} °, Hosszúság: ${longitude} °`;
    }

    function error() {
      status.textContent = 'Unable to retrieve your location';
    }

    if (!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }

    this.geonames$ = this.http
      .get<Geonames>("http://api.geonames.org/findNearbyPlaceNameJSON?lat=47.5004628&lng=19.082869&username=eggdice&radius=10");

    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
