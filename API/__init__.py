from flask import Blueprint
api = Blueprint('api',__name__)
from .Admin import *
from .Methods import *
from .News import *