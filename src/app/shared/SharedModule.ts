import { FormValidationStyleDirective } from '../directives/FormValidationStyleDirective';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        FormValidationStyleDirective
    ],
    imports: [
        CommonModule
    ],
    exports:[
        FormValidationStyleDirective
    ]
})

export class SharedModule { }