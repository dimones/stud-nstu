import psycopg2
import psycopg2.extras

class DB:
    conn = None
    cursor = None
    def __init__(self):
        try:
            self.conn = psycopg2.connect(database="studnstu",user="yam",password="jmXQF97J",host="217.71.129.181",port=5432,
                                      cursor_factory=psycopg2.extras.DictCursor)
            self.cursor = self.conn.cursor()
        except Exception as e:
            print(e)
    def __del__(self):
        try:
            self.conn.close()
        except Exception as e:
            print(e)

    def changeInDB(self,sql,needIDs = False,needCommit = False):
        try:
            if needIDs:
                sql += ' RETURNING id'
                self.cursor.execute(sql)
                _id = self.cursor.fetchone()[0]
                if needCommit:
                    self.conn.commit()
                return _id
            else:
                self.cursor.execute(sql)
                if needCommit:
                    self.conn.commit()
        except Exception as e:
            print(e)
    def selectFromDB(self,sql,needDict = False, needOne=False):
        try:
            self.cursor.execute(sql)
            if needDict:
                return [dict(record) for record in self.cursor]
            if needOne:
                return self.cursor.fetchone()
            else:
                return self.cursor.fetchall()
        except Exception as e:
            print(e)
    def closeConnection(self):
        try:
            self.conn.close()
        except Exception as e:
            print(e)
    def getConnection(self):
        return self.conn
    def getCursor(self):
        return self.cursor
    def commitChanges(self):
        try:
            self.conn.commit()
        except Exception as e:
            print(e)
    def getNextIDFromTable(self, table_name, serial_key = None):
        try:
            if serial_key is None:
                self.cursor.execute("select currval(pg_get_serial_sequence('%s', 'id')) as new_id;" % table_name)
            else:
                self.cursor.execute("select currval(pg_get_serial_sequence('%s', '%s')) as new_id;" % (table_name,serial_key))
            return self.cursor.fetchone()[0]
        except Exception as e:
            print(e)

if __name__ == '__main__':
    d = DB()
    print(d.selectFromDB("SELECT last_value FROM (SELECT pg_get_serial_sequence('sites','id'))"))
    # print(d.getNextIDFromTable('sites',serial_key='id'))