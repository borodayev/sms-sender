// @flow

export default class Smsc {
  constructor(credentials: Object) {
    this.credentials = credentials;
  }

  getCredentials() {
    console.log(this.credentials);
  }
}
