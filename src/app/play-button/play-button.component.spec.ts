import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlayButtonComponent } from './play-button.component';

describe('PlayButtonComponent', () => {
	let component: PlayButtonComponent;
	let fixture: ComponentFixture<PlayButtonComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PlayButtonComponent, NoopAnimationsModule, HttpClientModule],
		}).compileComponents();

		fixture = TestBed.createComponent(PlayButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	//should have only one button element
	it('should have only one button element', () => {
		const buttons =
			fixture.debugElement.nativeElement.querySelectorAll('button');
		expect(buttons.length).toEqual(1);
	});

	//should have #play-button id
	it('should have #play-button id', () => {
		const button = fixture.debugElement.nativeElement.querySelector('button');
		const buttonId = button.id;
		expect(buttonId).toEqual('play-button');
	});

	//should be enabled by default
	it('should be enabled by default', () => {
		const button = fixture.debugElement.nativeElement.querySelector('button');
		const buttonDisabled = button.disabled;
		expect(buttonDisabled).toBeFalsy();
	});

	//should be disabled if disabled is set to true
	it('should be disabled if disabled is set to true', () => {
		const button = fixture.debugElement.nativeElement.querySelector('button');
		component.disabled = true;
		fixture.detectChanges();
		const buttonDisabled = button.disabled;
		expect(buttonDisabled).toBeTruthy();
	});

	it('should call duel function on button click', () => {
		const button = fixture.debugElement.nativeElement.querySelector('button');
		spyOn(component, 'duel').and.callThrough();
		button.click();
		expect(component.duel).toHaveBeenCalled();
	});
});
