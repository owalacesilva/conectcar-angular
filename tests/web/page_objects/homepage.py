from library import config
from page_base import BasePage
from appium import webdriver

class HomePage(BasePage):
    url = config.root_url

    def navigate_to_login(self):
        self.driver.get(config.login_url)
