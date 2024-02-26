import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-duel-result',
	standalone: true,
	imports: [NgClass],
	templateUrl: './duel-result.component.html',
	styleUrl: './duel-result.component.css',
})
export class DuelResultComponent {
	@Input() loading: boolean | null = false;
	@Input() results: [boolean, boolean] | [undefined, undefined] | undefined;

	duelResultLabel():
		| 'No duels played'
		| 'Draw'
		| 'Player 1 wins'
		| 'Player 2 wins' {
		if (!this.results || this.results.every((r) => r === undefined))
			return 'No duels played';
		if (this.results.every((r) => r === false)) return 'Draw';
		if (this.results[0]) return 'Player 1 wins';
		return 'Player 2 wins';
	}
}
