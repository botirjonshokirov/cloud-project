import sys

from flask import Flask, jsonify, request, make_response, send_file
from json import load
from datetime import datetime
from flask_cors import CORS
from os import path
import mongo_client

app = Flask(__name__)


@app.route('/api/v1.0/builds', methods=['GET'])
def getBuilds():
    filterParams = request.args.to_dict()
    builds, = mongo_client.get_database().get_collection("builds").find()
    builds = builds['builds']
    if not filterParams:
        return jsonify(builds)
    else:
        filteredBuilds = []
        for build in builds:
            isOK = True
            buildDate = datetime.strptime(build['date'], '%Y-%m-%d').date()
            for filterParam, filterValue in filterParams.iteritems():
                if not getattr(buildDate, filterParam) == int(filterValue):
                    isOK = False
                    break
            filteredBuilds.append(build) if isOK else []
        return jsonify(filteredBuilds)


@app.route('/api/v1.0/builds/<buildID>', methods=['GET'])
def getBuild(buildID):
    builds, = mongo_client.get_database().get_collection("builds").find()
    return jsonify([build for build in builds['builds'] if build['buildid'] == int(buildID)][0])


@app.route('/api/v1.0/builds/<buildID>', methods=['POST'])
def addUpdateBuild(buildData):
    mongo_client.get_database().get_collection("builds").insert_one({"builds": buildData})


@app.route('/api/v1.0/builds/<buildID>', methods=['DELETE'])
def deleteBuild(buildID):
    mongo_client.get_database().get_collection("builds").delete_one({"builds": buildID})


@app.route('/api/v1.0/components/<componentType>', methods=['GET'])
def getComponents(componentType):
    components, = mongo_client.get_database().get_collection("components").find()
    components = components.get(componentType, {})
    requestArgs = request.args.to_dict()
    if requestArgs:
        components = []
        for key, value in requestArgs.iteritems():
            value = int(value) if key in ('price', 'componentid') else value
            components += [component for component in components if value in component.values()]
        return jsonify(components)
    return jsonify(components)


@app.route('/api/v1.0/components/<componentType>/<componentID>', methods=['GET'])
def getComponentByID(componentType, componentID):
    components, = mongo_client.get_database().get_collection("components").find()
    components = components.get(componentType, {})
    component, = [c for c in components if c['componentid'] == int(componentID)]
    return jsonify(component)


@app.route('/api/v1.0/components/<componentType>/<componentID>', methods=['PATCH', 'POST'])
def addUpdateComponent(componentType, componentID):
    mongo_client.get_database().get_collection("components").insert_one({componentType: componentID})


@app.route('/api/v1.0/components/<componentType>/<componentID>', methods=["DELETE"])
def deleteComponent(componentType, componentID):
    mongo_client.get_database().get_collection("components").delete_one({"componentid": componentID})


@app.route('/img/<imageName>')
def getImage(imageName):
    filePath = path.join('img', imageName)
    if path.exists(filePath):
        return send_file(filePath, mimetype='image/gif')
    else:
        return make_response(jsonify({'error': 'Not found'}), 404)


cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

if __name__ == '__main__':
    CORS(app, resources={r'/*': {'origins': "*"}}, supports_credentials=True)
    app.run(debug=True)
