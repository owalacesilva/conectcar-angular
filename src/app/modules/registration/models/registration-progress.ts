import { Observable } from 'rxjs/Rx';

export class RegistrationProgress {
  static _profileProgress = 0;
  static _vehicleProgress = 0;
  static _deliveryProgress = 0;
  static _paymentProgress = 0;

  static set profileProgress(value: number) {
    this._profileProgress = value;
  }

  static get profileProgress(): number {
    return this._profileProgress;
  }

  static set deliveryProgress(value: number) {
    if (this.profileProgress !== 1) {
      this.profileProgress = 1;
    }
    this._deliveryProgress = value;
  }

  static get deliveryProgress(): number {
    return this._deliveryProgress;
  }

  static set vehicleProgress(value: number) {
    if (this.deliveryProgress !== 1) {
      this.deliveryProgress = 1;
    }
    this._vehicleProgress = value;
  }

  static get vehicleProgress(): number {
    return this._vehicleProgress;
  }

  static set paymentProgress(value: number) {
    if (this.vehicleProgress !== 1) {
      this.vehicleProgress = 1;
    }
    this._paymentProgress = value;
  }

  static get paymentProgress(): number {
    return this._paymentProgress;
  }

  static clear(): void {
    this._profileProgress = 0;
    this._vehicleProgress = 0;
    this._deliveryProgress = 0;
    this._paymentProgress = 0;
  }
}
