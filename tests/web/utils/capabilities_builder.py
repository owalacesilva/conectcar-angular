from appium import webdriver

def build_caps():
    desired_caps = {}
    desired_caps['platformName'] = 'iOS'
    desired_caps['platformVersion'] = '11.2'
    desired_caps['deviceName'] = 'iPhone 6'
    desired_caps['browserName'] = 'Safari'
    desired_caps['safariIgnoreFraudWarning'] = True

    return desired_caps

def build_appium_server():
    url = 'http://0.0.0.0:4723/wd/hub'
    return url
