from unittest import TestCase
import unittest
from API import DB

class TestDB(TestCase):
    d = DB.DB()
    def test_changeInDB(self):
        self.assertTrue(True)

    def test_selectFromDB(self):
        self.assertTrue(True)

    def test_closeConnection(self):
        self.assertTrue(True)

    def test_getConnection(self):
        self.assertIsNotNone(self.d.getConnection())

    def test_getCursor(self):
        self.assertIsNotNone(self.d.getCursor())

    def test_commitChanges(self):
        self.assertTrue(True)

    def test_getNextIDFromTable(self):
        self.assertTrue(True)

if __name__ == '__main__':
    unittest.main()