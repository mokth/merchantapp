import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'

@Directive({ selector: '[formValidationStyle]' })
export class FormValidationStyleDirective implements OnInit {
  @Input('formValidationStyle') private formGroup: FormGroup;
  private component: FormControl;

  static VALID_STYLE: string = 'has-success';
  static INVALID_STYLE: string = 'has-invalid';

  constructor(private el: ElementRef) { 
    console.log(el);
  }

  ngOnInit(): void {
    let componentName: string;
    let inputElement = this.el.nativeElement.querySelector('input');
    if (inputElement) {
      componentName = inputElement.getAttribute('formControlName');
    }
    if (!componentName) {
      console.error('FormValidationStyleDirective: Unable to get the control name. Is the formControlName attribute set correctly?')
      return;
    }

    let control = this.formGroup.get(componentName)
     if (!(control instanceof FormControl)) {
       console.error(`FormValidationStyleDirective: Unable to get the FormControl from the form and the control name: ${componentName}.`)
       return;
     }
    this.component = control as FormControl;
    console.log(this.component);
    console.log(control);
    this.component.statusChanges.subscribe((status) => {
      this.onStatusChange(status);
    });
    this.onStatusChange(this.component.status);
  }

  onStatusChange(status: string): void {
    let cl = this.el.nativeElement.classList;
    console.log('onStatusChange '+status);
    if (status == 'VALID') {
      cl.add(FormValidationStyleDirective.VALID_STYLE)
      cl.remove(FormValidationStyleDirective.INVALID_STYLE)
    } else if (status == 'INVALID') {
      cl.add(FormValidationStyleDirective.INVALID_STYLE)
      cl.remove(FormValidationStyleDirective.VALID_STYLE)
    }
  }
}