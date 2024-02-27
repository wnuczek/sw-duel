import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { DuelState, SwapiService } from './swapi.service';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	const mockedSwapiService = jasmine.createSpyObj(
		'SwapiService',
		['duel', 'selectedResource'],
		['duelState$', 'duelLoading$'],
	);

	const initialState: DuelState = {
		duelsCount: 0,
		playerOneWins: 0,
		playerTwoWins: 0,
		duelsResults: undefined,
		duelsData: [undefined, undefined],
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent, HttpClientModule, NoopAnimationsModule],
			providers: [{ provide: SwapiService, useValue: mockedSwapiService }],
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the app', () => {
		expect(component).toBeTruthy();
	});

	it(`should have the 'sw-duel' title`, () => {
		expect(component.title).toEqual('SW Duel');
	});

	it('should render title', () => {
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('h1')?.textContent).toContain('SW Duel');
	});

	it('should have one app-resource-select component', () => {
		const resourceSelectComponentCount = fixture.nativeElement.querySelectorAll(
			'app-resource-select',
		).length;
		expect(resourceSelectComponentCount).toEqual(1);
	});

	it('should have two app-card components', () => {
		component.duelState$ = of(initialState);
		fixture.detectChanges();
		const cards = fixture.nativeElement.querySelectorAll('app-card');

		expect(cards.length).toEqual(2);
	});

	it('should not display app-card components if duelState is undefined', () => {
		const cards = fixture.nativeElement.querySelectorAll('app-card');
		expect(cards.length).toEqual(0);
	});
});
