import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SwapiDuelResult } from '../model';
import { DuelResultComponent } from './duel-result.component';

describe('DuelResultComponent', () => {
	let component: DuelResultComponent;
	let fixture: ComponentFixture<DuelResultComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DuelResultComponent, NoopAnimationsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(DuelResultComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	//should have only one section
	it('should have only one section', () => {
		const sections =
			fixture.debugElement.nativeElement.querySelectorAll('section');
		expect(sections.length).toEqual(1);
	});

	//should have section with .results class
	it('should have results class', () => {
		const section = fixture.debugElement.nativeElement.querySelector('section');
		expect(section.classList).toContain('results');
	});

	//should have section with one span inside it
	it('should have results class', () => {
		const section = fixture.debugElement.nativeElement.querySelector('section');
		const children = section.children;
		expect(children.length).toEqual(1);
		expect(children[0].localName).toEqual('span');
	});

	//should display 'No duels played' by default
	it('should display "No duels played" by default', () => {
		const section = fixture.debugElement.nativeElement.querySelector('section');
		const span = section.children[0];
		expect(span.innerHTML).toEqual('No duels played');
	});

	//should display 'Duel in progress' with 0 opacity when loading is true
	it('should display "Duel in progress" with 0 opacity when loading is true', () => {
		const section = fixture.debugElement.nativeElement.querySelector('section');
		component.loading = true;
		fixture.detectChanges();
		const span = section.children[0];
		expect(span.innerHTML).toEqual('Duel in progress');
	});

	//should display 'No duels played'
	it('should display "No duels played"', () => {
		const section = fixture.debugElement.nativeElement.querySelector('section');
		const initialResults: SwapiDuelResult = [undefined, undefined];
		component.results = initialResults;
		fixture.detectChanges();
		const span = section.children[0];
		expect(span.innerHTML).toEqual('No duels played');
	});

	//should display 'Draw'
	it('should display "Draw"', () => {
		const section = fixture.debugElement.nativeElement.querySelector('section');
		const initialResults: SwapiDuelResult = [false, false];
		component.results = initialResults;
		fixture.detectChanges();
		const span = section.children[0];
		expect(span.innerHTML).toEqual('Draw');
	});

	//should display 'Player 1 wins'
	it('should display "Player 1 wins"', () => {
		const section = fixture.debugElement.nativeElement.querySelector('section');
		const initialResults: SwapiDuelResult = [true, false];
		component.results = initialResults;
		fixture.detectChanges();
		const span = section.children[0];
		expect(span.innerHTML).toEqual('Player 1 wins');
	});

	//should display 'Player 2 wins'
	it('should display "Player 2 wins"', () => {
		const section = fixture.debugElement.nativeElement.querySelector('section');
		const initialResults: SwapiDuelResult = [false, true];
		component.results = initialResults;
		fixture.detectChanges();
		const span = section.children[0];
		expect(span.innerHTML).toEqual('Player 2 wins');
	});
});
