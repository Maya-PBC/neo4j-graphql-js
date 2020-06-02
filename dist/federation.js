'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs2/helpers/interopRequireDefault');

var _Object$defineProperty2 = require('@babel/runtime-corejs2/core-js/object/define-property');

_Object$defineProperty2(exports, '__esModule', {
  value: true
});

exports.generateNonLocalTypeExtensionReferenceResolvers = exports.generateBaseTypeReferenceResolvers = exports.getFederatedOperationData = exports.setCompoundKeyFilter = exports.isFederatedOperation = exports.executeFederatedOperation = exports.NEO4j_GRAPHQL_SERVICE = void 0;

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/define-property')
);

var _defineProperties = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/define-properties')
);

var _getOwnPropertyDescriptors = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/get-own-property-descriptors')
);

var _getOwnPropertyDescriptor = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/get-own-property-descriptor')
);

var _getOwnPropertySymbols = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/get-own-property-symbols')
);

var _toPrimitive2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/symbol/to-primitive')
);

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/toConsumableArray')
);

var _defineProperty3 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/defineProperty')
);

var _values = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/values')
);

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/objectWithoutProperties')
);

var _typeof2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/typeof')
);

var _isArray = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/array/is-array')
);

var _entries = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/entries')
);

var _keys = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/keys')
);

var _regenerator = _interopRequireDefault(
  require('@babel/runtime-corejs2/regenerator')
);

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/slicedToArray')
);

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/asyncToGenerator')
);

var _graphql = require('graphql');

var _apolloServerErrors = require('apollo-server-errors');

var _ast = require('./augment/ast');

var _auth = require('./auth');

var _index = require('./index');

function ownKeys(object, enumerableOnly) {
  var keys = (0, _keys['default'])(object);
  if (_getOwnPropertySymbols['default']) {
    var symbols = (0, _getOwnPropertySymbols['default'])(object);
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return (0,
        _getOwnPropertyDescriptor['default'])(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        (0, _defineProperty3['default'])(target, key, source[key]);
      });
    } else if (_getOwnPropertyDescriptors['default']) {
      (0, _defineProperties['default'])(
        target,
        (0, _getOwnPropertyDescriptors['default'])(source)
      );
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        (0,
        _defineProperty2[
          'default'
        ])(target, key, (0, _getOwnPropertyDescriptor['default'])(source, key));
      });
    }
  }
  return target;
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, 'string');
  return (0, _typeof2['default'])(key) === 'symbol' ? key : String(key);
}

function _toPrimitive(input, hint) {
  if ((0, _typeof2['default'])(input) !== 'object' || input === null)
    return input;
  var prim = input[_toPrimitive2['default']];
  if (prim !== undefined) {
    var res = prim.call(input, hint || 'default');
    if ((0, _typeof2['default'])(res) !== 'object') return res;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (hint === 'string' ? String : Number)(input);
}

var NEO4j_GRAPHQL_SERVICE = 'Neo4jGraphQLService';
exports.NEO4j_GRAPHQL_SERVICE = NEO4j_GRAPHQL_SERVICE;
var CONTEXT_KEYS_PATH = '__'.concat(NEO4j_GRAPHQL_SERVICE);
var SERVICE_VARIABLE = '_SERVICE_';
var SERVICE_FIELDS = {
  ENTITIES: '_entities'
};
var SERVICE_FIELD_ARGUMENTS = {
  REPRESENTATIONS: 'representations'
};
var INTROSPECTION_FIELD = {
  TYPENAME: '__typename'
};
var REFERENCE_RESOLVER_NAME = '__resolveReference';

var executeFederatedOperation = /*#__PURE__*/ (function() {
  var _ref = (0, _asyncToGenerator2['default'])(
    /*#__PURE__*/ _regenerator['default'].mark(function _callee(_ref2) {
      var object,
        params,
        context,
        resolveInfo,
        debugFlag,
        requestError,
        _parseRepresentation,
        _parseRepresentation2,
        typeName,
        parentTypeData,
        schema,
        entityType,
        operationResolveInfo,
        operationContext,
        data;

      return _regenerator['default'].wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              (object = _ref2.object),
                (params = _ref2.params),
                (context = _ref2.context),
                (resolveInfo = _ref2.resolveInfo),
                (debugFlag = _ref2.debugFlag);
              requestError = (0, _auth.checkRequestError)(context);

              if (!requestError) {
                _context.next = 4;
                break;
              }

              throw new Error(requestError);

            case 4:
              (_parseRepresentation = parseRepresentation({
                object: object,
                resolveInfo: resolveInfo
              })),
                (_parseRepresentation2 = (0, _slicedToArray2['default'])(
                  _parseRepresentation,
                  2
                )),
                (typeName = _parseRepresentation2[0]),
                (parentTypeData = _parseRepresentation2[1]);
              schema = resolveInfo.schema;
              entityType = schema.getType(typeName);
              operationResolveInfo = buildResolveInfo({
                parentTypeData: parentTypeData,
                typeName: typeName,
                entityType: entityType,
                resolveInfo: resolveInfo,
                schema: schema
              });
              operationContext = setOperationContext({
                typeName: typeName,
                parentTypeData: parentTypeData,
                params: params,
                context: context,
                resolveInfo: resolveInfo
              });
              _context.next = 11;
              return (0, _index.neo4jgraphql)(
                {},
                params,
                operationContext,
                operationResolveInfo,
                debugFlag
              );

            case 11:
              data = _context.sent;
              return _context.abrupt(
                'return',
                decideOperationPayload({
                  data: data
                })
              );

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    })
  );

  return function executeFederatedOperation(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.executeFederatedOperation = executeFederatedOperation;

var isFederatedOperation = function isFederatedOperation(_ref3) {
  var _ref3$resolveInfo = _ref3.resolveInfo,
    resolveInfo = _ref3$resolveInfo === void 0 ? {} : _ref3$resolveInfo;
  return resolveInfo.fieldName === SERVICE_FIELDS.ENTITIES;
};

exports.isFederatedOperation = isFederatedOperation;

var setCompoundKeyFilter = function setCompoundKeyFilter(_ref4) {
  var _ref4$params = _ref4.params,
    params = _ref4$params === void 0 ? {} : _ref4$params,
    _ref4$compoundKeys = _ref4.compoundKeys,
    compoundKeys = _ref4$compoundKeys === void 0 ? {} : _ref4$compoundKeys;

  if ((0, _keys['default'])(compoundKeys).length) {
    var filterArgument = (0, _entries['default'])(compoundKeys).reduce(function(
      filterArgument,
      _ref5
    ) {
      var _ref6 = (0, _slicedToArray2['default'])(_ref5, 2),
        fieldName = _ref6[0],
        value = _ref6[1];

      // compound key for a list field of an object type uses AND filter
      if ((0, _isArray['default'])(value)) {
        filterArgument[fieldName] = {
          AND: value
        };
      } else {
        filterArgument[fieldName] = value;
      }

      return filterArgument;
    },
    {});
    params['filter'] = filterArgument;
  }

  return params;
};

exports.setCompoundKeyFilter = setCompoundKeyFilter;

var getFederatedOperationData = function getFederatedOperationData(_ref7) {
  var context = _ref7.context;

  var _ref8 = context[CONTEXT_KEYS_PATH] || {},
    _ref9 = (0, _slicedToArray2['default'])(_ref8, 3),
    entityKeys = _ref9[0],
    requiredData = _ref9[1],
    params = _ref9[2];

  var compoundKeys = {};
  var scalarKeys = {};
  (0, _entries['default'])(entityKeys).forEach(function(_ref10) {
    var _ref11 = (0, _slicedToArray2['default'])(_ref10, 2),
      serviceParam = _ref11[0],
      value = _ref11[1];

    if ((0, _typeof2['default'])(value) === 'object') {
      compoundKeys[serviceParam] = value;
    } else {
      scalarKeys[serviceParam] = value;
    }
  });
  return {
    scalarKeys: scalarKeys,
    compoundKeys: compoundKeys,
    requiredData: requiredData,
    params: params
  };
};

exports.getFederatedOperationData = getFederatedOperationData;

var setOperationContext = function setOperationContext(_ref12) {
  var typeName = _ref12.typeName,
    _ref12$context = _ref12.context,
    context = _ref12$context === void 0 ? {} : _ref12$context,
    _ref12$parentTypeData = _ref12.parentTypeData,
    parentTypeData =
      _ref12$parentTypeData === void 0 ? {} : _ref12$parentTypeData,
    _ref12$params = _ref12.params,
    params = _ref12$params === void 0 ? {} : _ref12$params,
    resolveInfo = _ref12.resolveInfo;
  var entityType = resolveInfo.schema.getType(typeName);
  var extensionASTNodes = entityType.extensionASTNodes;
  var keyFieldMap = buildTypeExtensionKeyFieldMap({
    entityType: entityType,
    extensionASTNodes: extensionASTNodes
  });
  var requiredFieldMap = getTypeExtensionRequiredFieldMap({
    parentTypeData: parentTypeData,
    keyFieldMap: keyFieldMap
  });

  var _Object$entries$reduc = (0, _entries['default'])(parentTypeData).reduce(
      function(_ref13, _ref14) {
        var _ref15 = (0, _slicedToArray2['default'])(_ref13, 2),
          keyData = _ref15[0],
          requiredData = _ref15[1];

        var _ref16 = (0, _slicedToArray2['default'])(_ref14, 2),
          name = _ref16[0],
          value = _ref16[1];

        if (keyFieldMap[name]) {
          keyData[name] = value;
        } else if (requiredFieldMap[name]) {
          requiredData[name] = value;
        }

        return [keyData, requiredData];
      },
      [{}, {}]
    ),
    _Object$entries$reduc2 = (0, _slicedToArray2['default'])(
      _Object$entries$reduc,
      2
    ),
    keyData = _Object$entries$reduc2[0],
    requiredData = _Object$entries$reduc2[1];

  context[CONTEXT_KEYS_PATH] = [keyData, requiredData, params];
  return context;
};

var parseRepresentation = function parseRepresentation(_ref17) {
  var _ref17$object = _ref17.object,
    object = _ref17$object === void 0 ? {} : _ref17$object,
    resolveInfo = _ref17.resolveInfo;
  var _INTROSPECTION_FIELD$ = INTROSPECTION_FIELD.TYPENAME,
    typeName = object[_INTROSPECTION_FIELD$],
    fieldData = (0, _objectWithoutProperties2['default'])(
      object,
      [_INTROSPECTION_FIELD$].map(_toPropertyKey)
    );

  if (!typeName) {
    // Set default
    typeName = getEntityTypeName({
      resolveInfo: resolveInfo
    });
  } // Error if still no typeName

  if (typeName === undefined) {
    throw new _apolloServerErrors.ApolloError('Missing __typename key');
  } // Prepare provided key and required field data
  // for translation, removing nulls

  var parentTypeData = getDefinedKeys({
    fieldData: fieldData
  });
  return [typeName, parentTypeData];
};

var getEntityTypeName = function getEntityTypeName(_ref18) {
  var _ref18$resolveInfo = _ref18.resolveInfo,
    resolveInfo = _ref18$resolveInfo === void 0 ? {} : _ref18$resolveInfo;
  var operation = resolveInfo.operation || {};
  var rootSelection = operation.selectionSet
    ? operation.selectionSet.selections[0]
    : {};
  var entityFragment = rootSelection.selectionSet
    ? rootSelection.selectionSet.selections[0]
    : {};
  var typeCondition = entityFragment
    ? entityFragment.typeCondition.name.value
    : undefined;
  return typeCondition;
};

var getDefinedKeys = function getDefinedKeys(_ref19) {
  var _ref19$fieldData = _ref19.fieldData,
    fieldData = _ref19$fieldData === void 0 ? {} : _ref19$fieldData,
    _ref19$parentTypeData = _ref19.parentTypeData,
    parentTypeData =
      _ref19$parentTypeData === void 0 ? {} : _ref19$parentTypeData;
  (0, _entries['default'])(fieldData).forEach(function(_ref20) {
    var _ref21 = (0, _slicedToArray2['default'])(_ref20, 2),
      key = _ref21[0],
      value = _ref21[1];

    var isList = (0, _isArray['default'])(value);
    var isNotEmptyList = !isList || value.length;

    if (
      key !== INTROSPECTION_FIELD.TYPENAME &&
      value !== null &&
      isNotEmptyList
    ) {
      // When no value is returned for a field in a compound key
      // it's value is null and should be removed to prevent a
      // _not filter translation
      if (!isList && (0, _typeof2['default'])(value) === 'object') {
        var definedKeys = getDefinedKeys({
          fieldData: value
        }); // Keep it if at least one key has a valid value

        if (definedKeys && (0, _values['default'])(definedKeys).length) {
          parentTypeData[key] = definedKeys;
        }
      } else {
        parentTypeData[key] = value;
      }
    }
  });
  return parentTypeData;
};

var buildTypeExtensionKeyFieldMap = function buildTypeExtensionKeyFieldMap(
  _ref22
) {
  var _ref22$extensionASTNo = _ref22.extensionASTNodes,
    extensionASTNodes =
      _ref22$extensionASTNo === void 0 ? [] : _ref22$extensionASTNo,
    _ref22$entityType = _ref22.entityType,
    entityType = _ref22$entityType === void 0 ? {} : _ref22$entityType;
  var entityTypeAst = entityType.astNode;
  var entityTypeDirectives = entityTypeAst.directives || [];
  var keyFieldMap = getFederationDirectiveFields({
    directives: entityTypeDirectives,
    directiveName: 'key'
  });
  extensionASTNodes.map(function(type) {
    var directives = type.directives;
    keyFieldMap = getFederationDirectiveFields({
      directives: directives,
      keyFieldMap: keyFieldMap,
      directiveName: 'key'
    });
  });
  return keyFieldMap;
};

var getTypeExtensionRequiredFieldMap = function getTypeExtensionRequiredFieldMap(
  _ref23
) {
  var _ref23$parentTypeData = _ref23.parentTypeData,
    parentTypeData =
      _ref23$parentTypeData === void 0 ? {} : _ref23$parentTypeData,
    _ref23$keyFieldMap = _ref23.keyFieldMap,
    keyFieldMap = _ref23$keyFieldMap === void 0 ? {} : _ref23$keyFieldMap;
  // Infers that any entity field value which is not a key
  // is provided given the use of a @requires directive
  var requiredFieldMap = {};
  (0, _keys['default'])(parentTypeData).forEach(function(fieldName) {
    if (keyFieldMap[fieldName] === undefined) {
      requiredFieldMap[fieldName] = true;
    }
  });
  return requiredFieldMap;
};

var getFederationDirectiveFields = function getFederationDirectiveFields(
  _ref24
) {
  var _ref24$directives = _ref24.directives,
    directives = _ref24$directives === void 0 ? [] : _ref24$directives,
    _ref24$keyFieldMap = _ref24.keyFieldMap,
    keyFieldMap = _ref24$keyFieldMap === void 0 ? {} : _ref24$keyFieldMap,
    _ref24$directiveName = _ref24.directiveName,
    directiveName = _ref24$directiveName === void 0 ? '' : _ref24$directiveName;
  directives.forEach(function(directive) {
    var name = directive.name.value;

    if (name === directiveName) {
      var fields = directive.arguments.find(function(arg) {
        return arg.name.value === 'fields';
      });

      if (fields) {
        var fieldsArgument = fields.value.value;
        var parsedKeyFields = (0, _graphql.parse)(
          '{ '.concat(fieldsArgument, ' }')
        );
        var definitions = parsedKeyFields.definitions;
        var selections = definitions[0].selectionSet.selections;
        selections.forEach(function(field) {
          var name = field.name.value;
          keyFieldMap[name] = true;
        });
      }
    }
  });
  return keyFieldMap;
};

var buildArguments = function buildArguments(_ref25) {
  var entityType = _ref25.entityType,
    parentTypeData = _ref25.parentTypeData,
    resolveInfo = _ref25.resolveInfo;
  var entityFields = entityType.getFields();
  var _resolveInfo$variable = resolveInfo.variableValues,
    _SERVICE_FIELD_ARGUME = SERVICE_FIELD_ARGUMENTS.REPRESENTATIONS,
    representations = _resolveInfo$variable[_SERVICE_FIELD_ARGUME],
    variableValues = (0, _objectWithoutProperties2['default'])(
      _resolveInfo$variable,
      [_SERVICE_FIELD_ARGUME].map(_toPropertyKey)
    );
  var operation = resolveInfo.operation;
  var variableDefinitions = operation.variableDefinitions.filter(function(
    _ref26
  ) {
    var variable = _ref26.variable;
    return variable.name.value !== SERVICE_FIELD_ARGUMENTS.REPRESENTATIONS;
  });

  var _Object$values$reduce = (0, _values['default'])(entityFields).reduce(
      function(_ref27, field) {
        var _ref28 = (0, _slicedToArray2['default'])(_ref27, 3),
          keyFieldArguments = _ref28[0],
          keyVariableDefinitions = _ref28[1],
          keyVariableValues = _ref28[2];

        var astNode = field.astNode;
        var name = astNode.name.value;
        var type = astNode.type;

        if (
          (0, _graphql.isScalarType)(field.type) ||
          (0, _graphql.isEnumType)(field.type)
        ) {
          var hasKeyFieldArgument = parentTypeData[name] !== undefined;

          if (hasKeyFieldArgument) {
            var serviceVariableName = ''.concat(SERVICE_VARIABLE).concat(name);
            keyVariableValues[serviceVariableName] = parentTypeData[name];
            keyFieldArguments.push(
              (0, _ast.buildArgument)({
                name: (0, _ast.buildName)({
                  name: name
                }),
                value: (0, _ast.buildName)({
                  name: '$'.concat(serviceVariableName)
                })
              })
            ); // keyVariableDefinitions are not currently used but could be
            // so they're built here for now and we scope the variable name

            keyVariableDefinitions.push(
              (0, _ast.buildVariableDefinition)({
                variable: (0, _ast.buildVariable)({
                  name: (0, _ast.buildName)({
                    name: serviceVariableName
                  })
                }),
                type: type
              })
            );
          }
        }

        return [keyFieldArguments, keyVariableDefinitions, keyVariableValues];
      },
      [[], [], {}]
    ),
    _Object$values$reduce2 = (0, _slicedToArray2['default'])(
      _Object$values$reduce,
      3
    ),
    keyFieldArguments = _Object$values$reduce2[0],
    keyVariableDefinitions = _Object$values$reduce2[1],
    keyVariableValues = _Object$values$reduce2[2];

  var mergedVariableValues = _objectSpread(
    {},
    keyVariableValues,
    {},
    variableValues
  );

  variableDefinitions.unshift.apply(
    variableDefinitions,
    (0, _toConsumableArray2['default'])(keyVariableDefinitions)
  );
  return [keyFieldArguments, variableDefinitions, mergedVariableValues];
};

var getSelectionSet = function getSelectionSet(_ref29) {
  var typeName = _ref29.typeName,
    keyFieldArguments = _ref29.keyFieldArguments,
    resolveInfo = _ref29.resolveInfo;
  var selectionSet = {};

  if (resolveInfo.fieldNodes) {
    selectionSet = resolveInfo.fieldNodes[0].selectionSet; // Get the selections inside the fragment provided on the entity type

    selectionSet = selectionSet.selections[0].selectionSet;
    selectionSet = (0, _ast.buildSelectionSet)({
      selections: [
        (0, _ast.buildFieldSelection)({
          name: (0, _ast.buildName)({
            name: typeName
          }),
          args: keyFieldArguments,
          selectionSet: selectionSet
        })
      ]
    });
  }

  if (!(0, _keys['default'])(selectionSet).length) {
    throw new _apolloServerErrors.ApolloError(
      'Failed to extract the expected selectionSet for the entity '.concat(
        typeName
      )
    );
  }

  return selectionSet;
};

var buildResolveInfo = function buildResolveInfo(_ref30) {
  var parentTypeData = _ref30.parentTypeData,
    typeName = _ref30.typeName,
    entityType = _ref30.entityType,
    resolveInfo = _ref30.resolveInfo,
    schema = _ref30.schema;
  var fieldName = typeName;
  var path = {
    key: typeName
  };

  var _buildArguments = buildArguments({
      entityType: entityType,
      parentTypeData: parentTypeData,
      resolveInfo: resolveInfo
    }),
    _buildArguments2 = (0, _slicedToArray2['default'])(_buildArguments, 3),
    keyFieldArguments = _buildArguments2[0],
    variableDefinitions = _buildArguments2[1],
    variableValues = _buildArguments2[2];

  var selectionSet = getSelectionSet({
    typeName: typeName,
    keyFieldArguments: keyFieldArguments,
    resolveInfo: resolveInfo
  });
  var fieldNodes = selectionSet.selections;
  var operation = (0, _ast.buildOperationDefinition)({
    operation: 'query',
    name: (0, _ast.buildName)({
      name: NEO4j_GRAPHQL_SERVICE
    }),
    selectionSet: selectionSet,
    variableDefinitions: variableDefinitions
  }); // Assume a list query and extract in decideOperationPayload

  var returnType = new _graphql.GraphQLList(entityType);
  return {
    fieldName: fieldName,
    fieldNodes: fieldNodes,
    returnType: returnType,
    path: path,
    schema: schema,
    operation: operation,
    variableValues: variableValues // Unused by neo4jgraphql translation
    // parentType: undefined,
    // fragments: undefined,
    // rootValue: undefined
  };
};

var decideOperationPayload = function decideOperationPayload(_ref31) {
  var data = _ref31.data;
  var dataExists = data !== undefined;
  var isListData = dataExists && (0, _isArray['default'])(data);

  if (dataExists && isListData && data.length) {
    data = data[0];
  }

  return data;
};

var generateBaseTypeReferenceResolvers = function generateBaseTypeReferenceResolvers(
  _ref32
) {
  var _ref32$queryResolvers = _ref32.queryResolvers,
    queryResolvers =
      _ref32$queryResolvers === void 0 ? {} : _ref32$queryResolvers,
    _ref32$resolvers = _ref32.resolvers,
    resolvers = _ref32$resolvers === void 0 ? {} : _ref32$resolvers,
    config = _ref32.config;
  (0, _keys['default'])(queryResolvers).forEach(function(typeName) {
    // Initialize type resolver object
    if (resolvers[typeName] === undefined) resolvers[typeName] = {}; // If not provided

    if (resolvers[typeName][REFERENCE_RESOLVER_NAME] === undefined) {
      resolvers[typeName][REFERENCE_RESOLVER_NAME] = /*#__PURE__*/ (function() {
        var _ref33 = (0, _asyncToGenerator2['default'])(
          /*#__PURE__*/ _regenerator['default'].mark(function _callee2(
            object,
            context,
            resolveInfo
          ) {
            return _regenerator['default'].wrap(function _callee2$(_context2) {
              while (1) {
                switch ((_context2.prev = _context2.next)) {
                  case 0:
                    _context2.next = 2;
                    return (0, _index.neo4jgraphql)(
                      object,
                      {},
                      context,
                      resolveInfo,
                      config.debug
                    );

                  case 2:
                    return _context2.abrupt('return', _context2.sent);

                  case 3:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2);
          })
        );

        return function(_x2, _x3, _x4) {
          return _ref33.apply(this, arguments);
        };
      })();
    }
  });
  return resolvers;
};

exports.generateBaseTypeReferenceResolvers = generateBaseTypeReferenceResolvers;

var generateNonLocalTypeExtensionReferenceResolvers = function generateNonLocalTypeExtensionReferenceResolvers(
  _ref34
) {
  var resolvers = _ref34.resolvers,
    generatedTypeMap = _ref34.generatedTypeMap,
    typeExtensionDefinitionMap = _ref34.typeExtensionDefinitionMap,
    queryTypeName = _ref34.queryTypeName,
    mutationTypeName = _ref34.mutationTypeName,
    subscriptionTypeName = _ref34.subscriptionTypeName,
    config = _ref34.config;
  (0, _keys['default'])(typeExtensionDefinitionMap).forEach(function(typeName) {
    if (
      typeName !== queryTypeName &&
      typeName !== mutationTypeName &&
      typeName !== subscriptionTypeName
    ) {
      if (generatedTypeMap[typeName] === undefined) {
        // Initialize type resolver object
        if (resolvers[typeName] === undefined) resolvers[typeName] = {}; // If not provided

        if (resolvers[typeName][REFERENCE_RESOLVER_NAME] === undefined) {
          resolvers[typeName][
            REFERENCE_RESOLVER_NAME
          ] = /*#__PURE__*/ (function() {
            var _ref35 = (0, _asyncToGenerator2['default'])(
              /*#__PURE__*/ _regenerator['default'].mark(function _callee3(
                object,
                context,
                resolveInfo
              ) {
                var entityData;
                return _regenerator['default'].wrap(function _callee3$(
                  _context3
                ) {
                  while (1) {
                    switch ((_context3.prev = _context3.next)) {
                      case 0:
                        _context3.next = 2;
                        return (0, _index.neo4jgraphql)(
                          object,
                          {},
                          context,
                          resolveInfo,
                          config.debug
                        );

                      case 2:
                        entityData = _context3.sent;
                        return _context3.abrupt(
                          'return',
                          _objectSpread({}, object, {}, entityData)
                        );

                      case 4:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                },
                _callee3);
              })
            );

            return function(_x5, _x6, _x7) {
              return _ref35.apply(this, arguments);
            };
          })();
        }
      }
    }
  });
  return resolvers;
};

exports.generateNonLocalTypeExtensionReferenceResolvers = generateNonLocalTypeExtensionReferenceResolvers;
