# coding=utf-8
import os
import unittest
import selenium
from appium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from time import sleep
from utils import capabilities_builder
from utils import capabilities_builder_amazon
from library import geradorcpf
from library import config
from library import data
from page_objects.page_base import BasePage
from page_objects.homepage import HomePage
from page_objects.login.login_page import LoginPage
from page_objects.logged_area.orders_page import OrdersPage
from page_objects.logged_area.order_details_page import OrderDetailsPage



class DeviceFarmAppiumWebTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Remote(
            capabilities_builder.build_appium_server(), capabilities_builder.build_caps())

    def tearDown(self):
        self.driver.quit()

    def test_list_orders(self):
        user = data.get_user("registered_user")
        homepage = HomePage(self.driver)
        homepage.navigate()
        sleep(3)
        homepage.navigate_to_login()
        login_page = LoginPage(self.driver)
        login_page.wait_to_load()
        login_page.logIn(user["cpf"], user["password"])
        orders_page = OrdersPage(self.driver)
        orders_page.wait_to_load()

    def test_status_payment_approved(self):
        user = data.get_user("registered_user")
        homepage = HomePage(self.driver)
        homepage.navigate()
        sleep(3)
        homepage.navigate_to_login()
        login_page = LoginPage(self.driver)
        login_page.wait_to_load()
        login_page.logIn(user["cpf"], user["password"])
        orders_page = OrdersPage(self.driver)
        orders_page.wait_to_load()
        orders_page.find_payment_approved_order()
        order_details_page = OrderDetailsPage(self.driver)
        order_details_page.check_payment_approved()

    def test_status_delivering(self):
        user = data.get_user("registered_user")
        homepage = HomePage(self.driver)
        homepage.navigate()
        sleep(3)
        homepage.navigate_to_login()
        login_page = LoginPage(self.driver)
        login_page.wait_to_load()
        login_page.logIn(user["cpf"], user["password"])
        orders_page = OrdersPage(self.driver)
        orders_page.wait_to_load()
        orders_page.find_delivering()
        order_details_page = OrderDetailsPage(self.driver)
        order_details_page.check_delivering()

    def test_status_delivered(self):
        user = data.get_user("registered_user")
        homepage = HomePage(self.driver)
        homepage.navigate()
        sleep(3)
        homepage.navigate_to_login()
        login_page = LoginPage(self.driver)
        login_page.wait_to_load()
        login_page.logIn(user["cpf"], user["password"])
        orders_page = OrdersPage(self.driver)
        orders_page.wait_to_load()
        orders_page.find_delivered()
        order_details_page = OrderDetailsPage(self.driver)
        order_details_page.check_delivered()
# Start of script
if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(DeviceFarmAppiumWebTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
