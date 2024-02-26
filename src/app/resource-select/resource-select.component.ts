import { KeyValuePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SWAPI_RESOURCES, SwapiResourceName } from '../swapi.service';

@Component({
  selector: 'app-resource-select',
  standalone: true,
  imports: [KeyValuePipe, FormsModule, MatSelectModule],
  templateUrl: './resource-select.component.html',
  styleUrl: './resource-select.component.css',
})
export class ResourceSelectComponent {
  resources = SWAPI_RESOURCES;

  @Input() selectedResource: SwapiResourceName | undefined;
  @Output() selectedResourceChange: EventEmitter<SwapiResourceName> =
    new EventEmitter<SwapiResourceName>();

  onResourceSelect($event: SwapiResourceName) {
    this.selectedResourceChange.emit($event);
  }
}
