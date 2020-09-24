from library import config
from ...page_base import BasePage

class Cpf(BasePage):
    url = config.register_cpf_url

    def set_cpf(self, value):
        self.send_value_by_id("cpf", value)
        
