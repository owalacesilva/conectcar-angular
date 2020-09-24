from library import config
from ...page_base import BasePage
from library import geradorcpf

class Payment(BasePage):
    url = config.register_payment_url

    def set_card(self, value):
        card_number = value["card_number"]
        card_owner = value["card_owner"]
        card_expire_date = value["card_expire_date"].replace("/", "")
        card_cvv = value["card_cvv"]

        self.send_value_by_id("card-number", card_number)
        self.send_value_by_id("card-owner", card_owner)
        self.send_value_by_id("card-expire-date", card_expire_date)
        self.send_value_by_id("card-cvv", card_cvv)
