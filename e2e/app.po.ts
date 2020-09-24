import { browser, by, element } from 'protractor';

export class ConectcarWebPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('conectcar-root h1')).getText();
  }
}
