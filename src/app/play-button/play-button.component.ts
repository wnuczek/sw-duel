import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SwapiService } from '../swapi.service';

@Component({
	selector: 'app-play-button',
	standalone: true,
	imports: [MatButtonModule],
	templateUrl: './play-button.component.html',
	styleUrl: './play-button.component.css',
})
export class PlayButtonComponent {
	private swapi = inject(SwapiService);

	@Input() disabled: boolean | null = false;

	duel() {
		this.swapi.duel();
	}
}
