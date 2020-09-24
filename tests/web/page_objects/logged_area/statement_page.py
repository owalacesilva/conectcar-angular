from library import config
from ..page_base import BasePage
import unittest

class StatementPage(BasePage, unittest.TestCase):

    def wait_to_load(self):
        self.wait_for_element_by_class("title")
        

    def click_order(self):
        element = self.get_element_by_class("line-item")
        element.click()
