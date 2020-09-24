from library import config
from ...page_base import BasePage

class Password(BasePage):
    url = config.register_password_url

    def set_password(self, value):
        self.send_value_by_id("password", value)
