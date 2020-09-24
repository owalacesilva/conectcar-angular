from library import config
from ..page_base import BasePage
from time import sleep

class LoginPage(BasePage):
    url = config.login_url

    def logIn(self, cpf, password):
        self.send_value_by_id("cpf", cpf)
        self.wait_for_element("password")
        self.send_value_by_id("password", password)
        self.click_element("next-button")

    def set_cpf(self, cpf):
        self.send_value_by_id("cpf", cpf)

    def wait_to_load(self):
        self.wait_for_element("cpf")
