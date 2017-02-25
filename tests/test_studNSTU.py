from unittest import TestCase
from Studweb import *
import unittest
class TestStudNSTU(TestCase):
    s = StudNSTU()
    def test_run(self):
        try:
            self.s.app.test_client()
            self.assertTrue(True)

        except Exception as e:
            print(e)
            self.fail()



if __name__ == '__main__':
    unittest.main()
