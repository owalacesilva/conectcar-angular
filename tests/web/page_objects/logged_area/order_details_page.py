from library import config
from ..page_base import BasePage
from time import sleep
import selenium

class OrderDetailsPage(BasePage):
    url = config.login_url

    def wait_to_load(self):
        self.wait_for_element_by_class("status-image")

    def check_status(self):
        element = self.get_element_by_class("status-title")
        element.is_displayed()
