from library import config
from ...page_base import BasePage
from library import geradorcpf

class Address(BasePage):
    url = config.register_address_url

    def set_address(self, value):
        address = value.split(",")
        cep = address[5]
        number = address[1]
        complement = address[2]
        self.send_value_by_id("cep", cep)
        self.wait_for_element("numero")
        self.send_value_by_id("numero", number)
        self.send_value_by_id("complemento", complement)
