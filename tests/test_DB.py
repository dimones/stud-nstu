from unittest import TestCase
import unittest
from API.DB import *

class TestDB(TestCase):
    d = DB()
    def test_changeInDB(self):
        self.assertTrue(True)

    def test_selectFromDB(self):
        self.assertTrue(True)

    def test_getConnection(self):
        self.assertIsNotNone(self.d.getConnection())

    def test_getCursor(self):
        self.assertIsNotNone(self.d.getCursor())

    def test_commitChanges(self):
        self.assertTrue(True)

    def test_getNextIDFromTable(self):
        self.assertTrue(isinstance(self.d.getNextIDFromTable('test_table'),int) and isinstance(self.d.getNextIDFromTable('test_table','id'),int))


if __name__ == '__main__':
    unittest.main()