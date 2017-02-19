from unittest import TestCase
import unittest
from API import DB

class TestDB(TestCase):
    d = DB.DB()
    def test_changeInDB(self):
        self.fail()

    def test_selectFromDB(self):
        self.fail()

    def test_closeConnection(self):
        self.fail()

    def test_getConnection(self):
        self.assertIsNotNone(self.d.getConnection())

    def test_getCursor(self):
        self.assertIsNotNone(self.d.getCursor())
        self.fail()

    def test_commitChanges(self):
        self.fail()

    def test_getNextIDFromTable(self):
        self.fail()
if __name__ == '__main__':
    unittest.main()