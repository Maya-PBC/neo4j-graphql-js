'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs2/helpers/interopRequireDefault');

var _Object$defineProperty2 = require('@babel/runtime-corejs2/core-js/object/define-property');

_Object$defineProperty2(exports, '__esModule', {
  value: true
});

exports.buildCypherSelection = buildCypherSelection;
exports.isFragmentedSelection = exports.getUnionDerivedTypes = exports.getDerivedTypes = exports.mergeSelectionFragments = void 0;

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

var _values = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/values')
);

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/toConsumableArray')
);

var _toArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/toArray')
);

var _defineProperty3 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/defineProperty')
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

var _utils = require('./utils');

var _translate = require('./translate');

var _graphql = require('graphql');

var _types = require('./augment/types/types');

var _fields = require('./augment/fields');

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

function buildCypherSelection(_ref) {
  var _ref$initial = _ref.initial,
    initial = _ref$initial === void 0 ? '' : _ref$initial,
    cypherParams = _ref.cypherParams,
    selections = _ref.selections,
    variableName = _ref.variableName,
    schemaType = _ref.schemaType,
    resolveInfo = _ref.resolveInfo,
    _ref$paramIndex = _ref.paramIndex,
    paramIndex = _ref$paramIndex === void 0 ? 1 : _ref$paramIndex,
    _ref$parentSelectionI = _ref.parentSelectionInfo,
    parentSelectionInfo =
      _ref$parentSelectionI === void 0 ? {} : _ref$parentSelectionI,
    _ref$secondParentSele = _ref.secondParentSelectionInfo,
    secondParentSelectionInfo =
      _ref$secondParentSele === void 0 ? {} : _ref$secondParentSele,
    _ref$isFederatedOpera = _ref.isFederatedOperation,
    isFederatedOperation =
      _ref$isFederatedOpera === void 0 ? false : _ref$isFederatedOpera,
    context = _ref.context;
  if (!selections.length) return [initial, {}];
  var typeMap = resolveInfo.schema.getTypeMap();
  var schemaTypeName = schemaType.name;
  var schemaTypeAstNode = typeMap[schemaTypeName].astNode;
  var isUnionType = (0, _types.isUnionTypeDefinition)({
    definition: schemaTypeAstNode
  });

  if (!isUnionType) {
    selections = (0, _utils.removeIgnoredFields)(schemaType, selections);
  }

  var selectionFilters = (0, _utils.filtersFromSelections)(
    selections,
    resolveInfo.variableValues
  );
  var filterParams = (0, _utils.getFilterParams)(selectionFilters, paramIndex);
  var shallowFilterParams = (0, _entries['default'])(filterParams).reduce(
    function(result, _ref2) {
      var _ref3 = (0, _slicedToArray2['default'])(_ref2, 2),
        key = _ref3[0],
        value = _ref3[1];

      result[''.concat(value.index, '_').concat(key)] = value.value;
      return result;
    },
    {}
  ); // TODO move recurse out of buildCypherSelection, refactoring paramIndex

  var recurse = function recurse(args) {
    paramIndex =
      (0, _keys['default'])(shallowFilterParams).length > 0
        ? paramIndex + 1
        : paramIndex;

    var _buildCypherSelection = buildCypherSelection(
        _objectSpread(
          {},
          args,
          {},
          {
            paramIndex: paramIndex
          }
        )
      ),
      _buildCypherSelection2 = (0, _slicedToArray2['default'])(
        _buildCypherSelection,
        2
      ),
      subSelection = _buildCypherSelection2[0],
      subFilterParams = _buildCypherSelection2[1];

    var derivedTypesParams = (0, _entries['default'])(args)
      .filter(function(_ref4) {
        var _ref5 = (0, _slicedToArray2['default'])(_ref4, 1),
          key = _ref5[0];

        return key.endsWith('_derivedTypes');
      })
      .reduce(function(acc, _ref6) {
        var _ref7 = (0, _slicedToArray2['default'])(_ref6, 2),
          key = _ref7[0],
          value = _ref7[1];

        return _objectSpread(
          {},
          acc,
          (0, _defineProperty3['default'])({}, key, value)
        );
      }, {});
    return [
      subSelection,
      _objectSpread(
        {},
        shallowFilterParams,
        {},
        subFilterParams,
        {},
        derivedTypesParams
      )
    ];
  };

  var selection = [];
  var subSelection = [];

  var _selections = selections,
    _selections2 = (0, _toArray2['default'])(_selections),
    headSelection = _selections2[0],
    tailSelections = _selections2.slice(1);

  var fieldName =
    headSelection && headSelection.name ? headSelection.name.value : '';
  var safeVariableName = (0, _utils.safeVar)(variableName);
  var usesFragments = isFragmentedSelection({
    selections: selections
  });
  var isScalarType = (0, _utils.isGraphqlScalarType)(schemaType);
  var schemaTypeField =
    !isScalarType && !isUnionType ? schemaType.getFields()[fieldName] : {};
  var isInterfaceType = (0, _types.isInterfaceTypeDefinition)({
    definition: schemaTypeAstNode
  });
  var isObjectType = (0, _types.isObjectTypeDefinition)({
    definition: schemaTypeAstNode
  });
  var isFragmentedInterfaceType = usesFragments && isInterfaceType;
  var isFragmentedObjectType = usesFragments && isObjectType;

  var _cypherDirective = (0, _utils.cypherDirective)(schemaType, fieldName),
    customCypherStatement = _cypherDirective.statement;

  var tailParams = {
    selections: tailSelections,
    cypherParams: cypherParams,
    variableName: variableName,
    paramIndex: paramIndex,
    schemaType: schemaType,
    resolveInfo: resolveInfo,
    shallowFilterParams: shallowFilterParams,
    parentSelectionInfo: parentSelectionInfo,
    secondParentSelectionInfo: secondParentSelectionInfo,
    isFederatedOperation: isFederatedOperation,
    context: context
  };
  var translationConfig = undefined;

  if (isFragmentedInterfaceType || isUnionType || isFragmentedObjectType) {
    var _mergeSelectionFragme = mergeSelectionFragments({
        schemaType: schemaType,
        selections: selections,
        isFragmentedObjectType: isFragmentedObjectType,
        isUnionType: isUnionType,
        typeMap: typeMap,
        resolveInfo: resolveInfo
      }),
      _mergeSelectionFragme2 = (0, _slicedToArray2['default'])(
        _mergeSelectionFragme,
        2
      ),
      schemaTypeFields = _mergeSelectionFragme2[0],
      derivedTypeMap = _mergeSelectionFragme2[1];

    var hasOnlySchemaTypeFragments =
      schemaTypeFields.length > 0 &&
      (0, _keys['default'])(derivedTypeMap).length === 0;

    if (hasOnlySchemaTypeFragments || isFragmentedObjectType) {
      tailParams.selections = schemaTypeFields;
      translationConfig = tailParams;
    } else if (isFragmentedInterfaceType || isUnionType) {
      var derivedTypes = getDerivedTypes({
        schemaTypeName: schemaTypeName,
        derivedTypeMap: derivedTypeMap,
        isFragmentedInterfaceType: isFragmentedInterfaceType,
        isUnionType: isUnionType,
        resolveInfo: resolveInfo
      }); // TODO Make this a new function once recurse is moved out of buildCypherSelection
      // so that we don't have to start passing recurse as an argument

      var _derivedTypes$reduce = derivedTypes.reduce(
          function(_ref8, derivedType) {
            var _ref9 = (0, _slicedToArray2['default'])(_ref8, 2),
              listComprehensions = _ref9[0],
              params = _ref9[1];

            // Get merged selections of this implementing type
            if (!derivedTypeMap[derivedType]) {
              // If no fields of this implementing type were selected,
              // use at least any interface fields selected generally
              derivedTypeMap[derivedType] = schemaTypeFields;
            }

            var mergedTypeSelections = derivedTypeMap[derivedType];

            if (mergedTypeSelections.length) {
              var composedTypeDefinition = typeMap[derivedType].astNode;
              var isInterfaceTypeFragment = (0,
              _types.isInterfaceTypeDefinition)({
                definition: composedTypeDefinition
              }); // If selections have been made for this type after merging

              if (isFragmentedInterfaceType || isUnionType) {
                schemaType = resolveInfo.schema.getType(derivedType);
              } // TODO Refactor when recurse is moved out buildCypherSelection
              // Build the map projection for this implementing type

              var _recurse = recurse(
                  _objectSpread({}, tailParams, {
                    schemaType: schemaType,
                    selections: mergedTypeSelections,
                    paramIndex: paramIndex
                  })
                ),
                _recurse2 = (0, _slicedToArray2['default'])(_recurse, 2),
                _fragmentedQuery = _recurse2[0],
                _queryParams = _recurse2[1];

              if (isFragmentedInterfaceType || isUnionType) {
                // Build a more complex list comprehension for
                // this type, to be aggregated together later
                var _buildComposedTypeLis = buildComposedTypeListComprehension({
                  derivedType: derivedType,
                  isUnionType: isUnionType,
                  mergedTypeSelections: mergedTypeSelections,
                  queryParams: _queryParams,
                  safeVariableName: safeVariableName,
                  isInterfaceTypeFragment: isInterfaceTypeFragment,
                  fragmentedQuery: _fragmentedQuery,
                  resolveInfo: resolveInfo
                });

                var _buildComposedTypeLis2 = (0, _slicedToArray2['default'])(
                  _buildComposedTypeLis,
                  2
                );

                _fragmentedQuery = _buildComposedTypeLis2[0];
                _queryParams = _buildComposedTypeLis2[1];
              }

              listComprehensions.push(_fragmentedQuery); // Merge any cypher params built for field arguments

              params = _objectSpread({}, params, {}, _queryParams);
            }

            return [listComprehensions, params];
          },
          [[], {}]
        ),
        _derivedTypes$reduce2 = (0, _slicedToArray2['default'])(
          _derivedTypes$reduce,
          2
        ),
        fragmentedQuery = _derivedTypes$reduce2[0],
        queryParams = _derivedTypes$reduce2[1];

      var composedQuery = concatenateComposedTypeLists({
        fragmentedQuery: fragmentedQuery
      });
      selection = [composedQuery, queryParams];
    }
  } else {
    var fieldType =
      schemaTypeField && schemaTypeField.type ? schemaTypeField.type : {};
    var innerSchemaType = (0, _utils.innerType)(fieldType); // for target "type" aka label
    // TODO Switch to using schemaTypeField.astNode instead of schemaTypeField
    // so the field type could be extracted using unwrapNamedType. We could explicitly check
    // the ast for list type wrappers (changing isArrayType calls in translate.js) and we
    // could use in the branching logic here, the same astNode.kind based predicate functions
    // used in the  augmentation code (ex: from isObjectType to isObjectTypeDefinition from ast.js)

    var fieldAstNode = schemaTypeField ? schemaTypeField.astNode : {};
    var fieldTypeWrappers = (0, _fields.unwrapNamedType)({
      type: fieldAstNode
    });
    var fieldTypeName = fieldTypeWrappers[_fields.TypeWrappers.NAME];
    var innerSchemaTypeAstNode = typeMap[fieldTypeName]
      ? typeMap[fieldTypeName].astNode
      : {};
    var commaIfTail = tailSelections.length > 0 ? ',' : '';
    var isIntrospectionField = !isScalarType && !schemaTypeField;
    var isScalarTypeField = (0, _utils.isGraphqlScalarType)(innerSchemaType);
    var isObjectTypeField = (0, _types.isObjectTypeDefinition)({
      definition: innerSchemaTypeAstNode
    });
    var isInterfaceTypeField = (0, _types.isInterfaceTypeDefinition)({
      definition: innerSchemaTypeAstNode
    });
    var isUnionTypeField = (0, _types.isUnionTypeDefinition)({
      definition: innerSchemaTypeAstNode
    });

    if (isIntrospectionField) {
      // Schema meta fields(__schema, __typename, etc)
      translationConfig = _objectSpread({}, tailParams, {
        initial: tailSelections.length
          ? initial
          : initial.substring(0, initial.lastIndexOf(','))
      });
    } else if (isScalarTypeField) {
      translationConfig = translateScalarTypeField({
        fieldName: fieldName,
        initial: initial,
        variableName: variableName,
        commaIfTail: commaIfTail,
        tailParams: tailParams,
        customCypherStatement: customCypherStatement,
        schemaType: schemaType,
        schemaTypeAstNode: schemaTypeAstNode,
        headSelection: headSelection,
        resolveInfo: resolveInfo,
        paramIndex: paramIndex,
        cypherParams: cypherParams,
        parentSelectionInfo: parentSelectionInfo,
        secondParentSelectionInfo: secondParentSelectionInfo,
        isFederatedOperation: isFederatedOperation,
        context: context
      });
    } else if (isObjectType || isInterfaceType) {
      var schemaTypeRelation = (0, _utils.getRelationTypeDirective)(
        schemaTypeAstNode
      );
      var innerSchemaTypeRelation = (0, _utils.getRelationTypeDirective)(
        innerSchemaTypeAstNode
      );
      var nestedVariable = (0, _utils.decideNestedVariableName)({
        schemaTypeRelation: schemaTypeRelation,
        innerSchemaTypeRelation: innerSchemaTypeRelation,
        variableName: variableName,
        fieldName: fieldName,
        parentSelectionInfo: parentSelectionInfo
      });
      var fieldSelectionSet =
        headSelection && headSelection.selectionSet
          ? headSelection.selectionSet.selections
          : [];
      subSelection = recurse({
        selections: fieldSelectionSet,
        variableName: nestedVariable,
        paramIndex: paramIndex,
        schemaType: innerSchemaType,
        resolveInfo: resolveInfo,
        cypherParams: cypherParams,
        shallowFilterParams: shallowFilterParams,
        parentSelectionInfo: {
          fieldName: fieldName,
          schemaType: schemaType,
          variableName: variableName,
          fieldType: fieldType,
          filterParams: filterParams,
          selections: selections,
          paramIndex: paramIndex
        },
        secondParentSelectionInfo: parentSelectionInfo,
        isFederatedOperation: isFederatedOperation,
        context: context
      });
      var fieldArgs =
        !isScalarType && schemaTypeField && schemaTypeField.args
          ? schemaTypeField.args.map(function(e) {
              return e.astNode;
            })
          : [];
      var neo4jTypeArgs = (0, _utils.getNeo4jTypeArguments)(fieldArgs);

      var _queryParams2 = (0, _utils.paramsToString)(
        (0, _utils.innerFilterParams)(filterParams, neo4jTypeArgs)
      );

      var skipLimit = (0, _utils.computeSkipLimit)(
        headSelection,
        resolveInfo.variableValues
      );

      var _relationDirective = (0, _utils.relationDirective)(
          schemaType,
          fieldName
        ),
        relType = _relationDirective.name,
        relDirection = _relationDirective.direction;

      var isRelationshipField = relType && relDirection;
      var isRelationshipTypeField = innerSchemaTypeRelation !== undefined;

      var _usesFragments = isFragmentedSelection({
        selections: fieldSelectionSet
      });

      var isFragmentedObjectTypeField = isObjectTypeField && _usesFragments;

      var _mergeSelectionFragme3 = mergeSelectionFragments({
          schemaType: innerSchemaType,
          selections: fieldSelectionSet,
          isFragmentedObjectType: isFragmentedObjectTypeField,
          isUnionType: isUnionTypeField,
          typeMap: typeMap,
          resolveInfo: resolveInfo
        }),
        _mergeSelectionFragme4 = (0, _slicedToArray2['default'])(
          _mergeSelectionFragme3,
          2
        ),
        _schemaTypeFields = _mergeSelectionFragme4[0],
        _derivedTypeMap = _mergeSelectionFragme4[1];

      var fragmentTypeParams = (0, _translate.derivedTypesParams)({
        isInterfaceType: isInterfaceTypeField,
        isUnionType: isUnionTypeField,
        schema: resolveInfo.schema,
        schemaTypeName: innerSchemaType.name,
        usesFragments: _usesFragments
      });
      subSelection[1] = _objectSpread(
        {},
        subSelection[1],
        {},
        fragmentTypeParams
      );

      if (customCypherStatement) {
        // Object type field with cypher directive
        translationConfig = (0, _translate.customCypherField)({
          customCypherStatement: customCypherStatement,
          cypherParams: cypherParams,
          paramIndex: paramIndex,
          schemaTypeRelation: schemaTypeRelation,
          isInterfaceTypeField: isInterfaceTypeField,
          isUnionTypeField: isUnionTypeField,
          isObjectTypeField: isObjectTypeField,
          usesFragments: _usesFragments,
          schemaTypeFields: _schemaTypeFields,
          derivedTypeMap: _derivedTypeMap,
          initial: initial,
          fieldName: fieldName,
          fieldType: fieldType,
          fieldTypeName: fieldTypeName,
          nestedVariable: nestedVariable,
          variableName: variableName,
          headSelection: headSelection,
          schemaType: schemaType,
          innerSchemaType: innerSchemaType,
          resolveInfo: resolveInfo,
          subSelection: subSelection,
          skipLimit: skipLimit,
          commaIfTail: commaIfTail,
          tailParams: tailParams,
          isFederatedOperation: isFederatedOperation,
          context: context
        });
      } else if ((0, _utils.isNeo4jType)(fieldTypeName)) {
        translationConfig = (0, _translate.neo4jType)({
          initial: initial,
          fieldName: fieldName,
          subSelection: subSelection,
          commaIfTail: commaIfTail,
          tailParams: tailParams,
          variableName: variableName,
          nestedVariable: nestedVariable,
          fieldType: fieldType,
          schemaType: schemaType,
          schemaTypeRelation: schemaTypeRelation,
          parentSelectionInfo: parentSelectionInfo
        });
      } else if (isRelationshipField || isUnionTypeField) {
        // Object type field with relation directive
        var _relationFieldOnNodeT = (0, _translate.relationFieldOnNodeType)({
          initial: initial,
          fieldName: fieldName,
          fieldType: fieldType,
          variableName: variableName,
          relDirection: relDirection,
          relType: relType,
          nestedVariable: nestedVariable,
          schemaTypeFields: _schemaTypeFields,
          derivedTypeMap: _derivedTypeMap,
          isInterfaceTypeField: isInterfaceTypeField,
          isUnionTypeField: isUnionTypeField,
          isObjectTypeField: isObjectTypeField,
          usesFragments: _usesFragments,
          innerSchemaType: innerSchemaType,
          paramIndex: paramIndex,
          fieldArgs: fieldArgs,
          filterParams: filterParams,
          selectionFilters: selectionFilters,
          neo4jTypeArgs: neo4jTypeArgs,
          selections: selections,
          schemaType: schemaType,
          subSelection: subSelection,
          skipLimit: skipLimit,
          commaIfTail: commaIfTail,
          tailParams: tailParams,
          resolveInfo: resolveInfo,
          cypherParams: cypherParams
        });

        var _relationFieldOnNodeT2 = (0, _slicedToArray2['default'])(
          _relationFieldOnNodeT,
          2
        );

        translationConfig = _relationFieldOnNodeT2[0];
        subSelection = _relationFieldOnNodeT2[1];
      } else if (schemaTypeRelation) {
        // Object type field on relation type
        // (from, to, renamed, relation mutation payloads...)
        var _nodeTypeFieldOnRelat = (0, _translate.nodeTypeFieldOnRelationType)(
          {
            initial: initial,
            fieldName: fieldName,
            fieldType: fieldType,
            variableName: variableName,
            nestedVariable: nestedVariable,
            queryParams: _queryParams2,
            subSelection: subSelection,
            skipLimit: skipLimit,
            commaIfTail: commaIfTail,
            tailParams: tailParams,
            filterParams: filterParams,
            neo4jTypeArgs: neo4jTypeArgs,
            schemaTypeRelation: schemaTypeRelation,
            innerSchemaType: innerSchemaType,
            schemaTypeFields: _schemaTypeFields,
            derivedTypeMap: _derivedTypeMap,
            isObjectTypeField: isObjectTypeField,
            isInterfaceTypeField: isInterfaceTypeField,
            isUnionTypeField: isUnionTypeField,
            usesFragments: _usesFragments,
            paramIndex: paramIndex,
            parentSelectionInfo: parentSelectionInfo,
            resolveInfo: resolveInfo,
            selectionFilters: selectionFilters,
            fieldArgs: fieldArgs,
            cypherParams: cypherParams
          }
        );

        var _nodeTypeFieldOnRelat2 = (0, _slicedToArray2['default'])(
          _nodeTypeFieldOnRelat,
          2
        );

        translationConfig = _nodeTypeFieldOnRelat2[0];
        subSelection = _nodeTypeFieldOnRelat2[1];
      } else if (isRelationshipTypeField) {
        // Relation type field on node type (field payload types...)
        // and set subSelection to update field argument params
        var _relationTypeFieldOnN = (0, _translate.relationTypeFieldOnNodeType)(
          {
            innerSchemaTypeRelation: innerSchemaTypeRelation,
            initial: initial,
            fieldName: fieldName,
            subSelection: subSelection,
            skipLimit: skipLimit,
            commaIfTail: commaIfTail,
            tailParams: tailParams,
            fieldType: fieldType,
            variableName: variableName,
            schemaType: schemaType,
            innerSchemaType: innerSchemaType,
            nestedVariable: nestedVariable,
            queryParams: _queryParams2,
            filterParams: filterParams,
            neo4jTypeArgs: neo4jTypeArgs,
            resolveInfo: resolveInfo,
            selectionFilters: selectionFilters,
            paramIndex: paramIndex,
            fieldArgs: fieldArgs,
            cypherParams: cypherParams
          }
        );

        var _relationTypeFieldOnN2 = (0, _slicedToArray2['default'])(
          _relationTypeFieldOnN,
          2
        );

        translationConfig = _relationTypeFieldOnN2[0];
        subSelection = _relationTypeFieldOnN2[1];
      }
    }
  }

  if (translationConfig) {
    selection = recurse(translationConfig);
  }

  return [selection[0], _objectSpread({}, selection[1], {}, subSelection[1])];
}

var translateScalarTypeField = function translateScalarTypeField(_ref10) {
  var fieldName = _ref10.fieldName,
    initial = _ref10.initial,
    variableName = _ref10.variableName,
    commaIfTail = _ref10.commaIfTail,
    tailParams = _ref10.tailParams,
    customCypherStatement = _ref10.customCypherStatement,
    schemaType = _ref10.schemaType,
    schemaTypeAstNode = _ref10.schemaTypeAstNode,
    headSelection = _ref10.headSelection,
    resolveInfo = _ref10.resolveInfo,
    paramIndex = _ref10.paramIndex,
    cypherParams = _ref10.cypherParams,
    parentSelectionInfo = _ref10.parentSelectionInfo,
    secondParentSelectionInfo = _ref10.secondParentSelectionInfo,
    isFederatedOperation = _ref10.isFederatedOperation,
    context = _ref10.context;

  if (fieldName === _fields.Neo4jSystemIDField) {
    return _objectSpread(
      {
        initial: ''
          .concat(initial)
          .concat(fieldName, ': ID(')
          .concat((0, _utils.safeVar)(variableName), ')')
          .concat(commaIfTail)
      },
      tailParams
    );
  } else {
    if (customCypherStatement) {
      if ((0, _utils.getRelationTypeDirective)(schemaTypeAstNode)) {
        variableName = ''.concat(variableName, '_relation');
      }

      return _objectSpread(
        {
          initial: ''
            .concat(initial)
            .concat(fieldName, ': apoc.cypher.runFirstColumn("')
            .concat(customCypherStatement, '", {')
            .concat(
              (0, _utils.cypherDirectiveArgs)(
                variableName,
                headSelection,
                cypherParams,
                schemaType,
                resolveInfo,
                paramIndex,
                isFederatedOperation,
                context
              ),
              '}, false)'
            )
            .concat(commaIfTail)
        },
        tailParams
      );
    } else if ((0, _utils.isNeo4jTypeField)(schemaType, fieldName)) {
      return (0, _translate.neo4jTypeField)({
        initial: initial,
        fieldName: fieldName,
        variableName: variableName,
        commaIfTail: commaIfTail,
        tailParams: tailParams,
        parentSelectionInfo: parentSelectionInfo,
        secondParentSelectionInfo: secondParentSelectionInfo
      });
    } // graphql scalar type, no custom cypher statement

    return _objectSpread(
      {
        initial: ''
          .concat(initial, ' .')
          .concat(fieldName, ' ')
          .concat(commaIfTail)
      },
      tailParams
    );
  }
};

var mergeSelectionFragments = function mergeSelectionFragments(_ref11) {
  var schemaType = _ref11.schemaType,
    selections = _ref11.selections,
    isFragmentedObjectType = _ref11.isFragmentedObjectType,
    isUnionType = _ref11.isUnionType,
    typeMap = _ref11.typeMap,
    resolveInfo = _ref11.resolveInfo;
  var schemaTypeName = schemaType.name;
  var fragmentDefinitions = resolveInfo.fragments;

  var _buildFragmentMaps = buildFragmentMaps({
      selections: selections,
      schemaTypeName: schemaTypeName,
      isFragmentedObjectType: isFragmentedObjectType,
      fragmentDefinitions: fragmentDefinitions,
      isUnionType: isUnionType,
      typeMap: typeMap,
      resolveInfo: resolveInfo
    }),
    _buildFragmentMaps2 = (0, _slicedToArray2['default'])(
      _buildFragmentMaps,
      2
    ),
    schemaTypeFields = _buildFragmentMaps2[0],
    derivedTypeMap = _buildFragmentMaps2[1]; // When querying an interface type using fragments, queries are made
  // more specific if there is not at least 1 interface field selected.
  // So the __typename field is removed here to prevent interpreting it
  // as a field for which a value could be obtained from matched data.
  // Otherwisez all interface type nodes would always be returned even
  // when only using fragments to select fields on implementing types

  var typeNameFieldIndex = schemaTypeFields.findIndex(function(field) {
    return field.name && field.name.value === '__typename';
  });
  if (typeNameFieldIndex !== -1) schemaTypeFields.splice(typeNameFieldIndex, 1);
  return [schemaTypeFields, derivedTypeMap];
};

exports.mergeSelectionFragments = mergeSelectionFragments;

var buildFragmentMaps = function buildFragmentMaps(_ref12) {
  var _ref12$selections = _ref12.selections,
    selections = _ref12$selections === void 0 ? [] : _ref12$selections,
    schemaTypeName = _ref12.schemaTypeName,
    isFragmentedObjectType = _ref12.isFragmentedObjectType,
    fragmentDefinitions = _ref12.fragmentDefinitions,
    isUnionType = _ref12.isUnionType,
    _ref12$typeMap = _ref12.typeMap,
    typeMap = _ref12$typeMap === void 0 ? {} : _ref12$typeMap,
    resolveInfo = _ref12.resolveInfo;
  var schemaTypeFields = [];
  var interfaceFragmentMap = {};
  var objectSelectionMap = {};
  var objectFragmentMap = {};
  selections.forEach(function(selection) {
    var fieldKind = selection.kind;

    if (fieldKind === _graphql.Kind.FIELD) {
      schemaTypeFields.push(selection);
    } else if (
      isSelectionFragment({
        kind: fieldKind
      })
    ) {
      var _aggregateFragmentedS = aggregateFragmentedSelections({
        schemaTypeName: schemaTypeName,
        selection: selection,
        fieldKind: fieldKind,
        isUnionType: isUnionType,
        schemaTypeFields: schemaTypeFields,
        objectFragmentMap: objectFragmentMap,
        interfaceFragmentMap: interfaceFragmentMap,
        objectSelectionMap: objectSelectionMap,
        fragmentDefinitions: fragmentDefinitions,
        typeMap: typeMap
      });

      var _aggregateFragmentedS2 = (0, _slicedToArray2['default'])(
        _aggregateFragmentedS,
        4
      );

      schemaTypeFields = _aggregateFragmentedS2[0];
      interfaceFragmentMap = _aggregateFragmentedS2[1];
      objectSelectionMap = _aggregateFragmentedS2[2];
      objectFragmentMap = _aggregateFragmentedS2[3];
    }
  }); // move into any interface type fragment, any fragments on object types implmenting it

  var derivedTypeMap = mergeInterfacedObjectFragments({
    schemaTypeName: schemaTypeName,
    schemaTypeFields: schemaTypeFields,
    isFragmentedObjectType: isFragmentedObjectType,
    objectSelectionMap: objectSelectionMap,
    objectFragmentMap: objectFragmentMap,
    interfaceFragmentMap: interfaceFragmentMap,
    resolveInfo: resolveInfo
  }); // deduplicate relationship fields within fragments on the same type

  (0, _keys['default'])(derivedTypeMap).forEach(function(typeName) {
    var allSelections = [].concat(
      (0, _toConsumableArray2['default'])(derivedTypeMap[typeName]),
      (0, _toConsumableArray2['default'])(schemaTypeFields)
    );
    derivedTypeMap[typeName] = mergeFragmentedSelections({
      selections: allSelections
    });
  });
  schemaTypeFields = mergeFragmentedSelections({
    selections: schemaTypeFields
  });
  return [schemaTypeFields, derivedTypeMap];
};

var aggregateFragmentedSelections = function aggregateFragmentedSelections(
  _ref13
) {
  var schemaTypeName = _ref13.schemaTypeName,
    selection = _ref13.selection,
    fieldKind = _ref13.fieldKind,
    isUnionType = _ref13.isUnionType,
    schemaTypeFields = _ref13.schemaTypeFields,
    objectFragmentMap = _ref13.objectFragmentMap,
    interfaceFragmentMap = _ref13.interfaceFragmentMap,
    objectSelectionMap = _ref13.objectSelectionMap,
    fragmentDefinitions = _ref13.fragmentDefinitions,
    typeMap = _ref13.typeMap;
  var typeName = getFragmentTypeName({
    selection: selection,
    kind: fieldKind,
    fragmentDefinitions: fragmentDefinitions
  });
  var fragmentSelections = getFragmentSelections({
    selection: selection,
    kind: fieldKind,
    fragmentDefinitions: fragmentDefinitions
  });

  if (typeName) {
    if (fragmentSelections && fragmentSelections.length) {
      var definition = typeMap[typeName] ? typeMap[typeName].astNode : {};

      if (
        (0, _types.isObjectTypeDefinition)({
          definition: definition
        })
      ) {
        if (typeName === schemaTypeName) {
          // fragmented selections on the same type for which this is
          // a selection set are aggregated into schemaTypeFields
          schemaTypeFields.push.apply(
            schemaTypeFields,
            (0, _toConsumableArray2['default'])(fragmentSelections)
          );
        } else {
          var _objectFragmentMap$ty;

          if (!objectSelectionMap[typeName]) objectSelectionMap[typeName] = []; // prepare an aggregation of fragmented selections used on object type
          // if querying a union type, fragments on object types are merged with
          // any interface type fragment implemented by them

          objectSelectionMap[typeName].push(selection); // initializes an array for the below progressive aggregation

          if (!objectFragmentMap[typeName]) objectFragmentMap[typeName] = []; // aggregates together all fragmented selections on this object type

          (_objectFragmentMap$ty = objectFragmentMap[typeName]).push.apply(
            _objectFragmentMap$ty,
            (0, _toConsumableArray2['default'])(fragmentSelections)
          );
        }
      } else if (
        (0, _types.isInterfaceTypeDefinition)({
          definition: definition
        })
      ) {
        if (typeName === schemaTypeName) {
          // aggregates together all fragmented selections on this interface type
          // to be multiplied over and deduplicated with any fragments on object
          // types implementing the interface, within its selection set
          schemaTypeFields.push.apply(
            schemaTypeFields,
            (0, _toConsumableArray2['default'])(fragmentSelections)
          );
        } else if (isUnionType) {
          var _interfaceFragmentMap;

          // only for interface fragments on union types, initializes an array
          // for the below progressive aggregation
          if (!interfaceFragmentMap[typeName])
            interfaceFragmentMap[typeName] = []; // aggregates together all fragmented selections on this object type

          (_interfaceFragmentMap = interfaceFragmentMap[typeName]).push.apply(
            _interfaceFragmentMap,
            (0, _toConsumableArray2['default'])(fragmentSelections)
          );
        }
      }
    }
  } else {
    // For inline untyped fragments on the same type, ex: ...{ title }
    schemaTypeFields.push.apply(
      schemaTypeFields,
      (0, _toConsumableArray2['default'])(fragmentSelections)
    );
  }

  return [
    schemaTypeFields,
    interfaceFragmentMap,
    objectSelectionMap,
    objectFragmentMap
  ];
};

var mergeInterfacedObjectFragments = function mergeInterfacedObjectFragments(
  _ref14
) {
  var schemaTypeName = _ref14.schemaTypeName,
    schemaTypeFields = _ref14.schemaTypeFields,
    isFragmentedObjectType = _ref14.isFragmentedObjectType,
    objectSelectionMap = _ref14.objectSelectionMap,
    objectFragmentMap = _ref14.objectFragmentMap,
    interfaceFragmentMap = _ref14.interfaceFragmentMap,
    resolveInfo = _ref14.resolveInfo;
  (0, _keys['default'])(interfaceFragmentMap).forEach(function(interfaceName) {
    var derivedTypes = (0, _utils.getInterfaceDerivedTypeNames)(
      resolveInfo.schema,
      interfaceName
    );
    derivedTypes.forEach(function(typeName) {
      var implementingTypeFragments = objectSelectionMap[typeName];

      if (implementingTypeFragments) {
        var _interfaceFragmentMap2;

        // aggregate into the selections in this aggregated interface type fragment,
        // the aggregated selections of fragments on object types implmementing it
        (_interfaceFragmentMap2 =
          interfaceFragmentMap[interfaceName]).push.apply(
          _interfaceFragmentMap2,
          (0, _toConsumableArray2['default'])(implementingTypeFragments)
        ); // given the above aggregation into the interface type selections,
        // remove the fragment on this implementing type that existed
        // within the same selection set

        delete objectFragmentMap[typeName];
      }
    });
    return interfaceFragmentMap;
  });

  var derivedTypeMap = _objectSpread(
    {},
    objectFragmentMap,
    {},
    interfaceFragmentMap
  );

  if (isFragmentedObjectType) {
    derivedTypeMap[schemaTypeName] = schemaTypeFields;
  }

  return derivedTypeMap;
};

var mergeFragmentedSelections = function mergeFragmentedSelections(_ref15) {
  var _ref15$selections = _ref15.selections,
    selections = _ref15$selections === void 0 ? [] : _ref15$selections;
  var subSelectionFieldMap = {};
  var fragments = [];
  selections.forEach(function(selection) {
    var fieldKind = selection.kind;

    if (fieldKind === _graphql.Kind.FIELD) {
      var fieldName = selection.name.value;

      if (!subSelectionFieldMap[fieldName]) {
        // initialize entry for this composing type
        subSelectionFieldMap[fieldName] = selection;
      } else {
        var alreadySelected = subSelectionFieldMap[fieldName].selectionSet
          ? subSelectionFieldMap[fieldName].selectionSet.selections
          : [];
        var selected = selection.selectionSet
          ? selection.selectionSet.selections
          : []; // If the field has a subselection (relationship field)

        if (alreadySelected.length && selected.length) {
          var _selections3 = [].concat(
            (0, _toConsumableArray2['default'])(alreadySelected),
            (0, _toConsumableArray2['default'])(selected)
          );

          subSelectionFieldMap[
            fieldName
          ].selectionSet.selections = mergeFragmentedSelections({
            selections: _selections3
          });
        }
      }
    } else {
      // Persist all fragments, to be merged later
      // If we already have this fragment, skip it.
      if (
        !fragments.some(function(anyElement) {
          return anyElement === selection;
        })
      ) {
        fragments.push(selection);
      }
    }
  }); // Return the aggregation of all fragments and merged relationship fields

  return [].concat(
    (0, _toConsumableArray2['default'])(
      (0, _values['default'])(subSelectionFieldMap)
    ),
    fragments
  );
};

var getDerivedTypes = function getDerivedTypes(_ref16) {
  var schemaTypeName = _ref16.schemaTypeName,
    derivedTypeMap = _ref16.derivedTypeMap,
    isFragmentedInterfaceType = _ref16.isFragmentedInterfaceType,
    isUnionType = _ref16.isUnionType,
    resolveInfo = _ref16.resolveInfo;
  var derivedTypes = [];

  if (isFragmentedInterfaceType) {
    // Get an array of all types implementing this interface type
    derivedTypes = (0, _utils.getInterfaceDerivedTypeNames)(
      resolveInfo.schema,
      schemaTypeName
    );
  } else if (isUnionType) {
    derivedTypes = (0, _keys['default'])(derivedTypeMap).sort();
  }

  return derivedTypes;
};

exports.getDerivedTypes = getDerivedTypes;

var getUnionDerivedTypes = function getUnionDerivedTypes(_ref17) {
  var _ref17$derivedTypeMap = _ref17.derivedTypeMap,
    derivedTypeMap =
      _ref17$derivedTypeMap === void 0 ? {} : _ref17$derivedTypeMap,
    resolveInfo = _ref17.resolveInfo;
  var typeMap = resolveInfo.schema.getTypeMap();
  var fragmentDefinitions = resolveInfo.fragments;
  var uniqueFragmentTypeMap = (0, _entries['default'])(derivedTypeMap).reduce(
    function(uniqueFragmentTypeMap, _ref18) {
      var _ref19 = (0, _slicedToArray2['default'])(_ref18, 2),
        typeName = _ref19[0],
        selections = _ref19[1];

      var definition = typeMap[typeName].astNode;

      if (
        (0, _types.isObjectTypeDefinition)({
          definition: definition
        })
      ) {
        uniqueFragmentTypeMap[typeName] = true;
      } else if (
        (0, _types.isInterfaceTypeDefinition)({
          definition: definition
        })
      ) {
        if (
          hasFieldSelection({
            selections: selections
          })
        ) {
          // then use the interface name in the label predicate,
          // as this is a case of a dynamic FRAGMENT_TYPE
          uniqueFragmentTypeMap[typeName] = true;
        } else if (
          isFragmentedSelection({
            selections: selections
          })
        ) {
          selections.forEach(function(selection) {
            var kind = selection.kind;

            if (
              isSelectionFragment({
                kind: kind
              })
            ) {
              var derivedTypeName = getFragmentTypeName({
                selection: selection,
                kind: kind,
                fragmentDefinitions: fragmentDefinitions
              });

              if (derivedTypeName) {
                uniqueFragmentTypeMap[derivedTypeName] = true;
              }
            }
          });
        }
      }

      return uniqueFragmentTypeMap;
    },
    {}
  );
  var typeNames = (0, _keys['default'])(uniqueFragmentTypeMap);
  return typeNames.sort();
};

exports.getUnionDerivedTypes = getUnionDerivedTypes;

var hasFieldSelection = function hasFieldSelection(_ref20) {
  var _ref20$selections = _ref20.selections,
    selections = _ref20$selections === void 0 ? [] : _ref20$selections;
  return selections.some(function(selection) {
    var kind = selection.kind;
    var name = selection.name ? selection.name.value : '';
    var isFieldSelection =
      kind === _graphql.Kind.FIELD ||
      (kind === _graphql.Kind.INLINE_FRAGMENT && !selection.typeCondition);
    return isFieldSelection && name !== '__typename';
  });
};

var isFragmentedSelection = function isFragmentedSelection(_ref21) {
  var selections = _ref21.selections;
  return selections.find(function(selection) {
    return isSelectionFragment({
      kind: selection.kind
    });
  });
};

exports.isFragmentedSelection = isFragmentedSelection;

var isSelectionFragment = function isSelectionFragment(_ref22) {
  var _ref22$kind = _ref22.kind,
    kind = _ref22$kind === void 0 ? '' : _ref22$kind;
  return (
    kind === _graphql.Kind.INLINE_FRAGMENT ||
    kind === _graphql.Kind.FRAGMENT_SPREAD
  );
};

var getFragmentTypeName = function getFragmentTypeName(_ref23) {
  var selection = _ref23.selection,
    kind = _ref23.kind,
    fragmentDefinitions = _ref23.fragmentDefinitions;
  var typeCondition = {};

  if (kind === _graphql.Kind.FRAGMENT_SPREAD) {
    var fragmentDefinition = fragmentDefinitions[selection.name.value];
    typeCondition = fragmentDefinition.typeCondition;
  } else typeCondition = selection.typeCondition;

  return typeCondition && typeCondition.name ? typeCondition.name.value : '';
};

var getFragmentSelections = function getFragmentSelections(_ref24) {
  var selection = _ref24.selection,
    kind = _ref24.kind,
    fragmentDefinitions = _ref24.fragmentDefinitions;
  var fragmentSelections = [];

  if (kind === _graphql.Kind.FRAGMENT_SPREAD) {
    var fragmentDefinition = fragmentDefinitions[selection.name.value];
    fragmentSelections = fragmentDefinition.selectionSet.selections;
  } else {
    fragmentSelections = selection.selectionSet.selections;
  }

  return fragmentSelections;
};

var buildComposedTypeListComprehension = function buildComposedTypeListComprehension(
  _ref25
) {
  var derivedType = _ref25.derivedType,
    isUnionType = _ref25.isUnionType,
    safeVariableName = _ref25.safeVariableName,
    mergedTypeSelections = _ref25.mergedTypeSelections,
    queryParams = _ref25.queryParams,
    isInterfaceTypeFragment = _ref25.isInterfaceTypeFragment,
    _ref25$fragmentedQuer = _ref25.fragmentedQuery,
    fragmentedQuery =
      _ref25$fragmentedQuer === void 0 ? '' : _ref25$fragmentedQuer,
    resolveInfo = _ref25.resolveInfo;
  var staticFragmentTypeField = 'FRAGMENT_TYPE: "'.concat(derivedType, '"');
  var typeMapProjection = ''
    .concat(safeVariableName, ' { ')
    .concat([staticFragmentTypeField, fragmentedQuery].join(', '), ' }'); // For fragments on interface types implemented by unioned object types

  if (isUnionType && isInterfaceTypeFragment) {
    var usesFragments = isFragmentedSelection({
      selections: mergedTypeSelections
    });

    if (usesFragments) {
      typeMapProjection = fragmentedQuery;
    } else {
      var dynamicFragmentTypeField = (0, _translate.fragmentType)(
        safeVariableName,
        derivedType
      );
      typeMapProjection = ''
        .concat(safeVariableName, ' { ')
        .concat([dynamicFragmentTypeField, fragmentedQuery].join(', '), ' }'); // set param for dynamic fragment field

      var fragmentTypeParams = (0, _translate.derivedTypesParams)({
        isInterfaceType: isInterfaceTypeFragment,
        schema: resolveInfo.schema,
        schemaTypeName: derivedType
      });
      queryParams = _objectSpread({}, queryParams, {}, fragmentTypeParams);
    }
  }

  var labelFilteringPredicate = 'WHERE "'
    .concat(derivedType, '" IN labels(')
    .concat(safeVariableName, ')');
  var typeSpecificListComprehension = '['
    .concat(safeVariableName, ' IN [')
    .concat(safeVariableName, '] ')
    .concat(labelFilteringPredicate, ' | ')
    .concat(typeMapProjection, ']');
  return [typeSpecificListComprehension, queryParams];
}; // See: https://neo4j.com/docs/cypher-manual/current/syntax/operators/#syntax-concatenating-two-lists

var concatenateComposedTypeLists = function concatenateComposedTypeLists(
  _ref26
) {
  var fragmentedQuery = _ref26.fragmentedQuery;
  return fragmentedQuery.length
    ? 'head('.concat(fragmentedQuery.join(' + '), ')')
    : '';
};
