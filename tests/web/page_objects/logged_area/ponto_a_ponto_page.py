from library import config
from ..page_base import BasePage
import unittest
from time import sleep

class PontoAPontoPage(BasePage, unittest.TestCase):

    def wait_to_load(self):
        self.wait_for_element_by_class("aderir")

    def accept(self):
        self.click_element("aderir-pap")
        self.wait_for_element("confirmar-pap")
        sleep(5)
        self.click_element("confirmar-pap")

    def check_acceptance(self):
        sleep(5)
        self.wait_for_element_by_class("page-subtitle")
        element = self.get_element_by_class("page-subtitle")
        self.assertEqual(element.text, "Ades\xe3o confirmada!")
