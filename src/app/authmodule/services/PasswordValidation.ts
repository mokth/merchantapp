import {AbstractControl} from '@angular/forms';

export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('newpass1').value; // to get value in input tag
       let confirmPassword = AC.get('newpass2').value; // to get value in input tag
        if(password != confirmPassword) {
            console.log('false');
            AC.get('newpass2').setErrors( {MatchPassword: true} )
        } else {
            console.log('true');
            return null
        }
    }
}