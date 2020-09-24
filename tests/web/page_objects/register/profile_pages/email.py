from library import config
from ...page_base import BasePage

class Email(BasePage):
    url = config.register_email_url

    def set_email(self, value):
        self.send_value_by_id("email", value)
