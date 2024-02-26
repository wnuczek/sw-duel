import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
	SwapiRequestResult,
	SwapiResource,
	isSwapiPerson,
	isSwapiStarship,
} from '../model';

@Component({
	selector: 'app-card',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatDividerModule,
		MatButtonModule,
		MatProgressBarModule,
	],
	templateUrl: './card.component.html',
	styleUrl: './card.component.css',
})
export class CardComponent {
	@Input() resource: SwapiRequestResult<SwapiResource> | undefined;
	@Input() result: boolean | undefined;
	@Input() player: string | undefined;
	@Input() playerWins: number | undefined;
	@Input() loading: boolean | null | undefined;

	getComparedProperty() {
		if (!this.resource) {
			return;
		}
		if (isSwapiPerson(this.resource.properties)) {
			return `Mass: ${this.resource.properties.mass}`;
		}
		if (isSwapiStarship(this.resource.properties)) {
			return `Crew: ${this.resource.properties.crew}`;
		}
		return;
	}
}
