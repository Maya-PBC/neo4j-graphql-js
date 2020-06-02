'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs2/helpers/interopRequireDefault');

var _Object$defineProperty2 = require('@babel/runtime-corejs2/core-js/object/define-property');

_Object$defineProperty2(exports, '__esModule', {
  value: true
});

exports.augmentSchemaType = exports.regenerateSchemaType = exports.initializeOperationTypes = exports.transformNeo4jTypes = exports.buildNeo4jTypes = exports.augmentTypes = exports.interpretType = exports.isNeo4jPointType = exports.isNeo4jTemporalType = exports.isNeo4jPropertyType = exports.isSubscriptionTypeDefinition = exports.isMutationTypeDefinition = exports.isQueryTypeDefinition = exports.isOperationTypeDefinition = exports.isUnionTypeDefinition = exports.isInterfaceTypeDefinition = exports.isInputObjectTypeDefinition = exports.isObjectTypeDefinition = exports.isRelationshipType = exports.isNodeType = exports.isSchemaDocument = exports.Neo4jDataType = exports.Neo4jTypeFormatted = exports.Neo4jTypeName = exports.OperationType = exports.Neo4jStructuralType = void 0;

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

var _keys = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/keys')
);

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/slicedToArray')
);

var _entries = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/entries')
);

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/toConsumableArray')
);

var _values = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/values')
);

var _typeof2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/typeof')
);

var _defineProperty3 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/defineProperty')
);

var _graphql = require('graphql');

var _directives = require('../directives');

var _ast = require('../ast');

var _temporal = require('./temporal');

var _spatial = require('./spatial');

var _fields = require('../fields');

var _node = require('./node/node');

var _relationship = require('../types/relationship/relationship');

var _PROPERTY, _STRUCTURAL;

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

/**
 * An enum describing Neo4j entity types, used in type predicate functions
 */
var Neo4jStructuralType = {
  NODE: 'Node',
  RELATIONSHIP: 'Relationship'
};
/**
 * An enum describing the semantics of default GraphQL operation types
 */

exports.Neo4jStructuralType = Neo4jStructuralType;
var OperationType = {
  QUERY: 'Query',
  MUTATION: 'Mutation',
  SUBSCRIPTION: 'Subscription'
}; // The prefix added to the name of any type representing a managed Neo4j data type

exports.OperationType = OperationType;
var Neo4jTypeName = '_Neo4j';
/**
 * An enum describing the names of fields computed and added to the input
 * and output type definitions representing non-scalar Neo4j property types
 */

exports.Neo4jTypeName = Neo4jTypeName;
var Neo4jTypeFormatted = {
  FORMATTED: 'formatted'
};
/**
 * A map of the semantics of the GraphQL type system to Neo4j data types
 */
// https://neo4j.com/docs/cypher-manual/current/syntax/values/#cypher-values

exports.Neo4jTypeFormatted = Neo4jTypeFormatted;
var Neo4jDataType = {
  PROPERTY:
    ((_PROPERTY = {}),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _graphql.GraphQLInt.name,
      'Integer'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _graphql.GraphQLFloat.name,
      'Float'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _graphql.GraphQLString.name,
      'String'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _graphql.GraphQLID.name,
      'String'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _graphql.Kind.ENUM_TYPE_DEFINITION,
      'String'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _graphql.GraphQLBoolean.name,
      'Boolean'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _temporal.TemporalType.TIME,
      'Temporal'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _temporal.TemporalType.DATE,
      'Temporal'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _temporal.TemporalType.DATETIME,
      'Temporal'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _temporal.TemporalType.LOCALTIME,
      'Temporal'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _temporal.TemporalType.LOCALDATETIME,
      'Temporal'
    ),
    (0, _defineProperty3['default'])(
      _PROPERTY,
      _spatial.SpatialType.POINT,
      'Spatial'
    ),
    _PROPERTY),
  // TODO probably revise and remove...
  STRUCTURAL:
    ((_STRUCTURAL = {}),
    (0, _defineProperty3['default'])(
      _STRUCTURAL,
      _graphql.Kind.OBJECT_TYPE_DEFINITION,
      Neo4jStructuralType
    ),
    (0, _defineProperty3['default'])(
      _STRUCTURAL,
      _graphql.Kind.INTERFACE_TYPE_DEFINITION,
      Neo4jStructuralType
    ),
    (0, _defineProperty3['default'])(
      _STRUCTURAL,
      _graphql.Kind.UNION_TYPE_DEFINITION,
      Neo4jStructuralType
    ),
    _STRUCTURAL)
};
/**
 * A predicate function for identifying a Document AST resulting
 * from the parsing of SDL type definitions
 */

exports.Neo4jDataType = Neo4jDataType;

var isSchemaDocument = function isSchemaDocument(_ref) {
  var _ref$definition = _ref.definition,
    definition = _ref$definition === void 0 ? {} : _ref$definition;
  return (
    (0, _typeof2['default'])(definition) === 'object' &&
    definition.kind === _graphql.Kind.DOCUMENT
  );
};
/**
 * A predicate function for identifying type definitions representing
 * a Neo4j node entity
 */

exports.isSchemaDocument = isSchemaDocument;

var isNodeType = function isNodeType(_ref2) {
  var definition = _ref2.definition;
  return (
    interpretType({
      definition: definition
    }) === Neo4jStructuralType.NODE
  );
};
/**
 * A predicate function for identifying type definitions representing
 * a Neo4j relationship entity
 */

exports.isNodeType = isNodeType;

var isRelationshipType = function isRelationshipType(_ref3) {
  var definition = _ref3.definition;
  return (
    interpretType({
      definition: definition
    }) === Neo4jStructuralType.RELATIONSHIP
  );
};
/**
 * A predicate function for identifying a GraphQL Object Type definition
 */

exports.isRelationshipType = isRelationshipType;

var isObjectTypeDefinition = function isObjectTypeDefinition(_ref4) {
  var _ref4$definition = _ref4.definition,
    definition = _ref4$definition === void 0 ? {} : _ref4$definition;
  return definition.kind === _graphql.Kind.OBJECT_TYPE_DEFINITION;
};
/**
 * A predicate function for identifying a GraphQL Input Object Type definition
 */

exports.isObjectTypeDefinition = isObjectTypeDefinition;

var isInputObjectTypeDefinition = function isInputObjectTypeDefinition(_ref5) {
  var _ref5$definition = _ref5.definition,
    definition = _ref5$definition === void 0 ? {} : _ref5$definition;
  return definition.kind === _graphql.Kind.INPUT_OBJECT_TYPE_DEFINITION;
};
/**
 * A predicate function for identifying a GraphQL Interface Type definition
 */

exports.isInputObjectTypeDefinition = isInputObjectTypeDefinition;

var isInterfaceTypeDefinition = function isInterfaceTypeDefinition(_ref6) {
  var _ref6$definition = _ref6.definition,
    definition = _ref6$definition === void 0 ? {} : _ref6$definition;
  return definition.kind === _graphql.Kind.INTERFACE_TYPE_DEFINITION;
};
/**
 * A predicate function for identifying a GraphQL Union definition
 */

exports.isInterfaceTypeDefinition = isInterfaceTypeDefinition;

var isUnionTypeDefinition = function isUnionTypeDefinition(_ref7) {
  var _ref7$definition = _ref7.definition,
    definition = _ref7$definition === void 0 ? {} : _ref7$definition;
  return definition.kind === _graphql.Kind.UNION_TYPE_DEFINITION;
};
/**
 * A predicate function for identifying a GraphQL operation type definition
 */

exports.isUnionTypeDefinition = isUnionTypeDefinition;

var isOperationTypeDefinition = function isOperationTypeDefinition(_ref8) {
  var _ref8$definition = _ref8.definition,
    definition = _ref8$definition === void 0 ? {} : _ref8$definition,
    operationTypeMap = _ref8.operationTypeMap;
  return (
    isQueryTypeDefinition({
      definition: definition,
      operationTypeMap: operationTypeMap
    }) ||
    isMutationTypeDefinition({
      definition: definition,
      operationTypeMap: operationTypeMap
    }) ||
    isSubscriptionTypeDefinition({
      definition: definition,
      operationTypeMap: operationTypeMap
    })
  );
};
/**
 * A predicate function for identifying the GraphQL Query type definition
 */

exports.isOperationTypeDefinition = isOperationTypeDefinition;

var isQueryTypeDefinition = function isQueryTypeDefinition(_ref9) {
  var definition = _ref9.definition,
    operationTypeMap = _ref9.operationTypeMap;
  return definition.name && operationTypeMap[OperationType.QUERY]
    ? definition.name.value === operationTypeMap[OperationType.QUERY].name.value
    : false;
};
/**
 * A predicate function for identifying the GraphQL Mutation type definition
 */

exports.isQueryTypeDefinition = isQueryTypeDefinition;

var isMutationTypeDefinition = function isMutationTypeDefinition(_ref10) {
  var definition = _ref10.definition,
    operationTypeMap = _ref10.operationTypeMap;
  return definition.name && operationTypeMap[OperationType.MUTATION]
    ? definition.name.value ===
        operationTypeMap[OperationType.MUTATION].name.value
    : false;
};
/**
 * A predicate function for identifying the GraphQL Subscription type definition
 */

exports.isMutationTypeDefinition = isMutationTypeDefinition;

var isSubscriptionTypeDefinition = function isSubscriptionTypeDefinition(
  _ref11
) {
  var definition = _ref11.definition,
    operationTypeMap = _ref11.operationTypeMap;
  return definition.name && operationTypeMap[OperationType.SUBSCRIPTION]
    ? definition.name.value ===
        operationTypeMap[OperationType.SUBSCRIPTION].name.value
    : false;
};

exports.isSubscriptionTypeDefinition = isSubscriptionTypeDefinition;

var isDefaultOperationType = function isDefaultOperationType(_ref12) {
  var typeName = _ref12.typeName;
  return (
    typeName === OperationType.QUERY ||
    typeName === OperationType.MUTATION ||
    typeName === OperationType.SUBSCRIPTION
  );
};
/**
 * A predicate function for identifying a GraphQL type definition representing
 * complex Neo4j property types (Temporal, Spatial) managed by the translation process
 */

var isNeo4jPropertyType = function isNeo4jPropertyType(_ref13) {
  var type = _ref13.type;
  return (
    isNeo4jTemporalType({
      type: type
    }) ||
    isNeo4jPointType({
      type: type
    })
  );
};
/**
 * A predicate function for identifying a GraphQL type definition representing
 * a Neo4j Temporal type (Time, Date, DateTime, LocalTime, LocalDateTime)
 * with a name that has already been transformed ('_Neo4j' prefix added)
 */

exports.isNeo4jPropertyType = isNeo4jPropertyType;

var isNeo4jTemporalType = function isNeo4jTemporalType(_ref14) {
  var type = _ref14.type;
  return (0, _values['default'])(_temporal.TemporalType).some(function(name) {
    return type === ''.concat(Neo4jTypeName).concat(name);
  });
};
/**
 * A predicate function for identifying a GraphQL type definition representing
 * a Neo4j Spatial type (Point)
 */

exports.isNeo4jTemporalType = isNeo4jTemporalType;

var isNeo4jPointType = function isNeo4jPointType(_ref15) {
  var type = _ref15.type;
  return (0, _values['default'])(_spatial.SpatialType).some(function(name) {
    return type === ''.concat(Neo4jTypeName).concat(name);
  });
};
/**
 * A predicate function for identifying which Neo4j entity type, if any, a given
 * GraphQL type definition represents
 */

exports.isNeo4jPointType = isNeo4jPointType;

var interpretType = function interpretType(_ref16) {
  var _ref16$definition = _ref16.definition,
    definition = _ref16$definition === void 0 ? {} : _ref16$definition;
  var kind = definition.kind; // Get the structural types allows for this definition kind

  var neo4jStructuralTypes = Neo4jDataType.STRUCTURAL[kind];
  var neo4jType = '';

  if (neo4jStructuralTypes) {
    var name = definition.name.value;

    if (
      !isNeo4jPropertyType({
        type: name
      })
    ) {
      var fields = definition.fields;
      var typeDirectives = definition.directives;

      if (
        neo4jStructuralTypes.RELATIONSHIP &&
        (0, _directives.getDirective)({
          directives: typeDirectives,
          name: _directives.DirectiveDefinition.RELATION
        }) &&
        (0, _fields.getFieldDefinition)({
          fields: fields,
          name: _relationship.RelationshipDirectionField.FROM
        }) &&
        (0, _fields.getFieldDefinition)({
          fields: fields,
          name: _relationship.RelationshipDirectionField.TO
        })
      ) {
        neo4jType = neo4jStructuralTypes.RELATIONSHIP;
      } else if (neo4jStructuralTypes.NODE) {
        // If not a relationship, assume node
        neo4jType = neo4jStructuralTypes.NODE;
      }
    }
  }

  return neo4jType;
};
/**
 * The main export for the augmentation process over prepared maps of
 * GraphQL type definitions
 */

exports.interpretType = interpretType;

var augmentTypes = function augmentTypes(_ref17) {
  var typeDefinitionMap = _ref17.typeDefinitionMap,
    _ref17$typeExtensionD = _ref17.typeExtensionDefinitionMap,
    typeExtensionDefinitionMap =
      _ref17$typeExtensionD === void 0 ? {} : _ref17$typeExtensionD,
    generatedTypeMap = _ref17.generatedTypeMap,
    _ref17$operationTypeM = _ref17.operationTypeMap,
    operationTypeMap =
      _ref17$operationTypeM === void 0 ? {} : _ref17$operationTypeM,
    _ref17$config = _ref17.config,
    config = _ref17$config === void 0 ? {} : _ref17$config;
  var augmentationDefinitions = (0, _toConsumableArray2['default'])(
    (0, _entries['default'])(
      _objectSpread({}, typeDefinitionMap, {}, operationTypeMap)
    )
  );
  augmentationDefinitions.forEach(function(_ref18) {
    var _ref19 = (0, _slicedToArray2['default'])(_ref18, 2),
      typeName = _ref19[0],
      definition = _ref19[1];

    var isObjectType = isObjectTypeDefinition({
      definition: definition
    });
    var isInterfaceType = isInterfaceTypeDefinition({
      definition: definition
    });
    var isUnionType = isUnionTypeDefinition({
      definition: definition
    });
    var isOperationType = isOperationTypeDefinition({
      definition: definition,
      operationTypeMap: operationTypeMap
    });
    var isQueryType = isQueryTypeDefinition({
      definition: definition,
      operationTypeMap: operationTypeMap
    });

    if (isOperationType) {
      var _augmentOperationType = augmentOperationType({
        typeName: typeName,
        definition: definition,
        typeExtensionDefinitionMap: typeExtensionDefinitionMap,
        isQueryType: isQueryType,
        isObjectType: isObjectType,
        typeDefinitionMap: typeDefinitionMap,
        generatedTypeMap: generatedTypeMap,
        operationTypeMap: operationTypeMap,
        config: config
      });

      var _augmentOperationType2 = (0, _slicedToArray2['default'])(
        _augmentOperationType,
        2
      );

      definition = _augmentOperationType2[0];
      typeExtensionDefinitionMap = _augmentOperationType2[1];
      operationTypeMap[typeName] = definition;
    } else if (
      isNodeType({
        definition: definition
      })
    ) {
      var _augmentNodeType = (0, _node.augmentNodeType)({
        typeName: typeName,
        definition: definition,
        isObjectType: isObjectType,
        isInterfaceType: isInterfaceType,
        isUnionType: isUnionType,
        isOperationType: isOperationType,
        isQueryType: isQueryType,
        typeDefinitionMap: typeDefinitionMap,
        generatedTypeMap: generatedTypeMap,
        operationTypeMap: operationTypeMap,
        typeExtensionDefinitionMap: typeExtensionDefinitionMap,
        config: config
      });

      var _augmentNodeType2 = (0, _slicedToArray2['default'])(
        _augmentNodeType,
        4
      );

      definition = _augmentNodeType2[0];
      generatedTypeMap = _augmentNodeType2[1];
      operationTypeMap = _augmentNodeType2[2];
      typeExtensionDefinitionMap = _augmentNodeType2[3];
      // Add augmented type to generated type map
      generatedTypeMap[typeName] = definition;
    } else {
      // Persist any other type definition
      generatedTypeMap[typeName] = definition;
    }
  });
  generatedTypeMap = augmentNeo4jTypes({
    generatedTypeMap: generatedTypeMap,
    config: config
  });
  (0, _entries['default'])(typeExtensionDefinitionMap).forEach(function(
    _ref20
  ) {
    var _ref21 = (0, _slicedToArray2['default'])(_ref20, 2),
      typeName = _ref21[0],
      extensions = _ref21[1];

    var isNonLocalType = !generatedTypeMap[typeName];
    var isOperationType = isDefaultOperationType({
      typeName: typeName
    });

    if (isNonLocalType && !isOperationType) {
      var augmentedExtensions = extensions.map(function(definition) {
        var isObjectExtension =
          definition.kind === _graphql.Kind.OBJECT_TYPE_EXTENSION;
        var isInterfaceExtension =
          definition.kind === _graphql.Kind.INTERFACE_TYPE_EXTENSION;
        var isUnionExtension =
          definition.kind === _graphql.Kind.UNION_TYPE_EXTENSION;
        var nodeInputTypeMap = {};
        var propertyOutputFields = [];
        var propertyInputValues = [];
        var extensionNodeInputTypeMap = {};

        if (isObjectExtension || isInterfaceExtension) {
          var _augmentNodeTypeField = (0, _node.augmentNodeTypeFields)({
            typeName: typeName,
            definition: definition,
            typeDefinitionMap: typeDefinitionMap,
            generatedTypeMap: generatedTypeMap,
            operationTypeMap: operationTypeMap,
            nodeInputTypeMap: nodeInputTypeMap,
            extensionNodeInputTypeMap: extensionNodeInputTypeMap,
            propertyOutputFields: propertyOutputFields,
            propertyInputValues: propertyInputValues,
            isUnionExtension: isUnionExtension,
            isObjectExtension: isObjectExtension,
            isInterfaceExtension: isInterfaceExtension,
            config: config
          });

          var _augmentNodeTypeField2 = (0, _slicedToArray2['default'])(
            _augmentNodeTypeField,
            3
          );

          nodeInputTypeMap = _augmentNodeTypeField2[0];
          propertyOutputFields = _augmentNodeTypeField2[1];
          propertyInputValues = _augmentNodeTypeField2[2];
          return _objectSpread({}, definition, {
            fields: propertyOutputFields
          });
        }
      });
      typeExtensionDefinitionMap[typeName] = augmentedExtensions;
    }
  });
  return [typeExtensionDefinitionMap, generatedTypeMap, operationTypeMap];
};
/**
 * Builds the GraphQL AST type definitions that represent complex Neo4j
 * property types (Temporal, Spatial) picked by the translation process
 */

exports.augmentTypes = augmentTypes;

var augmentNeo4jTypes = function augmentNeo4jTypes(_ref22) {
  var generatedTypeMap = _ref22.generatedTypeMap,
    config = _ref22.config;
  generatedTypeMap = (0, _temporal.augmentTemporalTypes)({
    typeMap: generatedTypeMap,
    config: config
  });
  generatedTypeMap = (0, _spatial.augmentSpatialTypes)({
    typeMap: generatedTypeMap,
    config: config
  });
  return generatedTypeMap;
};
/**
 * Builds the AST definitions for the object and input object
 * types used for non-scalar Neo4j property types (Temporal, Spatial)
 */

var buildNeo4jTypes = function buildNeo4jTypes(_ref23) {
  var _ref23$typeMap = _ref23.typeMap,
    typeMap = _ref23$typeMap === void 0 ? {} : _ref23$typeMap,
    _ref23$neo4jTypes = _ref23.neo4jTypes,
    neo4jTypes = _ref23$neo4jTypes === void 0 ? {} : _ref23$neo4jTypes,
    _ref23$config = _ref23.config,
    config = _ref23$config === void 0 ? {} : _ref23$config;
  (0, _values['default'])(neo4jTypes).forEach(function(typeName) {
    var typeNameLower = typeName.toLowerCase();

    if (config[typeNameLower] === true) {
      var fields = buildNeo4jTypeFields({
        typeName: typeName
      });
      var inputFields = [];
      var outputFields = [];
      fields.forEach(function(_ref24) {
        var _ref25 = (0, _slicedToArray2['default'])(_ref24, 2),
          fieldName = _ref25[0],
          fieldType = _ref25[1];

        var fieldNameLower = fieldName.toLowerCase();
        var fieldConfig = {
          name: (0, _ast.buildName)({
            name: fieldNameLower
          }),
          type: (0, _ast.buildNamedType)({
            name: fieldType
          })
        };
        inputFields.push((0, _ast.buildInputValue)(fieldConfig));
        outputFields.push((0, _ast.buildField)(fieldConfig));
      });
      var formattedFieldConfig = {
        name: (0, _ast.buildName)({
          name: Neo4jTypeFormatted.FORMATTED
        }),
        type: (0, _ast.buildNamedType)({
          name: _graphql.GraphQLString.name
        })
      };

      if (
        (0, _fields.isTemporalField)({
          type: typeName
        })
      ) {
        inputFields.push((0, _ast.buildInputValue)(formattedFieldConfig));
        outputFields.push((0, _ast.buildField)(formattedFieldConfig));
      }

      var objectTypeName = ''.concat(Neo4jTypeName).concat(typeName);
      var inputTypeName = ''.concat(objectTypeName, 'Input');
      typeMap[objectTypeName] = (0, _ast.buildObjectType)({
        name: (0, _ast.buildName)({
          name: objectTypeName
        }),
        fields: outputFields
      });
      typeMap[inputTypeName] = (0, _ast.buildInputObjectType)({
        name: (0, _ast.buildName)({
          name: inputTypeName
        }),
        fields: inputFields
      });
    }
  });
  return typeMap;
};
/**
 * Builds the configuration objects for the field and input value
 * definitions used by a given Neo4j type, built into AST by
 * buildNeo4jTypes, then used in buildNeo4jType
 */

exports.buildNeo4jTypes = buildNeo4jTypes;

var buildNeo4jTypeFields = function buildNeo4jTypeFields(_ref26) {
  var _ref26$typeName = _ref26.typeName,
    typeName = _ref26$typeName === void 0 ? '' : _ref26$typeName;
  var fields = [];

  if (typeName === _temporal.TemporalType.DATE) {
    fields = (0, _entries['default'])(_temporal.Neo4jDate);
  } else if (typeName === _temporal.TemporalType.TIME) {
    fields = (0, _entries['default'])(_temporal.Neo4jTime);
  } else if (typeName === _temporal.TemporalType.LOCALTIME) {
    fields = (0, _entries['default'])(
      _objectSpread({}, _temporal.Neo4jTime)
    ).filter(function(_ref27) {
      var _ref28 = (0, _slicedToArray2['default'])(_ref27, 1),
        name = _ref28[0];

      return name !== _temporal.Neo4jTimeField.TIMEZONE;
    });
  } else if (typeName === _temporal.TemporalType.DATETIME) {
    fields = (0, _entries['default'])(
      _objectSpread({}, _temporal.Neo4jDate, {}, _temporal.Neo4jTime)
    );
  } else if (typeName === _temporal.TemporalType.LOCALDATETIME) {
    fields = (0, _entries['default'])(
      _objectSpread({}, _temporal.Neo4jDate, {}, _temporal.Neo4jTime)
    ).filter(function(_ref29) {
      var _ref30 = (0, _slicedToArray2['default'])(_ref29, 1),
        name = _ref30[0];

      return name !== _temporal.Neo4jTimeField.TIMEZONE;
    });
  } else if (typeName === _spatial.SpatialType.POINT) {
    fields = (0, _entries['default'])(_objectSpread({}, _spatial.Neo4jPoint));
  }

  return fields;
};
/**
 * Applies the Neo4jTypeName prefix to any Field or Input Value definition
 * with a type representing a complex Neo4j property type, to align with the
 * type names expected by the translation process
 */

var transformNeo4jTypes = function transformNeo4jTypes(_ref31) {
  var _visit;

  var _ref31$definitions = _ref31.definitions,
    definitions = _ref31$definitions === void 0 ? [] : _ref31$definitions,
    config = _ref31.config;
  var inputTypeSuffix = 'Input';
  return (0, _graphql.visit)(
    definitions,
    ((_visit = {}),
    (0, _defineProperty3['default'])(
      _visit,
      _graphql.Kind.INPUT_VALUE_DEFINITION,
      function(field) {
        var directives = field.directives;

        if (
          !(0, _directives.isIgnoredField)({
            directives: directives
          })
        ) {
          var type = field.type;
          var unwrappedType = (0, _fields.unwrapNamedType)({
            type: type
          });
          var typeName = unwrappedType.name;

          if (
            (0, _fields.isNeo4jTypeField)({
              type: typeName
            })
          ) {
            var typeNameLower = typeName.toLowerCase();

            if (
              config.temporal[typeNameLower] ||
              config.spatial[typeNameLower]
            ) {
              unwrappedType.name = ''
                .concat(Neo4jTypeName)
                .concat(typeName)
                .concat(inputTypeSuffix);
            }
          } else if (
            isNeo4jPropertyType({
              type: typeName
            })
          ) {
            unwrappedType.name = ''.concat(typeName).concat(inputTypeSuffix);
          }

          field.type = (0, _ast.buildNamedType)(unwrappedType);
        }

        return field;
      }
    ),
    (0, _defineProperty3['default'])(
      _visit,
      _graphql.Kind.FIELD_DEFINITION,
      function(field) {
        var directives = field.directives;

        if (
          !(0, _directives.isIgnoredField)({
            directives: directives
          })
        ) {
          var type = field.type;
          var unwrappedType = (0, _fields.unwrapNamedType)({
            type: type
          });
          var typeName = unwrappedType.name;

          if (
            (0, _fields.isNeo4jTypeField)({
              type: typeName
            })
          ) {
            var typeNameLower = typeName.toLowerCase();

            if (
              config.temporal[typeNameLower] ||
              config.spatial[typeNameLower]
            ) {
              unwrappedType.name = ''.concat(Neo4jTypeName).concat(typeName);
            }
          }

          field.type = (0, _ast.buildNamedType)(unwrappedType);
        }

        return field;
      }
    ),
    _visit)
  );
};
/**
 * Builds any operation types that do not exist but should
 */

exports.transformNeo4jTypes = transformNeo4jTypes;

var initializeOperationTypes = function initializeOperationTypes(_ref32) {
  var typeDefinitionMap = _ref32.typeDefinitionMap,
    schemaTypeDefinition = _ref32.schemaTypeDefinition,
    typeExtensionDefinitionMap = _ref32.typeExtensionDefinitionMap,
    _ref32$config = _ref32.config,
    config = _ref32$config === void 0 ? {} : _ref32$config;
  var queryTypeName = OperationType.QUERY;
  var mutationTypeName = OperationType.MUTATION;
  var subscriptionTypeName = OperationType.SUBSCRIPTION;

  var _getSchemaTypeOperati = getSchemaTypeOperationNames({
    schemaTypeDefinition: schemaTypeDefinition,
    queryTypeName: queryTypeName,
    mutationTypeName: mutationTypeName,
    subscriptionTypeName: subscriptionTypeName
  });

  var _getSchemaTypeOperati2 = (0, _slicedToArray2['default'])(
    _getSchemaTypeOperati,
    3
  );

  queryTypeName = _getSchemaTypeOperati2[0];
  mutationTypeName = _getSchemaTypeOperati2[1];
  subscriptionTypeName = _getSchemaTypeOperati2[2];
  // Build default operation type definitions if none are provided,
  // only kept if at least 1 field is added for generated API
  var operationTypeMap = {};
  typeDefinitionMap = initializeOperationType({
    typeName: queryTypeName,
    typeDefinitionMap: typeDefinitionMap,
    config: config
  });
  typeDefinitionMap = initializeOperationType({
    typeName: mutationTypeName,
    typeDefinitionMap: typeDefinitionMap,
    config: config
  });
  typeDefinitionMap = initializeOperationType({
    typeName: subscriptionTypeName,
    typeDefinitionMap: typeDefinitionMap,
    config: config
  }); // Separate operation types out from other type definitions

  var _buildAugmentationTyp = buildAugmentationTypeMaps({
    queryTypeName: queryTypeName,
    mutationTypeName: mutationTypeName,
    subscriptionTypeName: subscriptionTypeName,
    typeDefinitionMap: typeDefinitionMap,
    typeExtensionDefinitionMap: typeExtensionDefinitionMap
  });

  var _buildAugmentationTyp2 = (0, _slicedToArray2['default'])(
    _buildAugmentationTyp,
    2
  );

  typeDefinitionMap = _buildAugmentationTyp2[0];
  operationTypeMap = _buildAugmentationTyp2[1];
  return [typeDefinitionMap, operationTypeMap];
};
/**
 * Given a schema type, extracts possibly custom operation type names
 */

exports.initializeOperationTypes = initializeOperationTypes;

var getSchemaTypeOperationNames = function getSchemaTypeOperationNames(_ref33) {
  var schemaTypeDefinition = _ref33.schemaTypeDefinition,
    queryTypeName = _ref33.queryTypeName,
    mutationTypeName = _ref33.mutationTypeName,
    subscriptionTypeName = _ref33.subscriptionTypeName;

  // Get operation type names, which may be non-default
  if (schemaTypeDefinition) {
    var operationTypes = schemaTypeDefinition.operationTypes;
    operationTypes.forEach(function(definition) {
      var operation = definition.operation;
      var unwrappedType = (0, _fields.unwrapNamedType)({
        type: definition.type
      });

      if (operation === queryTypeName.toLowerCase()) {
        queryTypeName = unwrappedType.name;
      } else if (operation === mutationTypeName.toLowerCase()) {
        mutationTypeName = unwrappedType.name;
      } else if (operation === subscriptionTypeName.toLowerCase()) {
        subscriptionTypeName = unwrappedType.name;
      }
    });
  }

  return [queryTypeName, mutationTypeName, subscriptionTypeName];
};
/**
 * Builds an operation type if it does not exist but should
 */

var initializeOperationType = function initializeOperationType(_ref34) {
  var _ref34$typeName = _ref34.typeName,
    typeName = _ref34$typeName === void 0 ? '' : _ref34$typeName,
    _ref34$typeDefinition = _ref34.typeDefinitionMap,
    typeDefinitionMap =
      _ref34$typeDefinition === void 0 ? {} : _ref34$typeDefinition,
    _ref34$config = _ref34.config,
    config = _ref34$config === void 0 ? {} : _ref34$config;
  var typeNameLower = typeName.toLowerCase();
  var operationType = typeDefinitionMap[typeName];

  if (!operationType && config[typeNameLower]) {
    operationType = (0, _ast.buildObjectType)({
      name: (0, _ast.buildName)({
        name: typeName
      })
    });
  }

  if (operationType) typeDefinitionMap[typeName] = operationType;
  return typeDefinitionMap;
};
/**
 * Builds a typeDefinitionMap that excludes operation types, instead placing them
 * within an operationTypeMap
 */

var buildAugmentationTypeMaps = function buildAugmentationTypeMaps(_ref35) {
  var queryTypeName = _ref35.queryTypeName,
    mutationTypeName = _ref35.mutationTypeName,
    subscriptionTypeName = _ref35.subscriptionTypeName,
    _ref35$typeDefinition = _ref35.typeDefinitionMap,
    typeDefinitionMap =
      _ref35$typeDefinition === void 0 ? {} : _ref35$typeDefinition;
  return (0, _entries['default'])(typeDefinitionMap).reduce(
    function(_ref36, _ref37) {
      var _ref38 = (0, _slicedToArray2['default'])(_ref36, 2),
        typeMap = _ref38[0],
        operationTypeMap = _ref38[1];

      var _ref39 = (0, _slicedToArray2['default'])(_ref37, 2),
        typeName = _ref39[0],
        definition = _ref39[1];

      if (typeName === queryTypeName) {
        operationTypeMap[OperationType.QUERY] = definition;
      } else if (typeName === mutationTypeName) {
        operationTypeMap[OperationType.MUTATION] = definition;
      } else if (typeName === subscriptionTypeName) {
        operationTypeMap[OperationType.SUBSCRIPTION] = definition;
      } else {
        typeMap[typeName] = definition;
      }

      return [typeMap, operationTypeMap];
    },
    [{}, {}]
  );
};
/**
 * The augmentation entry point for a GraphQL operation
 * type (Query, Mutation, etc.)
 */

var augmentOperationType = function augmentOperationType(_ref40) {
  var typeName = _ref40.typeName,
    definition = _ref40.definition,
    typeExtensionDefinitionMap = _ref40.typeExtensionDefinitionMap,
    isQueryType = _ref40.isQueryType,
    isObjectType = _ref40.isObjectType,
    typeDefinitionMap = _ref40.typeDefinitionMap,
    generatedTypeMap = _ref40.generatedTypeMap,
    operationTypeMap = _ref40.operationTypeMap,
    config = _ref40.config;

  if (isQueryType && isObjectType) {
    var nodeInputTypeMap = {};
    var propertyOutputFields = [];
    var propertyInputValues = [];
    var typeExtensions = typeExtensionDefinitionMap[typeName] || [];

    if (typeExtensions.length) {
      typeExtensionDefinitionMap[typeName] = typeExtensions.map(function(
        extension
      ) {
        var isIgnoredType = false;

        var _augmentNodeTypeField3 = (0, _node.augmentNodeTypeFields)({
          typeName: typeName,
          definition: extension,
          typeDefinitionMap: typeDefinitionMap,
          generatedTypeMap: generatedTypeMap,
          operationTypeMap: operationTypeMap,
          nodeInputTypeMap: nodeInputTypeMap,
          propertyOutputFields: propertyOutputFields,
          propertyInputValues: propertyInputValues,
          config: config
        });

        var _augmentNodeTypeField4 = (0, _slicedToArray2['default'])(
          _augmentNodeTypeField3,
          4
        );

        nodeInputTypeMap = _augmentNodeTypeField4[0];
        propertyOutputFields = _augmentNodeTypeField4[1];
        propertyInputValues = _augmentNodeTypeField4[2];
        isIgnoredType = _augmentNodeTypeField4[3];

        // FIXME fieldArguments are modified through reference so
        // this branch doesn't end up mattereing. A case of isIgnoredType
        // being true may also be highly improbable, though it is posisble
        if (!isIgnoredType) {
          extension.fields = propertyOutputFields;
        }

        return extension;
      });
    }

    var isIgnoredType = false;

    var _augmentNodeTypeField5 = (0, _node.augmentNodeTypeFields)({
      typeName: typeName,
      definition: definition,
      typeDefinitionMap: typeDefinitionMap,
      generatedTypeMap: generatedTypeMap,
      propertyOutputFields: propertyOutputFields,
      operationTypeMap: operationTypeMap,
      config: config
    });

    var _augmentNodeTypeField6 = (0, _slicedToArray2['default'])(
      _augmentNodeTypeField5,
      4
    );

    nodeInputTypeMap = _augmentNodeTypeField6[0];
    propertyOutputFields = _augmentNodeTypeField6[1];
    propertyInputValues = _augmentNodeTypeField6[2];
    isIgnoredType = _augmentNodeTypeField6[3];

    if (!isIgnoredType) {
      definition.fields = propertyOutputFields;
    }
  }

  return [definition, typeExtensionDefinitionMap];
};
/**
 * Regenerates the schema type definition using any existing operation types
 */

var regenerateSchemaType = function regenerateSchemaType(_ref41) {
  var _ref41$schema = _ref41.schema,
    schema = _ref41$schema === void 0 ? {} : _ref41$schema,
    _ref41$definitions = _ref41.definitions,
    definitions = _ref41$definitions === void 0 ? [] : _ref41$definitions;
  var operationTypes = [];
  (0, _values['default'])(OperationType).forEach(function(name) {
    var operationType = undefined;
    if (name === OperationType.QUERY) operationType = schema.getQueryType();
    else if (name === OperationType.MUTATION)
      operationType = schema.getMutationType();
    else if (name === OperationType.SUBSCRIPTION)
      operationType = schema.getSubscriptionType();

    if (operationType) {
      operationTypes.push(
        (0, _ast.buildOperationType)({
          operation: name.toLowerCase(),
          type: (0, _ast.buildNamedType)({
            name: operationType.name
          })
        })
      );
    }
  });

  if (operationTypes.length) {
    definitions.push(
      (0, _ast.buildSchemaDefinition)({
        operationTypes: operationTypes
      })
    );
  }

  return definitions;
};
/**
 * Builds any schema type entry that should exist but doesn't, and
 * decides to only keep operation type definitions that contain at least
 * 1 field
 */

exports.regenerateSchemaType = regenerateSchemaType;

var augmentSchemaType = function augmentSchemaType(_ref42) {
  var definitions = _ref42.definitions,
    schemaTypeDefinition = _ref42.schemaTypeDefinition,
    operationTypeMap = _ref42.operationTypeMap;
  var operationTypes = []; // If schema type provided or regenerated, get its operation types

  if (schemaTypeDefinition)
    operationTypes = schemaTypeDefinition.operationTypes; // Only persist operation types that have at least 1 field, and for those add
  // a schema type operation field if one does not exist

  operationTypeMap = (0, _entries['default'])(operationTypeMap).forEach(
    function(_ref43) {
      var _ref44 = (0, _slicedToArray2['default'])(_ref43, 2),
        typeName = _ref44[0],
        operationType = _ref44[1];

      // Keep the operation type only if there are fields,
      if (operationType.fields.length) {
        var typeNameLow = typeName.toLowerCase(); // Keep this operation type definition

        definitions.push(operationType); // Add schema type field for any generated default operation types (Query, etc.)

        if (
          !operationTypes.find(function(operation) {
            return operation.operation === typeNameLow;
          })
        ) {
          operationTypes.push(
            (0, _ast.buildOperationType)({
              operation: typeNameLow,
              type: (0, _ast.buildNamedType)({
                name: operationType.name.value
              })
            })
          );
        }
      }
    }
  ); // If a schema type was regenerated or provided and at least one operation type
  // exists, then update its operation types and keep it

  if (schemaTypeDefinition && operationTypes.length) {
    schemaTypeDefinition.operationTypes = operationTypes;
    definitions.push(schemaTypeDefinition);
  }

  return definitions;
};

exports.augmentSchemaType = augmentSchemaType;
