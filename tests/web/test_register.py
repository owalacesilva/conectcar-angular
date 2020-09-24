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
from page_objects.register.profile_pages.cpf import Cpf
from page_objects.register.profile_pages.name import Name
from page_objects.register.profile_pages.email import Email
from page_objects.register.profile_pages.birthdate import BirthDate
from page_objects.register.profile_pages.phone import Phone
from page_objects.register.profile_pages.password import Password
from page_objects.register.address_pages.address import Address
from page_objects.register.vehicle_pages.plaque import Plaque
from page_objects.register.vehicle_pages.vehicles import Vehicles
from page_objects.register.vehicle_pages.credit import Credit
from page_objects.register.vehicle_pages.tag_page import TagPage
from page_objects.register.payment_pages.summary import Summary
from page_objects.register.payment_pages.payment import Payment



class DeviceFarmAppiumWebTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Remote(
            capabilities_builder.build_appium_server(), capabilities_builder.build_caps())

    def tearDown(self):
        self.driver.quit()

    def profile(self, user):
        cpf_page = Cpf(self.driver)
        cpf_page.wait_for_element("cpf")
        cpf_page.set_cpf(user["cpf"])
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


    def address(self, address):
        address_page = Address(self.driver)
        address_page.wait_for_element("cep")
        address_page.set_address(address)
        address_page.click_element("next-button")


    def vehicle(self, car):
        plaque_page = Plaque(self.driver)
        plaque_page.wait_for_element("plaque")
        plaque_page.set_plaque(car["plaque"])
        plaque_page.click_element("next-button")
        vehicles_page =  Vehicles(self.driver)
        vehicles_page.wait_for_element_by_class("veiculos")
        sleep(3)
        vehicles_page.click_element("next-button")
        credit_page = Credit(self.driver)
        credit_page.wait_for_element("amount")
        sleep(3)
        credit_page.click_element("next-button")

    def payment(self, card):
        summary_page = Summary(self.driver)
        summary_page.wait_for_element_by_class("meus_planos")
        sleep(3)
        summary_page.click_element("next-button")
        payment_page = Payment(self.driver)
        payment_page.wait_for_element("card-number")
        payment_page.set_card(card)
        sleep(3)
        payment_page.click_element("adesao-click")
        payment_page.click_element("next-button")
        payment_page.wait_for_element_by_class("image-checked")

    def test_shop_new_client(self):
        car = data.get_vehicle("unregistered_vehicle_1")
        user = data.get_user("new_unregistered_user")
        card = data.get_card("valid_card")
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("btn-close")
        homepage.click_element("btn-close")
        homepage.wait_for_element("urban-plan-button")
        homepage.click_element("urban-plan-button")
        self.profile(user)
        self.address(user["address"])
        self.vehicle(car)
        self.payment(card)



    def test_shop_client_no_user(self):
        car = data.get_vehicle("vehicle_legado")
        car2 = data.get_vehicle("unregistered_vehicle_2")
        user = data.get_user("client_with_no_user")
        card = data.get_card("valid_card")
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("btn-close")
        homepage.click_element("btn-close")
        homepage.wait_for_element("urban-plan-button")
        homepage.click_element("urban-plan-button")
        cpf_page = Cpf(self.driver)
        cpf_page.wait_for_element("cpf")
        cpf_page.set_cpf(user["cpf"])
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
        self.address(user["address"])
        self.vehicle(car2)
        self.payment(card)

    def test_shop_registered_client_from_stop(self):
        user = data.get_user("registered_user")
        car = data.get_vehicle("unregistered_vehicle_3")
        card = data.get_card("valid_card")
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("btn-close")
        homepage.click_element("btn-close")
        homepage.wait_for_element("urban-plan-button")
        homepage.click_element("urban-plan-button")
        cpf_page = Cpf(self.driver)
        cpf_page.wait_for_element("cpf")
        cpf_page.set_cpf(user["cpf"])
        password_page = Password(self.driver)
        password_page.wait_for_element("password")
        password_page.set_password(user["password"])
        password_page.click_element("next-button")
        self.address(user["address"])
        self.vehicle(car)
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("urban-plan-button")
        homepage.click_element("urban-plan-button")
        cpf_page = Cpf(self.driver)
        cpf_page.wait_for_element("cpf")
        cpf_page.set_cpf(user["cpf"])
        password_page = Password(self.driver)
        password_page.wait_for_element("password")
        password_page.set_password(user["password"])
        password_page.click_element("next-button")
        self.payment(card)

    def test_second_shop_same_card(self):
        user = data.get_user("registered_user")
        car = data.get_vehicle("unregistered_vehicle_4")
        card = data.get_card("valid_card")
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("btn-close")
        homepage.click_element("btn-close")
        homepage.wait_for_element("urban-plan-button")
        homepage.click_element("urban-plan-button")
        cpf_page = Cpf(self.driver)
        cpf_page.wait_for_element("cpf")
        cpf_page.set_cpf(user["cpf"])
        password_page = Password(self.driver)
        password_page.wait_for_element("password")
        password_page.set_password(user["password"])
        password_page.click_element("next-button")
        self.vehicle(car)
        summary_page = Summary(self.driver)
        summary_page.wait_for_element_by_class("meus_planos")
        sleep(3)
        summary_page.click_element("next-button")
        payment_page = Payment(self.driver)
        payment_page.wait_for_element("card-number")
        sleep(3)
        payment_page.click_element("adesao-click")
        payment_page.click_element("next-button")
        payment_page.wait_for_element_by_class("image-checked")

    def test_second_shop_new_card(self):
        user = data.get_user("registered_user")
        car = data.get_vehicle("unregistered_vehicle_5")
        card = data.get_card("valid_card")
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("btn-close")
        homepage.click_element("btn-close")
        homepage.wait_for_element("urban-plan-button")
        homepage.click_element("urban-plan-button")
        cpf_page = Cpf(self.driver)
        cpf_page.wait_for_element("cpf")
        cpf_page.set_cpf(user["cpf"])
        password_page = Password(self.driver)
        password_page.wait_for_element("password")
        password_page.set_password(user["password"])
        password_page.click_element("next-button")
        self.address(user["address"])
        self.vehicle(car)
        summary_page = Summary(self.driver)
        summary_page.wait_for_element_by_class("meus_planos")
        sleep(3)
        summary_page.click_element("next-button")
        payment_page = Payment(self.driver)
        payment_page.wait_for_element("card-number")
        payment_page.click_element("change-card")
        payment_page.set_card(card)
        sleep(3)
        payment_page.click_element("adesao-click")
        payment_page.click_element("next-button")
        payment_page.wait_for_element_by_class("image-checked")

    def test_shop_new_client_invalid_card(self):
        car = data.get_vehicle("unregistered_vehicle_1")
        user = data.get_user("new_unregistered_user")
        card = data.get_card("invalid_card")
        homepage = HomePage(self.driver)
        homepage.navigate()
        homepage.wait_for_element("btn-close")
        homepage.click_element("btn-close")
        homepage.wait_for_element("urban-plan-button")
        homepage.click_element("urban-plan-button")
        self.profile(user)
        self.address(user["address"])
        self.vehicle(car)
        self.payment(card)



# Start of script
if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(DeviceFarmAppiumWebTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
