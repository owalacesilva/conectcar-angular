from library import config
from ...page_base import BasePage

class Name(BasePage):
    url = config.register_name_url

    def set_name(self, value):
        self.send_value_by_id("name", value)
