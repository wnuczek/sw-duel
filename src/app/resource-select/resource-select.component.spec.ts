import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SWAPI_RESOURCES } from '../model';
import { ResourceSelectComponent } from './resource-select.component';

describe('ResourceSelectComponent', () => {
	let component: ResourceSelectComponent;
	let fixture: ComponentFixture<ResourceSelectComponent>;
	let loader: HarnessLoader;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ResourceSelectComponent,
				NoopAnimationsModule,
				HttpClientModule,
				MatSelectModule,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ResourceSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		loader = TestbedHarnessEnvironment.loader(fixture);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	//should have one mat-select element
	it('should have one mat-select element', () => {
		const selects =
			fixture.debugElement.nativeElement.querySelectorAll('mat-select');
		expect(selects.length).toEqual(1);
	});

	//should have mat-options for all resources
	it('should have mat-options for all resources', async () => {
		component.resources = SWAPI_RESOURCES;
		const selectHarness =
			await loader.getHarness<MatSelectHarness>(MatSelectHarness);

		await (await selectHarness.host()).click();
		const optionsCount = (await selectHarness.getOptions()).length;
		expect(optionsCount).toEqual(Object.keys(SWAPI_RESOURCES).length);
	});

	//should have default selected value
	it('should have default selected value', async () => {
		component.resources = SWAPI_RESOURCES;
		const selectHarness =
			await loader.getHarness<MatSelectHarness>(MatSelectHarness);

		await (await selectHarness.host()).click();
		const options = await selectHarness.getOptions();
		options.some(async (option) => {
			const selected = await option.isSelected();
			expect(selected).toEqual(true);
		});
	});

	//should trigger onResourceSelect on valueChange event
	it('should trigger onResourceSelect on valueChange event', async () => {
		component.resources = SWAPI_RESOURCES;

		spyOn(component, 'onResourceSelect').and.callThrough();

		const selectHarness =
			await loader.getHarness<MatSelectHarness>(MatSelectHarness);

		(await selectHarness.host()).click();
		const options = await selectHarness.getOptions();
		await options[1].click();

		expect(component.onResourceSelect).toHaveBeenCalled();
	});
});
