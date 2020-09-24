import { CPF } from 'cpf_cnpj';
import { Validators } from '@angular/forms';

export class CustomValidators {
  static cpf({ value }) {
    return CPF.isValid(value) ? null : { cpf: true };
  }

  static names({ value }) {
    return value.trim().split(' ').length > 1 ? null : { names: true };
  }

  static date({ value }) {
    return value.split('/').length === 3 ? null : { date: true };
  }

  static password({ value }) {
    const ret: any = {};

    if (value.length < 8) {
      ret.minLength = true;
    }

    if (value.length > 14) {
      ret.maxLength = true;
    }

    if (value.split('').filter(char => /[A-Z]/g.test(char)).length < 1) {
      ret.noUpperCase = true;
    }

    if (value.split('').filter(char => /[a-z]/g.test(char)).length < 1) {
      ret.noLowerCase = true;
    }

    if (value.split('').filter(char => /\d/g.test(char)).length < 1) {
      ret.noNumbers = true;
    }

    return ret;
  }

  static plaque({ value }) {
    return {
      plaque: /[a-zA-Z]{3}-\d{4}/.test(value)
    }
  }

  static email(data) {
    const valid = Validators.email(data);
    if (valid) {
      return valid;
    }

    const required = Validators.required(data);
    if (required) {
      return required;
    }

    if (data.value.indexOf('+') > -1) {
      return { email: true };
    }
    return null;
  }
}
