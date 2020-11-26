import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@angular/forms/src/directives/validators';
import * as moment from 'moment';

export class NocValidators {
  public static numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') { return; }
      if (!control.value.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) {
        return { number: true };
      }
      return;
    };
  }

  public static postcodeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') { return; }
      if (!control.value.toString().match(/^(([A-Za-z]{1,2}[0-9][A-Za-z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Za-z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Za-z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/)) {
        return { postcode: true };
      }
      return;
    };
  }

  public static phoneUKValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') { return; }
      if (!control.value.toString().match(/^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/)) {
        return { phoneUK: true };
      }
      return;
    };
  }

  public static dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') { return; }
      // moment('24/12/2019', "DD MM YYYY", true);
      if (!moment(control.value.toString(), "DD/MM/YYYY", true).isValid()) {
        return { date: true };
      }
      return;
    };
  }

  public static dateTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') { return; }
      // moment('24/12/2019 09:15:00', "DD MM YYYY hh:mm:ss", true);
      const dt = moment(control.value.toString(), "DD/MM/YYYY hh:mm:ss", true).toDate();
      if (!moment(control.value.toString(), "DD/MM/YYYY hh:mm:ss", true).isValid()) {
        return { datetime: true };
      }
      return;
    };
  }

  public static timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') { return; }
      // moment('09:15:00', "hh:mm:ss", true);
      if (!moment(control.value.toString(), "hh:mm:ss", true).isValid()) {
        return { time: true };
      }
      return;
    };
  }
}
