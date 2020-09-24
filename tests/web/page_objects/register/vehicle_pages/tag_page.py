from library import config
from ...page_base import BasePage

class TagPage(BasePage):
    url = config.register_plaque_url

    def set_tag(self, value):
        self.send_value_by_id("adesivo", value)
