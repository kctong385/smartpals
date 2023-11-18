from django.test import TestCase, LiveServerTestCase
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait

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
    
    
  def setUp(self):
    print("setUp - This runs before each test method.")

  def tearDown(self):
    print("tearDown - This runs after each test method.")

  def test_01_register(self):
    print("Running test_01_register.")
    timeout = 2
    
    """TEST REDIRECT FROM INDEX TO LOGIN"""
    self.selenium.get(f"{self.live_server_url}")
    WebDriverWait(self.selenium, timeout).until(
      lambda driver: driver.find_element(By.TAG_NAME, "body")
    )
    # Check url
    self.assertEqual(self.selenium.current_url, f"{self.live_server_url}/login?next=/")
    
    """TEST LINK TO REGISTER"""
    self.selenium.find_element(By.XPATH, '//a[contains(text(), "Register here.")]').click()
    WebDriverWait(self.selenium, timeout).until(
      lambda driver: driver.find_element(By.TAG_NAME, "body")
    )
    # Check url
    self.assertEqual(self.selenium.current_url, f"{self.live_server_url}/register")
    
    """TEST REGISTER FAILED"""
    self.register("Harry", "harry@test.com", "1234", "123", "05/03/1985")
    
    WebDriverWait(self.selenium, timeout).until(
      lambda driver: driver.find_element(By.TAG_NAME, "body")
    )
    # Check url
    self.assertEqual(self.selenium.current_url, f"{self.live_server_url}/register")
    
    # Check message
    message_element = self.selenium.find_element(By.XPATH, '//div[contains(text(), "Passwords must match.")]')
    self.assertTrue(message_element)
    
    """TEST REGISTER SUCCESSFUL"""
    self.register("Harry", "harry@test.com", "1234", "1234", "05/03/1985")
    
    WebDriverWait(self.selenium, timeout).until(
      lambda driver: driver.find_element(By.TAG_NAME, "body")
    )
    # Check url
    self.assertEqual(self.selenium.current_url, f"{self.live_server_url}/")
    
    # Check username
    username_display = self.selenium.find_element(By.TAG_NAME, "strong")
    username_display_text = username_display.get_attribute("innerText")
    self.assertEqual(username_display_text, "Harry")
    


  def test_02_example2(self):
    print("Running test_example2.")
    
    
  def test_03_example2(self):
    print("Running test_example3.")
    
    
  def register(self, username, email, password, confirmation, date_of_birth):
    self.selenium.get(f"{self.live_server_url}/register")
    
    username_input = self.selenium.find_element(By.NAME, "username")
    username_input.send_keys(username)
    
    email_input = self.selenium.find_element(By.NAME, "email")
    email_input.send_keys(email)
    
    password_input = self.selenium.find_element(By.NAME, "password")
    password_input.send_keys(password)
    
    confirmation_input = self.selenium.find_element(By.NAME, "confirmation")
    confirmation_input.send_keys(confirmation)
    
    date_of_birth_input = self.selenium.find_element(By.NAME, "date_of_birth")
    date_of_birth_input.send_keys(date_of_birth)
    
    register_button = self.selenium.find_element(By.XPATH, '//input[@value="Register"]')
    register_button.click()