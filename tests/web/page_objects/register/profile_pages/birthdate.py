from ...page_base import BasePage
from library import config

class BirthDate(BasePage):
    url = config.register_birthdate_url

    def set_birthdate(self, birthdate):
        splitted_birth = birthdate.split("/")
        day = splitted_birth[0]
        month = splitted_birth[1]
        year = splitted_birth[2]
        self.send_value_by_id("date", day)
        self.send_value_by_id("month", month)
        self.send_value_by_id("year", year)
