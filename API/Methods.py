from flask import *
from . import api
from .Auther import *
import json,sys,uuid,datetime
from .DB import *

#sites

@api.route('/api/admin/sites')
def test():
    pass
