import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
	SwapiPerson,
	SwapiRequestResult,
	SwapiResource,
	SwapiStarship,
} from '../model';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
	let component: CardComponent;
	let fixture: ComponentFixture<CardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	//should have mat-card element
	it('should have mat-card element', () => {
		const cards =
			fixture.debugElement.nativeElement.querySelectorAll('mat-card');
		expect(cards.length).toEqual(1);
	});

	//should have mat-card element
	it('should mat-card-subtitle element with two span children', () => {
		const subtitle =
			fixture.debugElement.nativeElement.querySelector('mat-card-subtitle');
		const spans = subtitle.children;

		expect(spans.length).toEqual(2);
		expect(spans[0].classList).toContain('player-name');
		expect(spans[1].classList).toContain('player-stats');
	});

	//should have .winner class on mat-card element when result is true
	it('should have .winner class on mat-card element when result is true', () => {
		const card = fixture.debugElement.nativeElement.querySelector('mat-card');
		component.result = true;
		fixture.detectChanges();
		expect(card.classList).toContain('winner');
	});

	//should have .loser class on mat-card element when result is false
	it('should have .loser class on mat-card element when result is false', () => {
		const card = fixture.debugElement.nativeElement.querySelector('mat-card');
		component.result = false;
		fixture.detectChanges();
		expect(card.classList).toContain('loser');
	});

	//should display player name in mat-card-subtitle
	it('should display player name in mat-card-subtitle', () => {
		const card =
			fixture.debugElement.nativeElement.querySelector('mat-card-subtitle');
		component.player = 'Player name';
		fixture.detectChanges();
		const span = card.children[0];
		expect(span.innerHTML).toEqual('Player name');
	});

	//should display wins count in mat-card-subtitle
	it('should mat-card-subtitle element with two span children', () => {
		const stats =
			fixture.debugElement.nativeElement.querySelector('.player-stats');
		component.playerWins = 3;
		fixture.detectChanges();

		expect(stats.innerHTML).toEqual('Wins: 3');
	});

	//should display resource name in mat-card-title
	it('should display name for all resources', () => {
		const title =
			fixture.debugElement.nativeElement.querySelector('mat-card-title');
		const resource = {
			properties: { name: 'Resource name' },
		} as SwapiRequestResult<SwapiResource>;
		component.resource = resource;
		fixture.detectChanges();

		expect(title.innerHTML).toEqual('Resource name');
	});

	//should display mass for "people" resource
	it('should display mass for "people" resource', () => {
		const resource = {
			properties: { name: 'Resource name', mass: '2000' },
		} as SwapiRequestResult<SwapiPerson>;
		component.resource = resource;
		fixture.detectChanges();
		const content = fixture.debugElement.nativeElement.querySelector(
			'mat-card-content > p',
		);

		expect(content.innerHTML).toEqual('Mass: 2000');
	});

	//should display crew for "starship" resource
	it('should display mass for "starship" resource', () => {
		const resource = {
			properties: { name: 'Resource name', crew: '2000' },
		} as SwapiRequestResult<SwapiStarship>;
		component.resource = resource;
		fixture.detectChanges();
		const content = fixture.debugElement.nativeElement.querySelector(
			'mat-card-content > p',
		);

		expect(content.innerHTML).toEqual('Crew: 2000');
	});

	//should display empty mat-card-content if no resource passed
	it('should display empty mat-card-content if no resource passed', () => {
		const resource = undefined;
		component.resource = resource;
		fixture.detectChanges();
		const content = fixture.debugElement.nativeElement.querySelector(
			'mat-card-content > p',
		);

		expect(content).toEqual(null);
	});

	//should display mat-progress-bar in mat-card-footer if loading is true
	it('should display mat-progress-bar in mat-card-footer if loading is true', () => {
		component.loading = true;
		fixture.detectChanges();
		const footer =
			fixture.debugElement.nativeElement.querySelector('mat-card-footer');

		const child = footer.children[0];
		expect(child.localName).toEqual('mat-progress-bar');
	});
});
