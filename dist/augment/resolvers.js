'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs2/helpers/interopRequireDefault');

var _Object$defineProperty = require('@babel/runtime-corejs2/core-js/object/define-property');

_Object$defineProperty(exports, '__esModule', {
  value: true
});

exports.extractResolversFromSchema = exports.augmentResolvers = void 0;

var _regenerator = _interopRequireDefault(
  require('@babel/runtime-corejs2/regenerator')
);

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/asyncToGenerator')
);

var _values = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/values')
);

var _keys = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/keys')
);

var _index = require('../index');

var _types = require('../augment/types/types');

var _federation = require('../federation');

/**
 * The main export for the generation of resolvers for the
 * Query and Mutation API. Prevent overwriting.
 */
var augmentResolvers = function augmentResolvers(_ref) {
  var generatedTypeMap = _ref.generatedTypeMap,
    operationTypeMap = _ref.operationTypeMap,
    typeExtensionDefinitionMap = _ref.typeExtensionDefinitionMap,
    resolvers = _ref.resolvers,
    _ref$config = _ref.config,
    config = _ref$config === void 0 ? {} : _ref$config;
  var isFederated = config.isFederated; // Persist and generate Query resolvers

  var queryTypeName = _types.OperationType.QUERY;
  var mutationTypeName = _types.OperationType.MUTATION;
  var subscriptionTypeName = _types.OperationType.SUBSCRIPTION;
  var queryType = operationTypeMap[queryTypeName];
  if (queryType) queryTypeName = queryType.name.value;
  var queryTypeExtensions = typeExtensionDefinitionMap[queryTypeName];

  if (queryType || (queryTypeExtensions && queryTypeExtensions.length)) {
    var queryResolvers =
      resolvers && resolvers[queryTypeName] ? resolvers[queryTypeName] : {};
    queryResolvers = possiblyAddResolvers({
      operationType: queryType,
      operationTypeExtensions: queryTypeExtensions,
      resolvers: queryResolvers,
      config: config,
      isFederated: isFederated
    });

    if ((0, _keys['default'])(queryResolvers).length) {
      resolvers[queryTypeName] = queryResolvers;

      if (isFederated) {
        resolvers = (0, _federation.generateBaseTypeReferenceResolvers)({
          queryResolvers: queryResolvers,
          resolvers: resolvers,
          config: config
        });
      }
    }
  }

  if ((0, _values['default'])(typeExtensionDefinitionMap).length) {
    if (isFederated) {
      resolvers = (0,
      _federation.generateNonLocalTypeExtensionReferenceResolvers)({
        resolvers: resolvers,
        generatedTypeMap: generatedTypeMap,
        typeExtensionDefinitionMap: typeExtensionDefinitionMap,
        queryTypeName: queryTypeName,
        mutationTypeName: mutationTypeName,
        subscriptionTypeName: subscriptionTypeName,
        config: config
      });
    }
  } // Persist and generate Mutation resolvers

  var mutationType = operationTypeMap[mutationTypeName];
  if (mutationType) mutationTypeName = mutationType.name.value;
  var mutationTypeExtensions = typeExtensionDefinitionMap[mutationTypeName];

  if (
    mutationType ||
    (mutationTypeExtensions && mutationTypeExtensions.length)
  ) {
    var mutationResolvers =
      resolvers && resolvers[mutationTypeName]
        ? resolvers[mutationTypeName]
        : {};
    mutationResolvers = possiblyAddResolvers({
      operationType: mutationType,
      operationTypeExtensions: mutationTypeExtensions,
      resolvers: mutationResolvers,
      config: config
    });

    if ((0, _keys['default'])(mutationResolvers).length > 0) {
      resolvers[mutationTypeName] = mutationResolvers;
    }
  } // Persist Subscription resolvers

  var subscriptionType = operationTypeMap[subscriptionTypeName];

  if (subscriptionType) {
    subscriptionTypeName = subscriptionType.name.value;
    var subscriptionResolvers =
      resolvers && resolvers[subscriptionTypeName]
        ? resolvers[subscriptionTypeName]
        : {};

    if ((0, _keys['default'])(subscriptionResolvers).length > 0) {
      resolvers[subscriptionTypeName] = subscriptionResolvers;
    }
  } // must implement __resolveInfo for every Interface type
  // we use "FRAGMENT_TYPE" key to identify the Interface implementation
  // type at runtime, so grab this value

  var derivedTypes = (0, _keys['default'])(generatedTypeMap).filter(function(
    e
  ) {
    return (
      generatedTypeMap[e].kind === 'InterfaceTypeDefinition' ||
      generatedTypeMap[e].kind === 'UnionTypeDefinition'
    );
  });
  derivedTypes.map(function(e) {
    resolvers[e] = {};

    resolvers[e]['__resolveType'] = function(obj, context, info) {
      return obj['FRAGMENT_TYPE'];
    };
  });
  return resolvers;
};

exports.augmentResolvers = augmentResolvers;

var getOperationFieldMap = function getOperationFieldMap(_ref2) {
  var operationType = _ref2.operationType,
    operationTypeExtensions = _ref2.operationTypeExtensions;
  var fieldMap = {};
  var fields = operationType ? operationType.fields : [];
  fields.forEach(function(field) {
    fieldMap[field.name.value] = true;
  });
  operationTypeExtensions.forEach(function(extension) {
    extension.fields.forEach(function(field) {
      fieldMap[field.name.value] = true;
    });
  });
  return fieldMap;
};
/**
 * Generates resolvers for a given operation type, if
 * any fields exist, for any resolver not provided
 */

var possiblyAddResolvers = function possiblyAddResolvers(_ref3) {
  var operationType = _ref3.operationType,
    _ref3$operationTypeEx = _ref3.operationTypeExtensions,
    operationTypeExtensions =
      _ref3$operationTypeEx === void 0 ? [] : _ref3$operationTypeEx,
    resolvers = _ref3.resolvers,
    config = _ref3.config;
  var fieldMap = getOperationFieldMap({
    operationType: operationType,
    operationTypeExtensions: operationTypeExtensions
  });
  (0, _keys['default'])(fieldMap).forEach(function(name) {
    // If not provided
    if (resolvers[name] === undefined) {
      resolvers[name] = /*#__PURE__*/ (function() {
        var _ref4 = (0, _asyncToGenerator2['default'])(
          /*#__PURE__*/ _regenerator['default'].mark(function _callee() {
            var _len,
              args,
              _key,
              _args = arguments;

            return _regenerator['default'].wrap(function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    for (
                      _len = _args.length, args = new Array(_len), _key = 0;
                      _key < _len;
                      _key++
                    ) {
                      args[_key] = _args[_key];
                    }

                    _context.next = 3;
                    return _index.neo4jgraphql.apply(
                      void 0,
                      args.concat([config.debug])
                    );

                  case 3:
                    return _context.abrupt('return', _context.sent);

                  case 4:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee);
          })
        );

        return function() {
          return _ref4.apply(this, arguments);
        };
      })();
    }
  });
  return resolvers;
};
/**
 * Extracts resolvers from a schema
 */

var extractResolversFromSchema = function extractResolversFromSchema(schema) {
  var _typeMap = schema && schema._typeMap ? schema._typeMap : {};

  var types = (0, _keys['default'])(_typeMap);
  var type = {};
  var schemaTypeResolvers = {};
  return types.reduce(function(acc, t) {
    // prevent extraction from schema introspection system keys
    if (
      t !== '__Schema' &&
      t !== '__Type' &&
      t !== '__TypeKind' &&
      t !== '__Field' &&
      t !== '__InputValue' &&
      t !== '__EnumValue' &&
      t !== '__Directive'
    ) {
      type = _typeMap[t]; // resolvers are stored on the field level at a .resolve key

      schemaTypeResolvers = extractFieldResolversFromSchemaType(type); // do not add unless there exists at least one field resolver for type

      if (schemaTypeResolvers) {
        acc[t] = schemaTypeResolvers;
      }
    }

    return acc;
  }, {});
};
/**
 * Extracts field resolvers from a given type taken
 * from a schema
 */

exports.extractResolversFromSchema = extractResolversFromSchema;

var extractFieldResolversFromSchemaType = function extractFieldResolversFromSchemaType(
  type
) {
  var fields = type._fields;
  var fieldKeys = fields ? (0, _keys['default'])(fields) : [];
  var fieldResolvers =
    fieldKeys.length > 0
      ? fieldKeys.reduce(function(acc, t) {
          // do not add entry for this field unless it has resolver
          if (fields[t].resolve !== undefined) {
            acc[t] = fields[t].resolve;
          }

          return acc;
        }, {})
      : undefined; // do not return value unless there exists at least 1 field resolver

  return fieldResolvers && (0, _keys['default'])(fieldResolvers).length > 0
    ? fieldResolvers
    : undefined;
};
