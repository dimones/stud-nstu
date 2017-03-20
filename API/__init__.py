from flask import Blueprint

api = Blueprint('api',__name__)

from .Admin import *
from .Sites import *
from .News import *
from .Sidebars import *
from .Users import *
from .Forms import *
from .Pages import *