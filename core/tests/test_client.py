from django.test import TestCase, LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import NoSuchElementException
from django.urls import reverse


from core.models import *

# Create your tests here.
class coreClientTestCase(StaticLiveServerTestCase):
  @classmethod
  def setUpClass(cls):
    super().setUpClass()
    cls.selenium = WebDriver()
    cls.selenium.implicitly_wait(10)
    print("setUpClass - This runs once before any test method.")
    
    
  @classmethod
  def tearDownClass(cls):
    cls.selenium.quit()
    super().tearDownClass()
    print("tearDownClass - This runs once after all test methods.")
    
  @classmethod
  def setUpTestData(cls):
      # Set up data for the whole TestCase
      print("setUpTestDataClass - Set up data for the whole TestCase.")
    
  def setUp(self):
    print("setUp - This runs before each test method.")
    self.register("harry", "harry@test.com", "1234", "1234", "Harry", "Potter", "31/07/1980")  
    self.register("hermione", "hermione@test.com", "1234", "1234", "Hermione", "Granger", "19/09/1979")
    self.register("ron", "ron@test.com", "1234", "1234", "Ron", "Weasley", "01/03/1980")
    self.logout()
    
  def tearDown(self):
    print("tearDown - This runs after each test method.")

  def test_01_register(self):
    print("Running test_01_register.")
    
    self.selenium.get(self.live_server_url)
    
    """TEST LINK TO REGISTER"""
    self.selenium.find_element(By.XPATH, '//a[contains(text(), "Register here.")]').click()
    self.wait_until_body_is_loaded(timeout=2)
    
    # Assert url
    self.assertURLEqual(self.selenium.current_url, self.live_server_url + reverse('register'))
    # self.assertURLEqual(self.selenium.current_url, f"{self.live_server_url}/register")
    
    """TEST REGISTER FAILED"""
    register_arg = {
      "username": "test",
      "email": "test@test.com",
      "password": "1234",
      "confirmation": "123",
      "first_name": "Testy",
      "last_name": "Tester",
      "date_of_birth": "05/03/1985"
    }
    self.register(**register_arg)
    self.wait_until_body_is_loaded(timeout=2)
    
    # Assert url
    self.assertURLEqual(self.selenium.current_url, self.live_server_url + reverse('register'))
    # self.assertURLEqual(self.selenium.current_url, f"{self.live_server_url}/register")
    
    # Assert message
    try:
      message = self.selenium.find_element(By.XPATH, '//div[@class="system-message"]')
    except NoSuchElementException:
      print("Message missing.")
  
    self.assertEqual(message.get_attribute("innerText"), "Passwords must match.")
    
    """TEST REGISTER SUCCESSFUL"""
    register_arg = {
      "username": "test",
      "email": "test@test.com",
      "password": "1234",
      "confirmation": "1234",
      "first_name": "Testy",
      "last_name": "Tester",
      "date_of_birth": "05/03/1985"
    }
    self.register(**register_arg)
    self.wait_until_body_is_loaded(timeout=2)
    
    # Assert url
    self.assertURLEqual(self.selenium.current_url, self.live_server_url + reverse('index'))
    
    # Assert username
    try:
      welcome_message = self.selenium.find_element(By.TAG_NAME, "strong")
    except NoSuchElementException:
      print("Username missing.")
      
    self.assertEqual(welcome_message.get_attribute("innerText"), f"Hi {register_arg['first_name']}!")
    
    """TEST REPEATED REGISTRATION"""
    self.register(**register_arg)
    self.wait_until_body_is_loaded(timeout=2)
    
    # Assert url
    self.assertURLEqual(self.selenium.current_url, self.live_server_url + reverse('register'))
    
    # Assert message
    try:
      message = self.selenium.find_element(By.XPATH, '//div[@class="system-message"]')
    except NoSuchElementException:
      print("Message missing.")
  
    self.assertEqual(message.get_attribute("innerText"), "Username already taken.")
    

  def test_02_login(self):
    print("Running test_02_login.")
    
    """TEST REDIRECT FROM INDEX TO LOGIN"""
    self.selenium.get(f"{self.live_server_url}")
    self.wait_until_body_is_loaded(timeout=2)
    
    # Assert url
    self.assertURLEqual(self.selenium.current_url, self.live_server_url + reverse('login') + "?next=/")
    
    """TEST LOGIN UNSUCESSFUL"""
    self.login('harry', '123')
    self.wait_until_body_is_loaded(timeout=2)
    
    # Assert url
    self.assertURLEqual(self.selenium.current_url, self.live_server_url + reverse('login'))
    
    # Assert message
    try:
      message = self.selenium.find_element(By.XPATH, '//div[@class="system-message"]')
    except NoSuchElementException:
      print("Message missing.")
  
    self.assertEqual(message.get_attribute("innerText"), "Invalid username and/or password.")
    
    """TEST LOGIN SUCESSFUL"""
    self.login('harry', '1234')
    self.wait_until_body_is_loaded(timeout=2)
    
    # Assert url
    self.assertURLEqual(self.selenium.current_url, self.live_server_url + reverse('index'))
    
    
    
  def test_03_logout(self):
    print("Running test_03_logout.")
    
    self.login('harry', '1234')
    self.wait_until_body_is_loaded(timeout=2)
    # self.check_status("Check login action:", f"{self.live_server_url}/")
    
    try:
      logout_button = self.selenium.find_element(By.XPATH, '//p[contains(text(), "Logout")]')
    except NoSuchElementException:
      print("Logout button not found!")
    else:
      logout_button.click()
      
    # Assert url
    self.assertURLEqual(self.selenium.current_url, self.live_server_url + reverse('login') + "?next=/")
    
    
  def register(self, username, email, password, confirmation, last_name, first_name, date_of_birth):
    self.selenium.get(f"{self.live_server_url}/register")
    
    username_input = self.selenium.find_element(By.NAME, "username")
    username_input.send_keys(username)
    
    email_input = self.selenium.find_element(By.NAME, "email")
    email_input.send_keys(email)
    
    password_input = self.selenium.find_element(By.NAME, "password")
    password_input.send_keys(password)
    
    confirmation_input = self.selenium.find_element(By.NAME, "confirmation")
    confirmation_input.send_keys(confirmation)
    
    first_name_input = self.selenium.find_element(By.NAME, "first_name")
    first_name_input.send_keys(first_name)
    
    last_name_input = self.selenium.find_element(By.NAME, "last_name")
    last_name_input.send_keys(last_name)
    
    date_of_birth_input = self.selenium.find_element(By.NAME, "date_of_birth")
    date_of_birth_input.send_keys(date_of_birth)
    
    register_button = self.selenium.find_element(By.XPATH, '//input[@value="Register"]')
    register_button.click()
    
    
  def login(self, username, password):
    self.selenium.get(self.live_server_url)
    
    username_input = self.selenium.find_element(By.NAME, "username")
    username_input.send_keys(username)
    
    password_input = self.selenium.find_element(By.NAME, "password")
    password_input.send_keys(password)
    
    login_button = self.selenium.find_element(By.XPATH, '//input[@value="Login"]')
    login_button.click()
    
    
  def logout(self):
    self.selenium.get(f"{self.live_server_url}/logout")
    
    
  def check_status(self, message, target_url):
    print(message)
    self.wait_until_body_is_loaded(2)
    
    # Check url
    if self.selenium.current_url == target_url:
      print("Corrent url")
    else:
      print("Incorrect url")
      print(f"target: {target_url}")
      print(f"Current: {self.selenium.current_url}")
    
    # Check message
    try:
      message = self.selenium.find_element(By.XPATH, '//div[@class="system-message"]')
    except NoSuchElementException:
      print("No message.")
    else:
      print(message.get_attribute("innerText"))
    
    
  def wait_until_body_is_loaded(self, timeout):
    WebDriverWait(self.selenium, timeout).until(
      lambda driver: driver.find_element(By.TAG_NAME, "body")
    )