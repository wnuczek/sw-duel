import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import {
	BehaviorSubject,
	Observable,
	Subscription,
	catchError,
	map,
	mergeMap,
} from 'rxjs';
import {
	SwapiDuelData,
	SwapiResource,
	SwapiResourceName,
	SwapiResponse,
	SwapiResult,
	isSwapiPerson,
	isSwapiStarship,
} from './model';

export type DuelState = {
	duelsCount: number;
	playerOneWins: number;
	playerTwoWins: number;
	duelsResults: [boolean, boolean] | undefined;
	duelsData: SwapiDuelData<SwapiResource>;
};

const initialState: DuelState = {
	duelsCount: 0,
	playerOneWins: 0,
	playerTwoWins: 0,
	duelsResults: undefined,
	duelsData: [undefined, undefined],
};

const PEOPLE_MAX_ID = 83;
const STARSHIP_MAX_ID = 15;
const RESET_ON_RESOURCE_CHANGE = false;

@Injectable({
	providedIn: 'root',
})
export class SwapiService implements OnDestroy {
	private http = inject(HttpClient);
	apiUrl = 'https://www.swapi.tech/api';

	resultSubscription: Subscription | undefined;

	private _duelState: BehaviorSubject<DuelState> = new BehaviorSubject(
		initialState,
	);
	duelState$ = this._duelState.asObservable();

	private _duelLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
	duelLoading$ = this._duelLoading.asObservable();

	private _selectedResource: BehaviorSubject<SwapiResourceName> =
		new BehaviorSubject('people' as SwapiResourceName);
	selectedResource$ = this._selectedResource.asObservable();

	ngOnDestroy(): void {
		this.resultSubscription?.unsubscribe();
	}

	duel() {
		this._duelLoading.next(true);
		const res1$ = this.getSwapiResponse(this._selectedResource.value);
		const res2$ = this.getSwapiResponse(this._selectedResource.value);

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

	selectedResource(resource: SwapiResourceName) {
		this._selectedResource.next(resource);
		if (RESET_ON_RESOURCE_CHANGE) this._duelState.next(initialState);
	}

	compareResources(
		resources: SwapiDuelData<SwapiResource>,
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
		resource: SwapiResourceName,
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
				// retry(3),
			);
	}
}
