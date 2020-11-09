import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFieldWriteComponent } from '../abstract-field-write.component';

@Component({
  selector: 'exui-noc-postcode-field',
  templateUrl: './noc-postcode-field.html'
})
export class NocPostcodeFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  public postcodeControl: FormControl;

  public ngOnInit() {
    this.postcodeControl = this.registerControl(new FormControl(''));
  }
}
