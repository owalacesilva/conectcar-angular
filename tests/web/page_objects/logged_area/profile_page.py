from library import config
from ..page_base import BasePage
import unittest
from time import sleep


class ProfilePage(BasePage, unittest.TestCase):
    url = config.login_url

    def wait_to_load(self):
        self.wait_for_element_by_class("meu-perfil")

    def edit_name(self):
        self.send_value_by_id("nome", "Roberto Rodrigues")
        sleep(5)
        self.click_element("salvar")

    def check_name(self):
        sleep(15)
        element = self.get_element_by_id("nome")
        placeholder = element.get_attribute_value("placeholder")
        self.assertEqual(placeholder, "Roberto Rodrigues")
