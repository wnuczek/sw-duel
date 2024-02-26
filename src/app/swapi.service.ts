import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  catchError,
  count,
  map,
  mergeAll,
  mergeMap,
  of,
  retry,
  tap,
  zip,
} from 'rxjs';
import {
  SwapiPerson,
  SwapiResponse,
  SwapiResult,
  SwapiStarship,
  isSwapiPerson,
  isSwapiStarship,
} from './model';

export type SwapiRequestResult<T> = SwapiResult<T> | undefined;

export type SwapiDuelResult<T> = [SwapiRequestResult<T>, SwapiRequestResult<T>];

export type SwapiResource = SwapiPerson | SwapiStarship;

export type SwapiResourceName = keyof typeof SWAPI_RESOURCES;

export type SwapiResourceNameLabel =
  (typeof SWAPI_RESOURCES)[SwapiResourceName];

export const SWAPI_RESOURCES = {
  people: 'People',
  starships: 'Starships',
} as const;

export type DuelState = {
  duelsCount: number;
  playerOneWins: number;
  playerTwoWins: number;
  duelsResults: [boolean, boolean] | [undefined, undefined];
  duelsData: SwapiDuelResult<SwapiResource>;
};
const initialDuelResult: SwapiDuelResult<SwapiResource> = [
  undefined,
  undefined,
];

const initialState: DuelState = {
  duelsCount: 0,
  playerOneWins: 0,
  playerTwoWins: 0,
  duelsResults: [undefined, undefined],
  duelsData: initialDuelResult,
};

const PEOPLE_MAX_ID = 83;
const STARSHIP_MAX_ID = 15;

@Injectable({
  providedIn: 'root',
})
export class SwapiService implements OnDestroy {
  private http = inject(HttpClient);
  apiUrl = 'https://www.swapi.tech/api';

  resultSubscription: Subscription | undefined;

  private _duelState: BehaviorSubject<DuelState> = new BehaviorSubject(
    initialState
  );
  duelState$ = this._duelState.asObservable();

  private _duelLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  duelLoading$ = this._duelLoading.asObservable();

  ngOnDestroy(): void {
    this.resultSubscription?.unsubscribe();
  }

  duel(resource: SwapiResourceName) {
    this._duelLoading.next(true);
    const res1$ = this.getSwapiResponse(resource);
    const res2$ = this.getSwapiResponse(resource);

    this.resultSubscription = res1$
      .pipe(mergeMap((res1) => res2$.pipe(map((res2) => [res1, res2]))))
      .subscribe(([res1, res2]) => {
        const duelResult = this.compareResources([res1, res2]);

        const currentState = this._duelState.value;
        const newState: DuelState = {
          duelsCount: currentState.duelsCount + 1,
          duelsResults: duelResult,
          duelsData: [res1, res2],
          playerOneWins:
            currentState.playerOneWins + (duelResult[0] === true ? 1 : 0),
          playerTwoWins:
            currentState.playerTwoWins + (duelResult[1] === true ? 1 : 0),
        };

        this._duelLoading.next(false);
        this._duelState.next(newState);
      });
  }

  compareResources(
    resources: SwapiDuelResult<SwapiResource>
  ): [boolean, boolean] {
    if (!resources[0] || !resources[1]) {
      // error
      return [false, false];
    }
    const props1 = resources[0].properties;
    const props2 = resources[1].properties;

    if (isSwapiPerson(props1) && isSwapiPerson(props2)) {
      // compare people
      return this.compareResourceProps(props1.mass, props2.mass);
    }
    if (isSwapiStarship(props1) && isSwapiStarship(props2)) {
      // compare starships
      return this.compareResourceProps(props1.crew, props2.crew);
    }
    return [false, false];
  }

  compareResourceProps(prop1: string, prop2: string): [boolean, boolean] {
    const parsedProp1 = this.parseResourceProp(prop1);
    const parsedProp2 = this.parseResourceProp(prop2);

    const draw =
      parsedProp1 === parsedProp2 ||
      Number.isNaN(parsedProp1) ||
      Number.isNaN(parsedProp2);
    const p1_wins = parsedProp1 > parsedProp2;
    return draw ? [false, false] : [p1_wins, !p1_wins];
  }

  parseResourceProp(prop: string) {
    if (prop.includes('-')) {
      return parseInt(prop.split('-')[1]);
    }
    if (prop.includes(',')) {
      return parseInt(prop.replace(',', ''));
    }
    return parseInt(prop);
  }

  getSwapiResponse(
    resource: SwapiResourceName
  ): Observable<SwapiResult<SwapiResource>> {
    const peopleDuel = resource === 'people';
    const maxId = peopleDuel ? PEOPLE_MAX_ID : STARSHIP_MAX_ID;
    const id = Math.floor(Math.random() * maxId) + 1;

    const resourceUrl = peopleDuel
      ? `${this.apiUrl}/people/${id}`
      : `${this.apiUrl}/starships/${id}`;

    return this.http
      .get<SwapiResponse<SwapiResource>>(resourceUrl, {
        observe: 'response',
      })
      .pipe(
        map((res) => {
          if (res.status === 200 && res.body) {
            return res.body.result;
          }
          throw new Error();
        }),
        catchError((e) => {
          console.error(e);
          return this.getSwapiResponse(resource);
        }),
        retry(3)
      );
  }
}
