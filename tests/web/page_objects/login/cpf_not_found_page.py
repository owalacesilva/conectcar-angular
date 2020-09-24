from library import config
from ..page_base import BasePage
from time import sleep

class CpfNotFoundPage(BasePage):
    url = config.login_url

    def wait_to_load(self):
        self.wait_for_element("cpf-nao-encontrado")
