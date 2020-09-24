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
from page_objects.login.cpf_not_found_page import CpfNotFoundPage
from page_objects.logged_area.statement_page import StatementPage
from page_objects.register.vehicle_pages.plaque import Plaque
from page_objects.register.vehicle_pages.tag_page import TagPage
from page_objects.register.profile_pages.name import Name
from page_objects.register.profile_pages.email import Email
from page_objects.register.profile_pages.phone import Phone
from page_objects.register.profile_pages.birthdate import BirthDate
from page_objects.register.profile_pages.password import Password
from page_objects.logged_area.orders_page import OrdersPage
from page_objects.logged_area.order_details_page import OrderDetailsPage
from page_objects.logged_area.transaction_details_page import TransactionDetailsPage
from page_objects.logged_area.profile_page import ProfilePage
from page_objects.logged_area.ponto_a_ponto_page import PontoAPontoPage











class WebLoginTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Remote(
            capabilities_builder.build_appium_server(), capabilities_builder.build_caps())

    def tearDown(self):
        self.driver.quit()

    def test_login_unregistered_cpf(self):
      user = data.get_user("new_unregistered_user")
      homepage = HomePage(self.driver)
      homepage.navigate()
      homepage.wait_for_element("btn-close")
      homepage.click_element("btn-close")
      homepage.wait_for_element('urban-plan-button')
      login_page = LoginPage(self.driver)
      self.driver.get("http://localhost:4200/login")
      login_page.wait_to_load()
      login_page.setCpf(user['cpf'])
      cpf_not_found_page = CpfNotFoundPage(self.driver)
      cpf_not_found_page.wait_to_load()
      sleep(10)

    def test_login_registered_user(self):
      user = data.get_user("registered_user")
      homepage = HomePage(self.driver)
      homepage.navigate()
      homepage.wait_for_element("btn-close")
      homepage.click_element("btn-close")
      homepage.wait_for_element('urban-plan-button')
      login_page = LoginPage(self.driver)
      self.driver.get("http://localhost:4200/login")
      login_page.wait_to_load()
      login_page.logIn(user["cpf"], user["password"])
      statement_page = StatementPage(self.driver)
      statement_page.wait_to_load()

    def test_login_client_no_user(self):
      car = data.get_vehicle("vehicle_legado")
      car2 = data.get_vehicle("unregistered_vehicle_2")
      user = data.get_user("client_with_no_user")
      card = data.get_card("valid_card")
      homepage = HomePage(self.driver)
      homepage.navigate()
      homepage.wait_for_element("btn-close")
      homepage.click_element("btn-close")
      homepage.wait_for_element('urban-plan-button')
      login_page = LoginPage(self.driver)
      self.driver.get("http://localhost:4200/login")
      login_page.wait_to_load()
      login_page.set_cpf(user["cpf"])
      plaque_page = Plaque(self.driver)
      plaque_page.wait_for_element("plaque")
      plaque_page.set_plaque(car["plaque"])
      plaque_page.click_element("next-button")
      tag_page = TagPage(self.driver)
      tag_page.wait_for_element("adesivo")
      tag_page.set_tag(car["tag"])
      tag_page.click_element("next-button")
      name_page = Name(self.driver)
      name_page.wait_for_element("name")
      name_page.set_name(user["name"])
      name_page.click_element("next-button")
      email_page = Email(self.driver)
      email_page.wait_for_element("email")
      email_page.set_email(user["email"])
      email_page.click_element("next-button")
      phone_page = Phone(self.driver)
      phone_page.wait_for_element("phone")
      phone_page.set_phone(user["phone"])
      phone_page.click_element("next-button")
      birth_page = BirthDate(self.driver)
      birth_page.wait_for_element("date")
      birth_page.set_birthdate(user["birthdate"])
      birth_page.click_element("next-button")
      password_page = Password(self.driver)
      password_page.wait_for_element("password")
      password_page.set_password(user["password"])
      password_page.click_element("next-button")
      statement_page = StatementPage(self.driver)
      statement_page.wait_to_load()

    def test_transaction_details(self):
        user = data.get_user("registered_user")
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("btn-close")
        homepage.click_element("btn-close")
        homepage.wait_for_element('urban-plan-button')
        login_page = LoginPage(self.driver)
        self.driver.get("http://localhost:4200/login")
        login_page.wait_to_load()
        login_page.logIn(user["cpf"], user["password"])
        statement_page = StatementPage(self.driver)
        statement_page.wait_to_load()
        statement_page.click_order()
        transaction_details_page = TransactionDetailsPage(self.driver)
        transaction_details_page.wait_to_load()

    def test_check_order_status(self):
        user = data.get_user("registered_user")
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("btn-close")
        homepage.click_element("btn-close")
        homepage.wait_for_element('urban-plan-button')
        login_page = LoginPage(self.driver)
        self.driver.get("http://localhost:4200/login")
        login_page.wait_to_load()
        login_page.logIn(user["cpf"], user["password"])
        statement_page = StatementPage(self.driver)
        statement_page.wait_to_load()
        self.driver.get("http://localhost:4200/pedidos")
        orders_page = OrdersPage(self.driver)
        orders_page.wait_to_load()
        orders_page.click_order()
        order_details_page = OrderDetailsPage(self.driver)
        order_details_page.wait_to_load()
        order_details_page.check_status()





    def test_edit_profile(self):
        user = data.get_user("registered_user")
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("btn-close")
        homepage.click_element("btn-close")
        homepage.wait_for_element('urban-plan-button')
        login_page = LoginPage(self.driver)
        self.driver.get("http://localhost:4200/login")
        login_page.wait_to_load()
        login_page.logIn(user["cpf"], user["password"])
        statement_page = StatementPage(self.driver)
        statement_page.wait_to_load()
        self.driver.get("http://localhost:4200/meu-conect/perfil")
        profile_page = ProfilePage(self.driver)
        profile_page.wait_to_load()
        profile_page.edit_name()
        profile_page.wait_to_load()
        profile_page.check_name()

    def test_ponto_a_ponto(self):
        user = data.get_user("registered_user")
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("btn-close")
        homepage.click_element("btn-close")
        homepage.wait_for_element('urban-plan-button')
        login_page = LoginPage(self.driver)
        self.driver.get("http://localhost:4200/login")
        login_page.wait_to_load()
        login_page.logIn(user["cpf"], user["password"])
        statement_page = StatementPage(self.driver)
        statement_page.wait_to_load()
        self.driver.get("http://localhost:4200/ponto-a-ponto")
        ponto_a_ponto = PontoAPontoPage(self.driver)
        ponto_a_ponto.wait_to_load()
        ponto_a_ponto.accept()
        ponto_a_ponto.check_acceptance()







# Start of script
if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(DeviceFarmAppiumWebTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
