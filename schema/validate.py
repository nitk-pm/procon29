# coding: utf-8

import sys
import json
import codecs
import ruamel
import ruamel.yaml
import jsonschema

yaml = ruamel.yaml.YAML()

schema_file = sys.argv[1]
json_file = sys.argv[2]

with open (schema_file) as schema_yaml:
    schema = yaml.load(schema_yaml)
with codecs.open (json_file, 'r', 'utf-8') as target:
    jsonschema.validate(json.load(target), schema)
