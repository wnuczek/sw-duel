import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './card/card.component';
import { DuelResultComponent } from './duel-result/duel-result.component';
import { PlayButtonComponent } from './play-button/play-button.component';
import { ResourceSelectComponent } from './resource-select/resource-select.component';
import { SwapiService } from './swapi.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		CommonModule,
		CardComponent,
		ResourceSelectComponent,
		PlayButtonComponent,
		DuelResultComponent,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	title = 'SW Duel';

	private swapi = inject(SwapiService);

	duelState$ = this.swapi.duelState$;
	duelLoading$ = this.swapi.duelLoading$;

	duel() {
		this.swapi.duel();
	}
}
