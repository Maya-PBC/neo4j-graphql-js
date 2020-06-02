'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs2/helpers/interopRequireDefault');

var _Object$defineProperty = require('@babel/runtime-corejs2/core-js/object/define-property');

_Object$defineProperty(exports, '__esModule', {
  value: true
});

exports.neo4jgraphql = neo4jgraphql;
exports.cypherQuery = cypherQuery;
exports.cypherMutation = cypherMutation;
exports.cypher = exports.inferSchema = exports.makeAugmentedSchema = exports.augmentSchema = exports.augmentTypeDefs = void 0;

var _regenerator = _interopRequireDefault(
  require('@babel/runtime-corejs2/regenerator')
);

var _stringify = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/json/stringify')
);

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/slicedToArray')
);

var _objectWithoutProperties2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/objectWithoutProperties')
);

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/asyncToGenerator')
);

var _graphql = require('graphql');

var _Neo4jSchemaTree = _interopRequireDefault(
  require('./neo4j-schema/Neo4jSchemaTree')
);

var _graphQLMapper = _interopRequireDefault(
  require('./neo4j-schema/graphQLMapper')
);

var _auth = require('./auth');

var _translate = require('./translate');

var _debug = _interopRequireDefault(require('debug'));

var _utils = require('./utils');

var _augment = require('./augment/augment');

var _types = require('./augment/types/types');

var _ast = require('./augment/ast');

var _directives = require('./augment/directives');

var _federation = require('./federation');

var neo4jGraphQLVersion = require('../package.json').version;

var debug = (0, _debug['default'])('neo4j-graphql-js');

function neo4jgraphql(_x, _x2, _x3, _x4, _x5) {
  return _neo4jgraphql.apply(this, arguments);
}

function _neo4jgraphql() {
  _neo4jgraphql = (0, _asyncToGenerator2['default'])(
    /*#__PURE__*/ _regenerator['default'].mark(function _callee(
      object,
      params,
      context,
      resolveInfo,
      debugFlag
    ) {
      var query,
        cypherParams,
        cypherFunction,
        _cypherFunction,
        _cypherFunction2,
        session,
        result;

      return _regenerator['default'].wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                if (
                  !(0, _federation.isFederatedOperation)({
                    resolveInfo: resolveInfo
                  })
                ) {
                  _context.next = 6;
                  break;
                }

                _context.next = 3;
                return (0, _federation.executeFederatedOperation)({
                  object: object,
                  params: params,
                  context: context,
                  resolveInfo: resolveInfo,
                  debugFlag: debugFlag
                });

              case 3:
                return _context.abrupt('return', _context.sent);

              case 6:
                if (!(0, _auth.checkRequestError)(context)) {
                  _context.next = 8;
                  break;
                }

                throw new Error((0, _auth.checkRequestError)(context));

              case 8:
                if (context.driver) {
                  _context.next = 10;
                  break;
                }

                throw new Error(
                  "No Neo4j JavaScript driver instance provided. Please ensure a Neo4j JavaScript driver instance is injected into the context object at the key 'driver'."
                );

              case 10:
                cypherFunction = (0, _utils.isMutation)(resolveInfo)
                  ? cypherMutation
                  : cypherQuery;
                _cypherFunction = cypherFunction(
                  params,
                  context,
                  resolveInfo,
                  debugFlag
                );
                _cypherFunction2 = (0, _slicedToArray2['default'])(
                  _cypherFunction,
                  2
                );
                query = _cypherFunction2[0];
                cypherParams = _cypherFunction2[1];

                if (debugFlag) {
                  console.log(
                    '\n  Deprecation Warning: Remove `debug` parameter and use an environment variable\n  instead: `DEBUG=neo4j-graphql-js`.\n      '
                  );
                  console.log(query);
                  console.log(
                    (0, _stringify['default'])(cypherParams, null, 2)
                  );
                }

                debug('%s', query);
                debug('%s', (0, _stringify['default'])(cypherParams, null, 2));
                context.driver._userAgent = 'neo4j-graphql-js/'.concat(
                  neo4jGraphQLVersion
                );

                if (context.neo4jDatabase) {
                  // database is specified in context object
                  try {
                    // connect to the specified database
                    // must be using 4.x version of driver
                    session = context.driver.session({
                      database: context.neo4jDatabase
                    });
                  } catch (e) {
                    // error - not using a 4.x version of driver!
                    // fall back to default database
                    session = context.driver.session();
                  }
                } else {
                  // no database specified
                  session = context.driver.session();
                }

                _context.prev = 20;

                if (!(0, _utils.isMutation)(resolveInfo)) {
                  _context.next = 27;
                  break;
                }

                _context.next = 24;
                return session.writeTransaction(function(tx) {
                  return tx.run(query, cypherParams);
                });

              case 24:
                result = _context.sent;
                _context.next = 30;
                break;

              case 27:
                _context.next = 29;
                return session.readTransaction(function(tx) {
                  return tx.run(query, cypherParams);
                });

              case 29:
                result = _context.sent;

              case 30:
                _context.prev = 30;
                session.close();
                return _context.finish(30);

              case 33:
                return _context.abrupt(
                  'return',
                  (0, _utils.extractQueryResult)(result, resolveInfo.returnType)
                );

              case 34:
              case 'end':
                return _context.stop();
            }
          }
        },
        _callee,
        null,
        [[20, , 30, 33]]
      );
    })
  );
  return _neo4jgraphql.apply(this, arguments);
}

function cypherQuery(_ref, context, resolveInfo) {
  var _ref$first = _ref.first,
    first = _ref$first === void 0 ? -1 : _ref$first,
    _ref$offset = _ref.offset,
    offset = _ref$offset === void 0 ? 0 : _ref$offset,
    _id = _ref._id,
    orderBy = _ref.orderBy,
    otherParams = (0, _objectWithoutProperties2['default'])(_ref, [
      'first',
      'offset',
      '_id',
      'orderBy'
    ]);

  var _typeIdentifiers = (0, _utils.typeIdentifiers)(resolveInfo.returnType),
    typeName = _typeIdentifiers.typeName,
    variableName = _typeIdentifiers.variableName;

  var schemaType = resolveInfo.schema.getType(typeName);
  var selections = (0, _utils.getPayloadSelections)(resolveInfo);
  return (0, _translate.translateQuery)({
    resolveInfo: resolveInfo,
    context: context,
    schemaType: schemaType,
    selections: selections,
    variableName: variableName,
    typeName: typeName,
    first: first,
    offset: offset,
    _id: _id,
    orderBy: orderBy,
    otherParams: otherParams
  });
}

function cypherMutation(_ref2, context, resolveInfo) {
  var _ref2$first = _ref2.first,
    first = _ref2$first === void 0 ? -1 : _ref2$first,
    _ref2$offset = _ref2.offset,
    offset = _ref2$offset === void 0 ? 0 : _ref2$offset,
    _id = _ref2._id,
    orderBy = _ref2.orderBy,
    otherParams = (0, _objectWithoutProperties2['default'])(_ref2, [
      'first',
      'offset',
      '_id',
      'orderBy'
    ]);

  var _typeIdentifiers2 = (0, _utils.typeIdentifiers)(resolveInfo.returnType),
    typeName = _typeIdentifiers2.typeName,
    variableName = _typeIdentifiers2.variableName;

  var schemaType = resolveInfo.schema.getType(typeName);
  var selections = (0, _utils.getPayloadSelections)(resolveInfo);
  return (0, _translate.translateMutation)({
    resolveInfo: resolveInfo,
    context: context,
    schemaType: schemaType,
    selections: selections,
    variableName: variableName,
    typeName: typeName,
    first: first,
    offset: offset,
    otherParams: otherParams
  });
}

var augmentTypeDefs = function augmentTypeDefs(typeDefs) {
  var config =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  config.query = false;
  config.mutation = false;
  if (config.isFederated === undefined) config.isFederated = false;
  var isParsedTypeDefs = (0, _types.isSchemaDocument)({
    definition: typeDefs
  });
  var definitions = [];

  if (isParsedTypeDefs) {
    // Print if we recieved parsed type definitions in a GraphQL Document
    definitions = typeDefs.definitions;
  } else {
    // Otherwise parse the SDL and get its definitions
    definitions = (0, _graphql.parse)(typeDefs).definitions;
  }

  var generatedTypeMap = {};

  var _mapDefinitions = (0, _augment.mapDefinitions)({
      definitions: definitions,
      config: config
    }),
    _mapDefinitions2 = (0, _slicedToArray2['default'])(_mapDefinitions, 5),
    typeDefinitionMap = _mapDefinitions2[0],
    typeExtensionDefinitionMap = _mapDefinitions2[1],
    directiveDefinitionMap = _mapDefinitions2[2],
    operationTypeMap = _mapDefinitions2[3],
    schemaTypeDefinition = _mapDefinitions2[4];

  var _augmentTypes = (0, _types.augmentTypes)({
    typeDefinitionMap: typeDefinitionMap,
    typeExtensionDefinitionMap: typeExtensionDefinitionMap,
    generatedTypeMap: generatedTypeMap,
    operationTypeMap: operationTypeMap,
    config: config
  });

  var _augmentTypes2 = (0, _slicedToArray2['default'])(_augmentTypes, 3);

  typeExtensionDefinitionMap = _augmentTypes2[0];
  generatedTypeMap = _augmentTypes2[1];
  operationTypeMap = _augmentTypes2[2];

  var _augmentDirectiveDefi = (0, _directives.augmentDirectiveDefinitions)({
    typeDefinitionMap: generatedTypeMap,
    directiveDefinitionMap: directiveDefinitionMap,
    config: config
  });

  var _augmentDirectiveDefi2 = (0, _slicedToArray2['default'])(
    _augmentDirectiveDefi,
    2
  );

  typeDefinitionMap = _augmentDirectiveDefi2[0];
  directiveDefinitionMap = _augmentDirectiveDefi2[1];
  var mergedDefinitions = (0, _augment.mergeDefinitionMaps)({
    generatedTypeMap: generatedTypeMap,
    typeExtensionDefinitionMap: typeExtensionDefinitionMap,
    operationTypeMap: operationTypeMap,
    directiveDefinitionMap: directiveDefinitionMap,
    schemaTypeDefinition: schemaTypeDefinition
  });
  var transformedDefinitions = (0, _types.transformNeo4jTypes)({
    definitions: mergedDefinitions,
    config: config
  });
  var documentAST = (0, _ast.buildDocument)({
    definitions: transformedDefinitions
  });

  if (config.isFederated === true) {
    return documentAST;
  }

  return (0, _graphql.print)(documentAST);
};

exports.augmentTypeDefs = augmentTypeDefs;

var augmentSchema = function augmentSchema(schema, config) {
  return (0, _augment.augmentedSchema)(schema, config);
};

exports.augmentSchema = augmentSchema;

var makeAugmentedSchema = function makeAugmentedSchema(_ref3) {
  var schema = _ref3.schema,
    typeDefs = _ref3.typeDefs,
    _ref3$resolvers = _ref3.resolvers,
    resolvers = _ref3$resolvers === void 0 ? {} : _ref3$resolvers,
    logger = _ref3.logger,
    _ref3$allowUndefinedI = _ref3.allowUndefinedInResolve,
    allowUndefinedInResolve =
      _ref3$allowUndefinedI === void 0 ? false : _ref3$allowUndefinedI,
    _ref3$resolverValidat = _ref3.resolverValidationOptions,
    resolverValidationOptions =
      _ref3$resolverValidat === void 0 ? {} : _ref3$resolverValidat,
    _ref3$directiveResolv = _ref3.directiveResolvers,
    directiveResolvers =
      _ref3$directiveResolv === void 0 ? null : _ref3$directiveResolv,
    _ref3$schemaDirective = _ref3.schemaDirectives,
    schemaDirectives =
      _ref3$schemaDirective === void 0 ? {} : _ref3$schemaDirective,
    _ref3$parseOptions = _ref3.parseOptions,
    parseOptions = _ref3$parseOptions === void 0 ? {} : _ref3$parseOptions,
    _ref3$inheritResolver = _ref3.inheritResolversFromInterfaces,
    inheritResolversFromInterfaces =
      _ref3$inheritResolver === void 0 ? false : _ref3$inheritResolver,
    config = _ref3.config;

  if (schema) {
    return (0, _augment.augmentedSchema)(schema, config);
  }

  if (!typeDefs) throw new Error('Must provide typeDefs');
  return (0, _augment.makeAugmentedExecutableSchema)({
    typeDefs: typeDefs,
    resolvers: resolvers,
    logger: logger,
    allowUndefinedInResolve: allowUndefinedInResolve,
    resolverValidationOptions: resolverValidationOptions,
    directiveResolvers: directiveResolvers,
    schemaDirectives: schemaDirectives,
    parseOptions: parseOptions,
    inheritResolversFromInterfaces: inheritResolversFromInterfaces,
    config: config
  });
};
/**
 * Infer a GraphQL schema by inspecting the contents of a Neo4j instance.
 * @param {} driver
 * @returns a GraphQL schema.
 */

exports.makeAugmentedSchema = makeAugmentedSchema;

var inferSchema = function inferSchema(driver) {
  var config =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var tree = new _Neo4jSchemaTree['default'](driver, config);
  return tree.initialize().then(_graphQLMapper['default']);
};

exports.inferSchema = inferSchema;

var cypher = function cypher(statement) {
  // Get the array of string literals
  var literals = statement.raw; // Add each substitution inbetween all

  for (
    var _len = arguments.length,
      substitutions = new Array(_len > 1 ? _len - 1 : 0),
      _key = 1;
    _key < _len;
    _key++
  ) {
    substitutions[_key - 1] = arguments[_key];
  }

  var composed = substitutions.reduce(function(composed, substitution, index) {
    // Add the string literal
    composed.push(literals[index]); // Add the substution proceeding it

    composed.push(substitution);
    return composed;
  }, []); // Add the last literal

  composed.push(literals[literals.length - 1]);
  return 'statement: """'.concat(composed.join(''), '"""');
};

exports.cypher = cypher;
