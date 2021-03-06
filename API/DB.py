import psycopg2,json,datetime
import psycopg2.extras
from psycopg2.extras import register_json

class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.strftime("%d.%m.%y")
        if isinstance(obj, map):
            return list(obj)
        return json.JSONEncoder.default(self, obj)

class DB:
    conn = None
    cursor = None
    def __init__(self):
        """
            Make connection
        """
        try:
            self.conn = psycopg2.connect(database="studnstu",user="yam",password="jmXQF97J",host="217.71.129.181",port=5432,
                                      cursor_factory=psycopg2.extras.DictCursor)
            self.cursor = self.conn.cursor()
            register_json(oid=3802, array_oid=3807)
        except Exception as e:
            print(e)
    def __del__(self):
        """
            Close connection
        """
        try:
            self.conn.close()
        except Exception as e:
            print(e)

    def changeInDB(self,sql,needIDs = False,needCommit = False):
        """
            Change data in DB
        :param sql: SQL insert/delete/update string
        :param needIDs: Returned id of inserted data
        :param needCommit: Need commit of data in table
        :return:
        """
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
            return e
    def selectFromDB(self,sql,needDict = True, needOne=False):
        """
        :param sql: SQL select string
        :param needDict: Do you need have a dict result?
        :param needOne: Need one of tuple result?
        :return: dict or tuple
        """
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

    def getConnection(self):
        """
            Get connection to DB
        :return: psycopg2.connection
        """
        return self.conn
    def getCursor(self):
        """
            Return cursor value of conn
        :return: psycopg2.cursor
        """
        return self.cursor
    def commitChanges(self):
        """
            Commit changes in DB after inserting/deleting/updating
        """
        try:
            self.conn.commit()
        except Exception as e:
            print(e)

    def getNextIDFromTable(self, table_name, serial_key = None) -> int:
        """
            Get next autoincremented ID from table_name
        :param table_name: name of table
        :param serial_key: name of autoincrement key in table
        :return: int id
        """
        print(table_name)
        try:
            if serial_key is None:
                self.cursor.execute("select setval(pg_get_serial_sequence('%s','id')"
                                    ",nextval(pg_get_serial_sequence('%s','id'))-1) as new_id;" % (table_name,table_name))
            else:
                self.cursor.execute("select setval(pg_get_serial_sequence('%s','%s'),"
                                    "nextval(pg_get_serial_sequence('%s','%s'))-1) as new_id;" % (table_name,serial_key,table_name,serial_key))
            return self.cursor.fetchone()[0]
        except Exception as e:
            print(e)

if __name__ == '__main__':
    d = DB()
    d.getCursor()
    t = d.getNextIDFromTable('PAGES')
    print(t)
    print(isinstance(t,int))
    pass
    # print(d.selectFromDB("SELECT setval(pg_get_serial_sequence('sites','id'),1)"))
    # print(d.getNextIDFromTable('sites',serial_key='id'))