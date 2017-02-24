import json,sys,uuid,datetime
from .DB import *

class AuthHelper:
    device_token = None
    device_id = None
    def __init__(self,device_token,device_id):
        self.device_id = device_id
        self.device_token = device_token

class Auther:
    username = None
    password = None
    device_id = None
    a_helper = None
    def __init__(self, username, password, device_id):
        self.username = username
        self.password = password
        self.device_id = device_id


class AdminHelper(AuthHelper):
    db = DB()
    def isValid(self):
        try:
            return len(self.db.selectFromDB("SELECT id FROM mynstu.MYNSTU_ADMIN_TOKENS tok WHERE tok.device_id = '%s' "
                               "AND tok.device_token = '%s'" % (self.device_id, self.device_token))) > 0
        except Exception as e:
            print(str(e))
            return 'error happened'
class AdminAuther(Auther):
    db = DB()
    def tokenExist(self, device_token):
        try:
            return len(self.db.selectFromDB("SELECT id FROM MYNSTU_ADMIN_TOKENS WHERE device_token = '%s'" % device_token)) > 0
        except Exception as e:
            print(str(e), file=sys.stderr)

    def getNewToken(self):
        temp = uuid.uuid4().hex
        while self.tokenExist(temp):
            temp = uuid.uuid4().hex
        return temp
    def auth_user(self):
        begin = datetime.datetime.now()
        try:
            d = self.db.selectFromDB("SELECT id FROM mynstu.MYNSTU_ADMIN_USERS au WHERE au.username = '%s' and au.password='%s'"
                               %(self.username, self.password))
            user_id = -1
            if len(d) > 0:
                user_id = d[0]['id']
            else:
                return json.dumps({'succeed':False })
            ids = [element for tupl in self.db.selectFromDB("SELECT id FROM MYNSTU_ADMIN_TOKENS WHERE device_id='%s'" %
                                                            (self.device_id),needDict=False) for element in tupl]
            if len(ids) > 0:
                self.db.changeInDB("DELETE FROM MYNSTU_ADMIN_TOKENS WHERE id IN %s" % (
                        str(ids).replace('[', '(').replace(']', ')')))
            device_token = self.getNewToken()
            self.db.changeInDB("INSERT INTO MYNSTU_ADMIN_TOKENS(device_id,device_token,user_id) VALUES('%s','%s', %s)" % (
                    self.device_id, device_token, user_id),needCommit=True)
            return json.dumps({"succeed": True, 'device_token': device_token})
        except Exception as e:
            print('AdminAuther auth: %s' % str(e))