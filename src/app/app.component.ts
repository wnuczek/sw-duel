import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './card/card.component';
import { ResourceSelectComponent } from './resource-select/resource-select.component';
import { SwapiResourceName, SwapiService } from './swapi.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		CommonModule,
		CardComponent,
		ResourceSelectComponent,
		MatButtonModule,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	title = 'SW Duel';
	selectedResource: SwapiResourceName = 'people';

	private swapi = inject(SwapiService);

	duelState$ = this.swapi.duelState$;
	duelLoading$ = this.swapi.duelLoading$;

	duel() {
		this.swapi.duel(this.selectedResource);
	}

	duelResultLabel(
		results: [boolean, boolean] | [undefined, undefined] | undefined,
	): 'No duels played' | 'Draw' | 'Player 1 wins' | 'Player 2 wins' {
		if (!results || results.every((r) => r === undefined))
			return 'No duels played';
		if (results.every((r) => r === false)) return 'Draw';
		if (results[0]) return 'Player 1 wins';
		return 'Player 2 wins';
	}
}
