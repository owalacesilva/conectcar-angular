from appium import webdriver
import selenium
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

class BasePage(object):
    url = None

    def __init__(self, driver):
        self.driver = driver

    def navigate(self):
        self.driver.get(self.url)

    def get_element_by_id(self, locator):
        element = None
        element = self.driver.find_element_by_id(locator)
        return element

    def get_element_by_class(self, locator):
        element = None
        element = self.driver.find_element_by_class_name(locator)
        return element

    def get_element_by_xpath(self, locator):
        element = None
        element = self.driver.find_element_by_xpath(locator)
        return element

    def get_element_by_css_selector(self, locator):
        element = None
        element = self.driver.find_element_by_css_selector(locator)
        return element

    def get_elements_by_class(self, locator):
        elements = None
        elements = self.driver.find_elements_by_class_name(locator)
        return elements


    def click_element(self, locator):
        element = self.get_element_by_id(locator)
        element.click()

    def click_element_by_class(self, locator):
        element = self.get_element_by_class(locator)
        element.click()

    def click_element_by_css_selector(self, locator):
        element = self.get_element_by_css_selector(locator)
        element.click()

    def wait_for_element(self, locator):
        WebDriverWait(self.driver, 60).until(EC.visibility_of_element_located((By.ID, locator)))


    def wait_for_element_by_class(self, locator):
        WebDriverWait(self.driver, 60).until(EC.visibility_of_element_located((By.CLASS_NAME, locator)))

    def wait_for_element_by_css_selector(self, locator):
        WebDriverWait(self.driver, 60).until(EC.visibility_of_element_located((By.CSS_SELECTOR, locator)))

    def send_value_by_id(self, locator, value):
        element = self.get_element_by_id(locator)
        element.clear()
        element.send_keys(value)

    def send_value_by_class_name(self, locator, value):
        element = self.get_element_by_class_name(locator)
        element.click()
        element.clear()
        element.send_keys(value)

    def send_value_by_xpath(self, locator, value):
        element = self.get_element_by_xpath(locator)
        element.click()
        element.clear()
        element.send_keys(value)
