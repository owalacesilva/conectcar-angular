from library import config
from ...page_base import BasePage

class Phone(BasePage):
    url = config.register_phone_url

    def set_phone(self, phone):
        phone_splitted = phone.split()
        ddd = phone_splitted[0]
        phone_number = phone_splitted[1]
        self.send_value_by_id("ddd", ddd)
        self.send_value_by_id("phone", phone_number)
