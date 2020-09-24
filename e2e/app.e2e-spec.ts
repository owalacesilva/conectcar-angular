import { ConectcarWebPage } from './app.po';

describe('conectcar-web App', () => {
  let page: ConectcarWebPage;

  beforeEach(() => {
    page = new ConectcarWebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to conectcar!!');
  });
});
