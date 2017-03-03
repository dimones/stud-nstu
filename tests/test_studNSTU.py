from unittest import TestCase
from Studweb import app as application
import unittest
class TestStudNSTU(TestCase):
    global application
    def test_run(self):
        try:
            application.test_client()
            self.assertTrue(True)

        except Exception as e:
            print(e)
            self.fail()



if __name__ == '__main__':
    unittest.main()
