from library import config
from ..page_base import BasePage
import unittest

class TransactionDetailsPage(BasePage, unittest.TestCase):
    url = config.login_url

    def wait_to_load(self):
        self.wait_for_element_by_class("status")

    def check_transaction_status(self):
        element = self.get_element_by_class("status")
        self.assertEqual(element.text, "Status: Aprovada")
