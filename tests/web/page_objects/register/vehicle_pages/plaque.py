from library import config
from ...page_base import BasePage

class Plaque(BasePage):
    url = config.register_plaque_url

    def set_plaque(self, car):
        plaque = car.split("-")
        self.send_value_by_id("plaque", plaque[0])
        self.send_value_by_id("plaque2", plaque[1])
