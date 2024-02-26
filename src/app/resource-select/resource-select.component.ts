import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SWAPI_RESOURCES, SwapiResourceName } from '../model';
import { SwapiService } from '../swapi.service';

@Component({
	selector: 'app-resource-select',
	standalone: true,
	imports: [KeyValuePipe, AsyncPipe, FormsModule, MatSelectModule],
	templateUrl: './resource-select.component.html',
	styleUrl: './resource-select.component.css',
})
export class ResourceSelectComponent {
	resources = SWAPI_RESOURCES;
	private swapi = inject(SwapiService);

	selectedResource$ = this.swapi.selectedResource$;

	onResourceSelect($event: SwapiResourceName) {
		this.swapi.selectedResource($event);
	}
}
