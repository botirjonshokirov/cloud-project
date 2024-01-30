import json

from pymongo.errors import OperationFailure
from pymongo import MongoClient


def get_database():
    connection_url = "mongodb://root:example@mongo:27017/?authMechanism=DEFAULT"
    client = MongoClient(connection_url)

    # Create the database for our example (we will use the same database throughout the tutorial
    return client['local']


def __validate_builds():
    db = get_database()
    try:
        db.validate_collection("builds")
    except OperationFailure:
        with open("builds.json") as f:
            builds_data = json.load(f)
        db.create_collection("builds")
        db['builds'].insert_one(builds_data)


def __validate_components():
    db = get_database()
    try:
        db.validate_collection("components")
    except OperationFailure:
        with open("components.json") as f:
            components_data = json.load(f)
        db.create_collection("components")
        db['components'].insert_one(components_data)


__validate_components()
__validate_builds()