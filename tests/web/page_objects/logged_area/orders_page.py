from library import config
from ..page_base import BasePage
from time import sleep
import selenium

class OrdersPage(BasePage):

    def wait_to_load(self):
        self.wait_for_element("order-button")

    def click_order(self):
        self.click_element("order-button")

    def find_payment_approved_order(self):
        elements = self.get_elements_by_class("status")
        element = (element for element in elements if element.text == "PagamentoAprovado").next()
        parent_element = element.find_element_by_xpath("./../..")
        button = parent_element.find_element_by_class_name("btn")
        button.click()

    def find_delivering(self):
        elements = self.get_elements_by_class("status")
        element = (element for element in elements if element.text == "SaiuParaEntrega").next()
        parent_element = element.find_element_by_xpath("./../..")
        button = parent_element.find_element_by_class_name("btn")
        button.click()

    def find_delivered(self):
        elements = self.get_elements_by_class("status")
        element = (element for element in elements if element.text == "Entregue").next()
        parent_element = element.find_element_by_xpath("./../..")
        button = parent_element.find_element_by_class_name("btn")
        button.click()
