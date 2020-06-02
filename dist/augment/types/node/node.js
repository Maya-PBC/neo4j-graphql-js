'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs2/helpers/interopRequireDefault');

var _Object$defineProperty2 = require('@babel/runtime-corejs2/core-js/object/define-property');

_Object$defineProperty2(exports, '__esModule', {
  value: true
});

exports.augmentNodeTypeFields = exports.augmentNodeType = void 0;

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

var _defineProperty3 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/defineProperty')
);

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/toConsumableArray')
);

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/slicedToArray')
);

var _graphql = require('graphql');

var _query = require('./query');

var _mutation = require('./mutation');

var _relationship = require('../relationship/relationship');

var _mutation2 = require('../relationship/mutation');

var _augment = require('../../augment');

var _fields = require('../../fields');

var _inputValues = require('../../input-values');

var _directives = require('../../directives');

var _ast = require('../../ast');

var _types = require('../../types/types');

var _utils = require('../../../utils');

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
 * The main export for the augmentation process of a GraphQL
 * type definition representing a Neo4j node entity
 */
var augmentNodeType = function augmentNodeType(_ref) {
  var typeName = _ref.typeName,
    definition = _ref.definition,
    isObjectType = _ref.isObjectType,
    isInterfaceType = _ref.isInterfaceType,
    isUnionType = _ref.isUnionType,
    isOperationType = _ref.isOperationType,
    isQueryType = _ref.isQueryType,
    typeDefinitionMap = _ref.typeDefinitionMap,
    generatedTypeMap = _ref.generatedTypeMap,
    operationTypeMap = _ref.operationTypeMap,
    typeExtensionDefinitionMap = _ref.typeExtensionDefinitionMap,
    config = _ref.config;
  var nodeInputTypeMap = {};
  var propertyOutputFields = [];
  var propertyInputValues = [];
  var extensionPropertyInputValues = [];
  var extensionNodeInputTypeMap = {};

  if (isObjectType || isInterfaceType || isUnionType) {
    var typeExtensions = typeExtensionDefinitionMap[typeName] || [];

    if (typeExtensions.length) {
      typeExtensionDefinitionMap[typeName] = typeExtensions.map(function(
        extension
      ) {
        var isIgnoredType = false;
        var isObjectExtension =
          extension.kind === _graphql.Kind.OBJECT_TYPE_EXTENSION;
        var isInterfaceExtension =
          extension.kind === _graphql.Kind.INTERFACE_TYPE_EXTENSION;

        if (isObjectExtension || isInterfaceExtension) {
          var _augmentNodeTypeField = augmentNodeTypeFields({
            typeName: typeName,
            definition: extension,
            typeDefinitionMap: typeDefinitionMap,
            generatedTypeMap: generatedTypeMap,
            operationTypeMap: operationTypeMap,
            nodeInputTypeMap: extensionNodeInputTypeMap,
            propertyInputValues: extensionPropertyInputValues,
            propertyOutputFields: propertyOutputFields,
            config: config
          });

          var _augmentNodeTypeField2 = (0, _slicedToArray2['default'])(
            _augmentNodeTypeField,
            4
          );

          extensionNodeInputTypeMap = _augmentNodeTypeField2[0];
          propertyOutputFields = _augmentNodeTypeField2[1];
          extensionPropertyInputValues = _augmentNodeTypeField2[2];
          isIgnoredType = _augmentNodeTypeField2[3];

          if (!isIgnoredType) {
            extension.fields = propertyOutputFields;
          }
        }

        return extension;
      });
    } // A type is ignored when all its fields use @neo4j_ignore

    var isIgnoredType = false;

    var _augmentNodeTypeField3 = augmentNodeTypeFields({
      typeName: typeName,
      definition: definition,
      isUnionType: isUnionType,
      isQueryType: isQueryType,
      typeDefinitionMap: typeDefinitionMap,
      generatedTypeMap: generatedTypeMap,
      operationTypeMap: operationTypeMap,
      nodeInputTypeMap: nodeInputTypeMap,
      extensionNodeInputTypeMap: extensionNodeInputTypeMap,
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
    definition.fields = propertyOutputFields;

    if (extensionPropertyInputValues.length) {
      var _propertyInputValues;

      (_propertyInputValues = propertyInputValues).push.apply(
        _propertyInputValues,
        (0, _toConsumableArray2['default'])(extensionPropertyInputValues)
      );
    }

    if (!isIgnoredType) {
      if (!isOperationType && !isInterfaceType && !isUnionType) {
        var _buildNeo4jSystemIDFi = (0, _fields.buildNeo4jSystemIDField)({
          definition: definition,
          typeName: typeName,
          propertyOutputFields: propertyOutputFields,
          operationTypeMap: operationTypeMap,
          nodeInputTypeMap: nodeInputTypeMap,
          config: config
        });

        var _buildNeo4jSystemIDFi2 = (0, _slicedToArray2['default'])(
          _buildNeo4jSystemIDFi,
          2
        );

        propertyOutputFields = _buildNeo4jSystemIDFi2[0];
        nodeInputTypeMap = _buildNeo4jSystemIDFi2[1];
      }

      var _augmentNodeTypeAPI = augmentNodeTypeAPI({
        definition: definition,
        isObjectType: isObjectType,
        isInterfaceType: isInterfaceType,
        isUnionType: isUnionType,
        isOperationType: isOperationType,
        isQueryType: isQueryType,
        typeName: typeName,
        propertyOutputFields: propertyOutputFields,
        propertyInputValues: propertyInputValues,
        nodeInputTypeMap: nodeInputTypeMap,
        typeDefinitionMap: typeDefinitionMap,
        typeExtensionDefinitionMap: typeExtensionDefinitionMap,
        generatedTypeMap: generatedTypeMap,
        operationTypeMap: operationTypeMap,
        config: config
      });

      var _augmentNodeTypeAPI2 = (0, _slicedToArray2['default'])(
        _augmentNodeTypeAPI,
        3
      );

      typeDefinitionMap = _augmentNodeTypeAPI2[0];
      generatedTypeMap = _augmentNodeTypeAPI2[1];
      operationTypeMap = _augmentNodeTypeAPI2[2];
    }
  }

  return [
    definition,
    generatedTypeMap,
    operationTypeMap,
    typeExtensionDefinitionMap
  ];
};
/**
 * Iterates through all field definitions of a node type, deciding whether
 * to generate the corresponding field or input value definitions that compose
 * the output and input types used in the Query and Mutation API
 */

exports.augmentNodeType = augmentNodeType;

var augmentNodeTypeFields = function augmentNodeTypeFields(_ref2) {
  var typeName = _ref2.typeName,
    definition = _ref2.definition,
    isUnionType = _ref2.isUnionType,
    isQueryType = _ref2.isQueryType,
    typeDefinitionMap = _ref2.typeDefinitionMap,
    generatedTypeMap = _ref2.generatedTypeMap,
    operationTypeMap = _ref2.operationTypeMap,
    _ref2$nodeInputTypeMa = _ref2.nodeInputTypeMap,
    nodeInputTypeMap =
      _ref2$nodeInputTypeMa === void 0 ? {} : _ref2$nodeInputTypeMa,
    extensionNodeInputTypeMap = _ref2.extensionNodeInputTypeMap,
    _ref2$propertyOutputF = _ref2.propertyOutputFields,
    propertyOutputFields =
      _ref2$propertyOutputF === void 0 ? [] : _ref2$propertyOutputF,
    _ref2$propertyInputVa = _ref2.propertyInputValues,
    propertyInputValues =
      _ref2$propertyInputVa === void 0 ? [] : _ref2$propertyInputVa,
    isUnionExtension = _ref2.isUnionExtension,
    isObjectExtension = _ref2.isObjectExtension,
    isInterfaceExtension = _ref2.isInterfaceExtension,
    config = _ref2.config;
  var isIgnoredType = true;

  if (!isUnionType && !isUnionExtension) {
    var fields = definition.fields;

    if (!isQueryType) {
      if (!nodeInputTypeMap[_inputValues.FilteringArgument.FILTER]) {
        nodeInputTypeMap[_inputValues.FilteringArgument.FILTER] = {
          name: '_'.concat(typeName, 'Filter'),
          fields: []
        };
      }

      if (!nodeInputTypeMap[_inputValues.OrderingArgument.ORDER_BY]) {
        nodeInputTypeMap[_inputValues.OrderingArgument.ORDER_BY] = {
          name: '_'.concat(typeName, 'Ordering'),
          values: []
        };
      }
    }

    if (fields === undefined) {
      console.log('\ndefinition: ', definition);
      console.log('fields: ', fields);
    }

    propertyOutputFields = fields.reduce(function(outputFields, field) {
      var fieldType = field.type;
      var fieldArguments = field.arguments;
      var fieldDirectives = field.directives;

      if (
        !(0, _directives.isIgnoredField)({
          directives: fieldDirectives
        })
      ) {
        isIgnoredType = false;
        var fieldName = field.name.value;
        var unwrappedType = (0, _fields.unwrapNamedType)({
          type: fieldType
        });
        var outputType = unwrappedType.name;
        var outputDefinition = typeDefinitionMap[outputType];
        var outputKind = outputDefinition ? outputDefinition.kind : '';
        var outputTypeWrappers = unwrappedType.wrappers;
        var relationshipDirective = (0, _directives.getDirective)({
          directives: fieldDirectives,
          name: _directives.DirectiveDefinition.RELATION
        });

        if (
          !isObjectExtension &&
          !isInterfaceExtension &&
          (0, _fields.isPropertyTypeField)({
            kind: outputKind,
            type: outputType
          })
        ) {
          nodeInputTypeMap = (0, _inputValues.augmentInputTypePropertyFields)({
            inputTypeMap: nodeInputTypeMap,
            fieldName: fieldName,
            fieldDirectives: fieldDirectives,
            outputType: outputType,
            outputKind: outputKind,
            outputTypeWrappers: outputTypeWrappers
          });
          propertyInputValues.push({
            name: fieldName,
            type: unwrappedType,
            directives: fieldDirectives
          });
        } else if (
          (0, _types.isNodeType)({
            definition: outputDefinition
          })
        ) {
          var _augmentNodeTypeField5 = augmentNodeTypeField({
            typeName: typeName,
            definition: definition,
            outputDefinition: outputDefinition,
            fieldArguments: fieldArguments,
            fieldDirectives: fieldDirectives,
            fieldName: fieldName,
            outputType: outputType,
            nodeInputTypeMap: nodeInputTypeMap,
            typeDefinitionMap: typeDefinitionMap,
            generatedTypeMap: generatedTypeMap,
            operationTypeMap: operationTypeMap,
            config: config,
            relationshipDirective: relationshipDirective,
            outputTypeWrappers: outputTypeWrappers,
            isObjectExtension: isObjectExtension,
            isInterfaceExtension: isInterfaceExtension
          });

          var _augmentNodeTypeField6 = (0, _slicedToArray2['default'])(
            _augmentNodeTypeField5,
            5
          );

          fieldArguments = _augmentNodeTypeField6[0];
          nodeInputTypeMap = _augmentNodeTypeField6[1];
          typeDefinitionMap = _augmentNodeTypeField6[2];
          generatedTypeMap = _augmentNodeTypeField6[3];
          operationTypeMap = _augmentNodeTypeField6[4];
        } else if (
          (0, _types.isRelationshipType)({
            definition: outputDefinition
          })
        ) {
          var _augmentRelationshipT = (0,
          _relationship.augmentRelationshipTypeField)({
            typeName: typeName,
            definition: definition,
            fieldType: fieldType,
            fieldArguments: fieldArguments,
            fieldDirectives: fieldDirectives,
            fieldName: fieldName,
            outputTypeWrappers: outputTypeWrappers,
            outputType: outputType,
            outputDefinition: outputDefinition,
            nodeInputTypeMap: nodeInputTypeMap,
            typeDefinitionMap: typeDefinitionMap,
            generatedTypeMap: generatedTypeMap,
            operationTypeMap: operationTypeMap,
            config: config
          });

          var _augmentRelationshipT2 = (0, _slicedToArray2['default'])(
            _augmentRelationshipT,
            6
          );

          fieldType = _augmentRelationshipT2[0];
          fieldArguments = _augmentRelationshipT2[1];
          nodeInputTypeMap = _augmentRelationshipT2[2];
          typeDefinitionMap = _augmentRelationshipT2[3];
          generatedTypeMap = _augmentRelationshipT2[4];
          operationTypeMap = _augmentRelationshipT2[5];
        }
      }

      outputFields.push(
        _objectSpread({}, field, {
          type: fieldType,
          arguments: fieldArguments
        })
      );
      return outputFields;
    }, []);

    if (!isQueryType && extensionNodeInputTypeMap) {
      if (extensionNodeInputTypeMap[_inputValues.FilteringArgument.FILTER]) {
        var _nodeInputTypeMap$Fil;

        var extendedFilteringFields =
          extensionNodeInputTypeMap[_inputValues.FilteringArgument.FILTER]
            .fields;

        (_nodeInputTypeMap$Fil =
          nodeInputTypeMap[_inputValues.FilteringArgument.FILTER]
            .fields).push.apply(
          _nodeInputTypeMap$Fil,
          (0, _toConsumableArray2['default'])(extendedFilteringFields)
        );
      }

      if (extensionNodeInputTypeMap[_inputValues.OrderingArgument.ORDER_BY]) {
        var _nodeInputTypeMap$Ord;

        var extendedOrderingValues =
          extensionNodeInputTypeMap[_inputValues.OrderingArgument.ORDER_BY]
            .values;

        (_nodeInputTypeMap$Ord =
          nodeInputTypeMap[_inputValues.OrderingArgument.ORDER_BY]
            .values).push.apply(
          _nodeInputTypeMap$Ord,
          (0, _toConsumableArray2['default'])(extendedOrderingValues)
        );
      }
    }
  } else {
    isIgnoredType = false;
  }

  return [
    nodeInputTypeMap,
    propertyOutputFields,
    propertyInputValues,
    isIgnoredType
  ];
};
/**
 * Builds the Query API field arguments and relationship field mutation
 * API for a node type field
 */

exports.augmentNodeTypeFields = augmentNodeTypeFields;

var augmentNodeTypeField = function augmentNodeTypeField(_ref3) {
  var typeName = _ref3.typeName,
    definition = _ref3.definition,
    outputDefinition = _ref3.outputDefinition,
    fieldArguments = _ref3.fieldArguments,
    fieldDirectives = _ref3.fieldDirectives,
    fieldName = _ref3.fieldName,
    outputType = _ref3.outputType,
    nodeInputTypeMap = _ref3.nodeInputTypeMap,
    typeDefinitionMap = _ref3.typeDefinitionMap,
    generatedTypeMap = _ref3.generatedTypeMap,
    operationTypeMap = _ref3.operationTypeMap,
    config = _ref3.config,
    relationshipDirective = _ref3.relationshipDirective,
    outputTypeWrappers = _ref3.outputTypeWrappers,
    isObjectExtension = _ref3.isObjectExtension,
    isInterfaceExtension = _ref3.isInterfaceExtension;
  var isUnionType = (0, _types.isUnionTypeDefinition)({
    definition: outputDefinition
  });
  fieldArguments = (0, _query.augmentNodeTypeFieldArguments)({
    fieldArguments: fieldArguments,
    fieldDirectives: fieldDirectives,
    isUnionType: isUnionType,
    outputType: outputType,
    outputTypeWrappers: outputTypeWrappers,
    typeDefinitionMap: typeDefinitionMap,
    config: config
  });

  if (!isUnionType && !isObjectExtension && !isInterfaceExtension) {
    if (
      relationshipDirective &&
      !(0, _types.isQueryTypeDefinition)({
        definition: definition,
        operationTypeMap: operationTypeMap
      })
    ) {
      nodeInputTypeMap = (0, _query.augmentNodeQueryArgumentTypes)({
        typeName: typeName,
        fieldName: fieldName,
        outputType: outputType,
        outputTypeWrappers: outputTypeWrappers,
        nodeInputTypeMap: nodeInputTypeMap,
        config: config
      });
      var relationshipName = (0, _directives.getRelationName)(
        relationshipDirective
      );
      var relationshipDirection = (0, _directives.getRelationDirection)(
        relationshipDirective
      ); // Assume direction OUT

      var fromType = typeName;
      var toType = outputType;

      if (relationshipDirection === 'IN') {
        var temp = fromType;
        fromType = outputType;
        toType = temp;
      }

      var _augmentRelationshipM = (0,
      _mutation2.augmentRelationshipMutationAPI)({
        typeName: typeName,
        fieldName: fieldName,
        outputType: outputType,
        fromType: fromType,
        toType: toType,
        relationshipName: relationshipName,
        typeDefinitionMap: typeDefinitionMap,
        generatedTypeMap: generatedTypeMap,
        operationTypeMap: operationTypeMap,
        config: config
      });

      var _augmentRelationshipM2 = (0, _slicedToArray2['default'])(
        _augmentRelationshipM,
        3
      );

      typeDefinitionMap = _augmentRelationshipM2[0];
      generatedTypeMap = _augmentRelationshipM2[1];
      operationTypeMap = _augmentRelationshipM2[2];
    }
  }

  return [
    fieldArguments,
    nodeInputTypeMap,
    typeDefinitionMap,
    generatedTypeMap,
    operationTypeMap
  ];
};
/**
 * Uses the results of augmentNodeTypeFields to build the AST definitions
 * used to in supporting the Query and Mutation API of a node type
 */

var augmentNodeTypeAPI = function augmentNodeTypeAPI(_ref4) {
  var definition = _ref4.definition,
    typeName = _ref4.typeName,
    isObjectType = _ref4.isObjectType,
    isInterfaceType = _ref4.isInterfaceType,
    isUnionType = _ref4.isUnionType,
    isOperationType = _ref4.isOperationType,
    isQueryType = _ref4.isQueryType,
    propertyInputValues = _ref4.propertyInputValues,
    nodeInputTypeMap = _ref4.nodeInputTypeMap,
    typeDefinitionMap = _ref4.typeDefinitionMap,
    typeExtensionDefinitionMap = _ref4.typeExtensionDefinitionMap,
    generatedTypeMap = _ref4.generatedTypeMap,
    operationTypeMap = _ref4.operationTypeMap,
    config = _ref4.config;

  if (!isUnionType) {
    var _augmentNodeMutationA = (0, _mutation.augmentNodeMutationAPI)({
      definition: definition,
      typeName: typeName,
      isInterfaceType: isInterfaceType,
      propertyInputValues: propertyInputValues,
      generatedTypeMap: generatedTypeMap,
      operationTypeMap: operationTypeMap,
      typeExtensionDefinitionMap: typeExtensionDefinitionMap,
      config: config
    });

    var _augmentNodeMutationA2 = (0, _slicedToArray2['default'])(
      _augmentNodeMutationA,
      2
    );

    operationTypeMap = _augmentNodeMutationA2[0];
    generatedTypeMap = _augmentNodeMutationA2[1];
    generatedTypeMap = buildNodeSelectionInputType({
      definition: definition,
      typeName: typeName,
      propertyInputValues: propertyInputValues,
      generatedTypeMap: generatedTypeMap,
      config: config
    });
  }

  var _augmentNodeQueryAPI = (0, _query.augmentNodeQueryAPI)({
    typeName: typeName,
    isObjectType: isObjectType,
    isInterfaceType: isInterfaceType,
    isUnionType: isUnionType,
    isOperationType: isOperationType,
    isQueryType: isQueryType,
    propertyInputValues: propertyInputValues,
    nodeInputTypeMap: nodeInputTypeMap,
    typeDefinitionMap: typeDefinitionMap,
    typeExtensionDefinitionMap: typeExtensionDefinitionMap,
    generatedTypeMap: generatedTypeMap,
    operationTypeMap: operationTypeMap,
    config: config
  });

  var _augmentNodeQueryAPI2 = (0, _slicedToArray2['default'])(
    _augmentNodeQueryAPI,
    2
  );

  operationTypeMap = _augmentNodeQueryAPI2[0];
  generatedTypeMap = _augmentNodeQueryAPI2[1];
  return [typeDefinitionMap, generatedTypeMap, operationTypeMap];
};
/**
 * Builds the AST definition of the node input object type used
 * by relationship mutations for selecting the nodes of the
 * relationship
 */

var buildNodeSelectionInputType = function buildNodeSelectionInputType(_ref5) {
  var definition = _ref5.definition,
    typeName = _ref5.typeName,
    propertyInputValues = _ref5.propertyInputValues,
    generatedTypeMap = _ref5.generatedTypeMap,
    config = _ref5.config;
  var mutationTypeName = _types.OperationType.MUTATION;
  var mutationTypeNameLower = mutationTypeName.toLowerCase();

  if (
    (0, _augment.shouldAugmentType)(config, mutationTypeNameLower, typeName)
  ) {
    var primaryKey = (0, _utils.getPrimaryKey)(definition);
    var propertyInputName = '_'.concat(typeName, 'Input');

    if (primaryKey) {
      var primaryKeyName = primaryKey.name.value;
      var primaryKeyInputConfig = propertyInputValues.find(function(field) {
        return field.name === primaryKeyName;
      });

      if (primaryKeyInputConfig) {
        generatedTypeMap[propertyInputName] = (0, _ast.buildInputObjectType)({
          name: (0, _ast.buildName)({
            name: propertyInputName
          }),
          fields: [
            (0, _ast.buildInputValue)({
              name: (0, _ast.buildName)({
                name: primaryKeyName
              }),
              type: (0, _ast.buildNamedType)({
                name: primaryKeyInputConfig.type.name,
                wrappers: (0, _defineProperty3['default'])(
                  {},
                  _fields.TypeWrappers.NON_NULL_NAMED_TYPE,
                  true
                )
              })
            })
          ]
        });
      }
    }
  }

  return generatedTypeMap;
};
