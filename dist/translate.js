'use strict';

var _interopRequireDefault = require('@babel/runtime-corejs2/helpers/interopRequireDefault');

var _Object$defineProperty2 = require('@babel/runtime-corejs2/core-js/object/define-property');

_Object$defineProperty2(exports, '__esModule', {
  value: true
});

exports.translateMutation = exports.translateQuery = exports.neo4jType = exports.neo4jTypeField = exports.nodeTypeFieldOnRelationType = exports.relationTypeFieldOnNodeType = exports.relationFieldOnNodeType = exports.customCypherField = exports.derivedTypesParams = exports.fragmentType = void 0;

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

var _isInteger = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/number/is-integer')
);

var _entries = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/entries')
);

var _keys = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/object/keys')
);

var _toConsumableArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/toConsumableArray')
);

var _isArray = _interopRequireDefault(
  require('@babel/runtime-corejs2/core-js/array/is-array')
);

var _defineProperty3 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/defineProperty')
);

var _slicedToArray2 = _interopRequireDefault(
  require('@babel/runtime-corejs2/helpers/slicedToArray')
);

var _utils = require('./utils');

var _graphql = require('graphql');

var _selections = require('./selections');

var _lodash = _interopRequireDefault(require('lodash'));

var _neo4jDriver = _interopRequireDefault(require('neo4j-driver'));

var _types = require('./augment/types/types');

var _federation = require('./federation');

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

var derivedTypesParamName = function derivedTypesParamName(schemaTypeName) {
  return ''.concat(schemaTypeName, '_derivedTypes');
};

var fragmentType = function fragmentType(varName, schemaTypeName) {
  return 'FRAGMENT_TYPE: head( [ label IN labels('
    .concat(varName, ') WHERE label IN $')
    .concat(derivedTypesParamName(schemaTypeName), ' ] )');
};

exports.fragmentType = fragmentType;

var derivedTypesParams = function derivedTypesParams(_ref) {
  var isInterfaceType = _ref.isInterfaceType,
    isUnionType = _ref.isUnionType,
    schema = _ref.schema,
    schemaTypeName = _ref.schemaTypeName,
    usesFragments = _ref.usesFragments;
  var params = {};

  if (!usesFragments) {
    if (isInterfaceType) {
      var paramName = derivedTypesParamName(schemaTypeName);
      params[paramName] = (0, _utils.getInterfaceDerivedTypeNames)(
        schema,
        schemaTypeName
      );
    } else if (isUnionType) {
      var _paramName = derivedTypesParamName(schemaTypeName);

      var typeMap = schema.getTypeMap();
      var schemaType = typeMap[schemaTypeName];
      var types = schemaType.getTypes();
      params[_paramName] = types.map(function(type) {
        return type.name;
      });
    }
  }

  return params;
};

exports.derivedTypesParams = derivedTypesParams;

var customCypherField = function customCypherField(_ref2) {
  var customCypherStatement = _ref2.customCypherStatement,
    cypherParams = _ref2.cypherParams,
    paramIndex = _ref2.paramIndex,
    schemaTypeRelation = _ref2.schemaTypeRelation,
    isObjectTypeField = _ref2.isObjectTypeField,
    isInterfaceTypeField = _ref2.isInterfaceTypeField,
    isUnionTypeField = _ref2.isUnionTypeField,
    usesFragments = _ref2.usesFragments,
    schemaTypeFields = _ref2.schemaTypeFields,
    derivedTypeMap = _ref2.derivedTypeMap,
    initial = _ref2.initial,
    fieldName = _ref2.fieldName,
    fieldType = _ref2.fieldType,
    nestedVariable = _ref2.nestedVariable,
    variableName = _ref2.variableName,
    headSelection = _ref2.headSelection,
    schemaType = _ref2.schemaType,
    innerSchemaType = _ref2.innerSchemaType,
    resolveInfo = _ref2.resolveInfo,
    subSelection = _ref2.subSelection,
    skipLimit = _ref2.skipLimit,
    commaIfTail = _ref2.commaIfTail,
    tailParams = _ref2.tailParams,
    isFederatedOperation = _ref2.isFederatedOperation,
    context = _ref2.context;

  var _buildMapProjection = buildMapProjection({
      isComputedField: true,
      schemaType: innerSchemaType,
      isObjectType: isObjectTypeField,
      isInterfaceType: isInterfaceTypeField,
      isUnionType: isUnionTypeField,
      usesFragments: usesFragments,
      safeVariableName: nestedVariable,
      subQuery: subSelection[0],
      schemaTypeFields: schemaTypeFields,
      derivedTypeMap: derivedTypeMap,
      resolveInfo: resolveInfo
    }),
    _buildMapProjection2 = (0, _slicedToArray2['default'])(
      _buildMapProjection,
      2
    ),
    mapProjection = _buildMapProjection2[0],
    labelPredicate = _buildMapProjection2[1];

  var headListWrapperPrefix = ''.concat(
    !(0, _utils.isArrayType)(fieldType) ? 'head(' : ''
  );
  var headListWrapperSuffix = ''.concat(
    !(0, _utils.isArrayType)(fieldType) ? ')' : ''
  ); // For @cypher fields with object payload types, customCypherField is
  // called after the recursive call to compute a subSelection. But recurse()
  // increments paramIndex. So here we need to decrement it in order to map
  // appropriately to the indexed keys produced in getFilterParams()

  var cypherFieldParamsIndex = paramIndex - 1;

  if (schemaTypeRelation) {
    variableName = ''.concat(variableName, '_relation');
  }

  return _objectSpread(
    {
      initial: ''
        .concat(initial)
        .concat(fieldName, ': ')
        .concat(headListWrapperPrefix)
        .concat(labelPredicate ? '['.concat(nestedVariable, ' IN ') : '', '[ ')
        .concat(nestedVariable, ' IN apoc.cypher.runFirstColumn("')
        .concat(customCypherStatement, '", {')
        .concat(
          (0, _utils.cypherDirectiveArgs)(
            variableName,
            headSelection,
            cypherParams,
            schemaType,
            resolveInfo,
            cypherFieldParamsIndex,
            isFederatedOperation,
            context
          ),
          '}, true) '
        )
        .concat(labelPredicate, '| ')
        .concat(labelPredicate ? ''.concat(nestedVariable, '] | ') : '')
        .concat(mapProjection, ']')
        .concat(headListWrapperSuffix)
        .concat(skipLimit, ' ')
        .concat(commaIfTail)
    },
    tailParams
  );
};

exports.customCypherField = customCypherField;

var relationFieldOnNodeType = function relationFieldOnNodeType(_ref3) {
  var initial = _ref3.initial,
    fieldName = _ref3.fieldName,
    fieldType = _ref3.fieldType,
    variableName = _ref3.variableName,
    relDirection = _ref3.relDirection,
    relType = _ref3.relType,
    nestedVariable = _ref3.nestedVariable,
    schemaTypeFields = _ref3.schemaTypeFields,
    derivedTypeMap = _ref3.derivedTypeMap,
    isObjectTypeField = _ref3.isObjectTypeField,
    isInterfaceTypeField = _ref3.isInterfaceTypeField,
    isUnionTypeField = _ref3.isUnionTypeField,
    usesFragments = _ref3.usesFragments,
    innerSchemaType = _ref3.innerSchemaType,
    paramIndex = _ref3.paramIndex,
    fieldArgs = _ref3.fieldArgs,
    filterParams = _ref3.filterParams,
    selectionFilters = _ref3.selectionFilters,
    neo4jTypeArgs = _ref3.neo4jTypeArgs,
    selections = _ref3.selections,
    schemaType = _ref3.schemaType,
    subSelection = _ref3.subSelection,
    skipLimit = _ref3.skipLimit,
    commaIfTail = _ref3.commaIfTail,
    tailParams = _ref3.tailParams,
    resolveInfo = _ref3.resolveInfo,
    cypherParams = _ref3.cypherParams;
  var safeVariableName = (0, _utils.safeVar)(nestedVariable);
  var allParams = (0, _utils.innerFilterParams)(filterParams, neo4jTypeArgs);
  var queryParams = (0, _utils.paramsToString)(
    _lodash['default'].filter(allParams, function(param) {
      return !(0, _isArray['default'])(param.value);
    })
  );

  var _processFilterArgumen = processFilterArgument({
      fieldArgs: fieldArgs,
      schemaType: innerSchemaType,
      variableName: nestedVariable,
      resolveInfo: resolveInfo,
      params: selectionFilters,
      paramIndex: paramIndex
    }),
    _processFilterArgumen2 = (0, _slicedToArray2['default'])(
      _processFilterArgumen,
      2
    ),
    filterPredicates = _processFilterArgumen2[0],
    serializedFilterParam = _processFilterArgumen2[1];

  var filterParamKey = ''.concat(tailParams.paramIndex, '_filter');
  var fieldArgumentParams = subSelection[1];
  var filterParam = fieldArgumentParams[filterParamKey];

  if (
    filterParam &&
    typeof serializedFilterParam[filterParamKey] !== 'undefined'
  ) {
    subSelection[1][filterParamKey] = serializedFilterParam[filterParamKey];
  }

  var arrayFilterParams = _lodash['default'].pickBy(filterParams, function(
    param,
    keyName
  ) {
    return (0, _isArray['default'])(param.value) && !('orderBy' === keyName);
  });

  var neo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
    filterParams,
    nestedVariable,
    neo4jTypeArgs
  );

  var arrayPredicates = _lodash['default'].map(arrayFilterParams, function(
    value,
    key
  ) {
    var param = _lodash['default'].find(allParams, function(param) {
      return param.key === key;
    });

    return ''
      .concat(safeVariableName, '.')
      .concat((0, _utils.safeVar)(key), ' IN $')
      .concat(param.value.index, '_')
      .concat(key);
  });

  var subQuery = subSelection[0];

  var _buildMapProjection3 = buildMapProjection({
      schemaType: innerSchemaType,
      isObjectType: isObjectTypeField,
      isInterfaceType: isInterfaceTypeField,
      isUnionType: isUnionTypeField,
      usesFragments: usesFragments,
      safeVariableName: safeVariableName,
      subQuery: subQuery,
      schemaTypeFields: schemaTypeFields,
      derivedTypeMap: derivedTypeMap,
      resolveInfo: resolveInfo
    }),
    _buildMapProjection4 = (0, _slicedToArray2['default'])(
      _buildMapProjection3,
      2
    ),
    mapProjection = _buildMapProjection4[0],
    labelPredicate = _buildMapProjection4[1];

  subSelection[1] = _objectSpread({}, subSelection[1]);
  var whereClauses = [labelPredicate]
    .concat(
      (0, _toConsumableArray2['default'])(neo4jTypeClauses),
      (0, _toConsumableArray2['default'])(arrayPredicates),
      (0, _toConsumableArray2['default'])(filterPredicates)
    )
    .filter(function(predicate) {
      return !!predicate;
    });
  var orderByParam = filterParams['orderBy'];
  var temporalOrdering = temporalOrderingFieldExists(schemaType, filterParams);
  tailParams.initial = ''
    .concat(initial)
    .concat(fieldName, ': ')
    .concat(!(0, _utils.isArrayType)(fieldType) ? 'head(' : '')
    .concat(
      orderByParam
        ? temporalOrdering
          ? '[sortedElement IN apoc.coll.sortMulti('
          : 'apoc.coll.sortMulti('
        : '',
      '[('
    )
    .concat((0, _utils.safeVar)(variableName), ')')
    .concat(
      isUnionTypeField
        ? '--'
        : ''
            .concat(
              relDirection === 'in' || relDirection === 'IN' ? '<' : '',
              '-[:'
            )
            .concat((0, _utils.safeLabel)([relType]), ']-')
            .concat(
              relDirection === 'out' || relDirection === 'OUT' ? '>' : ''
            ),
      '('
    )
    .concat(
      safeVariableName,
      ':'.concat(
        (0, _utils.safeLabel)(
          [innerSchemaType.name].concat(
            (0, _toConsumableArray2['default'])(
              (0, _utils.getAdditionalLabels)(
                resolveInfo.schema.getType(innerSchemaType.name),
                cypherParams
              )
            )
          )
        )
      )
    )
    .concat(queryParams, ')')
    .concat(
      whereClauses.length > 0
        ? ' WHERE '.concat(whereClauses.join(' AND '))
        : '',
      ' | '
    )
    .concat(mapProjection, ']')
    .concat(
      orderByParam
        ? ', ['
            .concat(buildSortMultiArgs(orderByParam), '])')
            .concat(
              temporalOrdering
                ? ' | sortedElement { .*,  '.concat(
                    neo4jTypeOrderingClauses(selections, innerSchemaType),
                    '}]'
                  )
                : ''
            )
        : ''
    )
    .concat(!(0, _utils.isArrayType)(fieldType) ? ')' : '')
    .concat(skipLimit, ' ')
    .concat(commaIfTail);
  return [tailParams, subSelection];
};

exports.relationFieldOnNodeType = relationFieldOnNodeType;

var relationTypeFieldOnNodeType = function relationTypeFieldOnNodeType(_ref4) {
  var innerSchemaTypeRelation = _ref4.innerSchemaTypeRelation,
    initial = _ref4.initial,
    fieldName = _ref4.fieldName,
    subSelection = _ref4.subSelection,
    skipLimit = _ref4.skipLimit,
    commaIfTail = _ref4.commaIfTail,
    tailParams = _ref4.tailParams,
    fieldType = _ref4.fieldType,
    variableName = _ref4.variableName,
    schemaType = _ref4.schemaType,
    innerSchemaType = _ref4.innerSchemaType,
    nestedVariable = _ref4.nestedVariable,
    queryParams = _ref4.queryParams,
    filterParams = _ref4.filterParams,
    neo4jTypeArgs = _ref4.neo4jTypeArgs,
    resolveInfo = _ref4.resolveInfo,
    selectionFilters = _ref4.selectionFilters,
    paramIndex = _ref4.paramIndex,
    fieldArgs = _ref4.fieldArgs,
    cypherParams = _ref4.cypherParams;

  if (innerSchemaTypeRelation.from === innerSchemaTypeRelation.to) {
    tailParams.initial = ''
      .concat(initial)
      .concat(fieldName, ': {')
      .concat(subSelection[0], '}')
      .concat(skipLimit, ' ')
      .concat(commaIfTail);
    return [tailParams, subSelection];
  }

  var relationshipVariableName = ''.concat(nestedVariable, '_relation');
  var neo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
    filterParams,
    relationshipVariableName,
    neo4jTypeArgs
  );

  var _processFilterArgumen3 = processFilterArgument({
      fieldArgs: fieldArgs,
      schemaType: innerSchemaType,
      variableName: relationshipVariableName,
      resolveInfo: resolveInfo,
      params: selectionFilters,
      paramIndex: paramIndex,
      rootIsRelationType: true
    }),
    _processFilterArgumen4 = (0, _slicedToArray2['default'])(
      _processFilterArgumen3,
      2
    ),
    filterPredicates = _processFilterArgumen4[0],
    serializedFilterParam = _processFilterArgumen4[1];

  var filterParamKey = ''.concat(tailParams.paramIndex, '_filter');
  var fieldArgumentParams = subSelection[1];
  var filterParam = fieldArgumentParams[filterParamKey];

  if (
    filterParam &&
    typeof serializedFilterParam[filterParamKey] !== 'undefined'
  ) {
    subSelection[1][filterParamKey] = serializedFilterParam[filterParamKey];
  }

  var whereClauses = [].concat(
    (0, _toConsumableArray2['default'])(neo4jTypeClauses),
    (0, _toConsumableArray2['default'])(filterPredicates)
  );
  tailParams.initial = ''
    .concat(initial)
    .concat(fieldName, ': ')
    .concat(!(0, _utils.isArrayType)(fieldType) ? 'head(' : '', '[(')
    .concat((0, _utils.safeVar)(variableName), ')')
    .concat(schemaType.name === innerSchemaTypeRelation.to ? '<' : '', '-[')
    .concat((0, _utils.safeVar)(relationshipVariableName), ':')
    .concat((0, _utils.safeLabel)(innerSchemaTypeRelation.name))
    .concat(queryParams, ']-')
    .concat(schemaType.name === innerSchemaTypeRelation.from ? '>' : '', '(:')
    .concat(
      (0, _utils.safeLabel)(
        schemaType.name === innerSchemaTypeRelation.from
          ? [innerSchemaTypeRelation.to].concat(
              (0, _toConsumableArray2['default'])(
                (0, _utils.getAdditionalLabels)(
                  resolveInfo.schema.getType(innerSchemaTypeRelation.to),
                  cypherParams
                )
              )
            )
          : [innerSchemaTypeRelation.from].concat(
              (0, _toConsumableArray2['default'])(
                (0, _utils.getAdditionalLabels)(
                  resolveInfo.schema.getType(innerSchemaTypeRelation.from),
                  cypherParams
                )
              )
            )
      ),
      ') '
    )
    .concat(
      whereClauses.length > 0
        ? 'WHERE '.concat(whereClauses.join(' AND '), ' ')
        : '',
      '| '
    )
    .concat(relationshipVariableName, ' {')
    .concat(subSelection[0], '}]')
    .concat(!(0, _utils.isArrayType)(fieldType) ? ')' : '')
    .concat(skipLimit, ' ')
    .concat(commaIfTail);
  return [tailParams, subSelection];
};

exports.relationTypeFieldOnNodeType = relationTypeFieldOnNodeType;

var nodeTypeFieldOnRelationType = function nodeTypeFieldOnRelationType(_ref5) {
  var initial = _ref5.initial,
    fieldName = _ref5.fieldName,
    fieldType = _ref5.fieldType,
    variableName = _ref5.variableName,
    nestedVariable = _ref5.nestedVariable,
    queryParams = _ref5.queryParams,
    subSelection = _ref5.subSelection,
    skipLimit = _ref5.skipLimit,
    commaIfTail = _ref5.commaIfTail,
    tailParams = _ref5.tailParams,
    filterParams = _ref5.filterParams,
    neo4jTypeArgs = _ref5.neo4jTypeArgs,
    schemaTypeRelation = _ref5.schemaTypeRelation,
    innerSchemaType = _ref5.innerSchemaType,
    schemaTypeFields = _ref5.schemaTypeFields,
    derivedTypeMap = _ref5.derivedTypeMap,
    isObjectTypeField = _ref5.isObjectTypeField,
    isInterfaceTypeField = _ref5.isInterfaceTypeField,
    isUnionTypeField = _ref5.isUnionTypeField,
    usesFragments = _ref5.usesFragments,
    paramIndex = _ref5.paramIndex,
    parentSelectionInfo = _ref5.parentSelectionInfo,
    resolveInfo = _ref5.resolveInfo,
    selectionFilters = _ref5.selectionFilters,
    fieldArgs = _ref5.fieldArgs,
    cypherParams = _ref5.cypherParams;
  var safeVariableName = (0, _utils.safeVar)(variableName);

  if (
    (0, _utils.isRootSelection)({
      selectionInfo: parentSelectionInfo,
      rootType: 'relationship'
    }) &&
    (0, _utils.isRelationTypeDirectedField)(fieldName)
  ) {
    var _buildMapProjection5 = buildMapProjection({
        schemaType: innerSchemaType,
        isObjectType: isObjectTypeField,
        isInterfaceType: isInterfaceTypeField,
        isUnionType: isUnionTypeField,
        usesFragments: usesFragments,
        safeVariableName: safeVariableName,
        subQuery: subSelection[0],
        schemaTypeFields: schemaTypeFields,
        derivedTypeMap: derivedTypeMap,
        resolveInfo: resolveInfo
      }),
      _buildMapProjection6 = (0, _slicedToArray2['default'])(
        _buildMapProjection5,
        2
      ),
      mapProjection = _buildMapProjection6[0],
      labelPredicate = _buildMapProjection6[1];

    var translationParams = relationTypeMutationPayloadField({
      initial: initial,
      fieldName: fieldName,
      mapProjection: mapProjection,
      skipLimit: skipLimit,
      commaIfTail: commaIfTail,
      tailParams: tailParams,
      parentSelectionInfo: parentSelectionInfo
    });
    return [translationParams, subSelection];
  } // Normal case of schemaType with a relationship directive

  return directedNodeTypeFieldOnRelationType({
    initial: initial,
    fieldName: fieldName,
    fieldType: fieldType,
    variableName: variableName,
    queryParams: queryParams,
    nestedVariable: nestedVariable,
    subSelection: subSelection,
    skipLimit: skipLimit,
    commaIfTail: commaIfTail,
    tailParams: tailParams,
    schemaTypeRelation: schemaTypeRelation,
    innerSchemaType: innerSchemaType,
    isInterfaceTypeField: isInterfaceTypeField,
    filterParams: filterParams,
    neo4jTypeArgs: neo4jTypeArgs,
    paramIndex: paramIndex,
    resolveInfo: resolveInfo,
    selectionFilters: selectionFilters,
    fieldArgs: fieldArgs,
    cypherParams: cypherParams
  });
};

exports.nodeTypeFieldOnRelationType = nodeTypeFieldOnRelationType;

var relationTypeMutationPayloadField = function relationTypeMutationPayloadField(
  _ref6
) {
  var initial = _ref6.initial,
    fieldName = _ref6.fieldName,
    mapProjection = _ref6.mapProjection,
    skipLimit = _ref6.skipLimit,
    commaIfTail = _ref6.commaIfTail,
    tailParams = _ref6.tailParams,
    parentSelectionInfo = _ref6.parentSelectionInfo;
  return _objectSpread(
    {
      initial: ''
        .concat(initial)
        .concat(fieldName, ': ')
        .concat(mapProjection)
        .concat(skipLimit, ' ')
        .concat(commaIfTail)
    },
    tailParams,
    {
      variableName:
        fieldName === 'from' ? parentSelectionInfo.to : parentSelectionInfo.from
    }
  );
}; // TODO refactor

var directedNodeTypeFieldOnRelationType = function directedNodeTypeFieldOnRelationType(
  _ref7
) {
  var initial = _ref7.initial,
    fieldName = _ref7.fieldName,
    fieldType = _ref7.fieldType,
    variableName = _ref7.variableName,
    queryParams = _ref7.queryParams,
    nestedVariable = _ref7.nestedVariable,
    subSelection = _ref7.subSelection,
    skipLimit = _ref7.skipLimit,
    commaIfTail = _ref7.commaIfTail,
    tailParams = _ref7.tailParams,
    schemaTypeRelation = _ref7.schemaTypeRelation,
    innerSchemaType = _ref7.innerSchemaType,
    isInterfaceTypeField = _ref7.isInterfaceTypeField,
    filterParams = _ref7.filterParams,
    neo4jTypeArgs = _ref7.neo4jTypeArgs,
    paramIndex = _ref7.paramIndex,
    resolveInfo = _ref7.resolveInfo,
    selectionFilters = _ref7.selectionFilters,
    fieldArgs = _ref7.fieldArgs,
    cypherParams = _ref7.cypherParams;
  var relType = schemaTypeRelation.name;
  var fromTypeName = schemaTypeRelation.from;
  var toTypeName = schemaTypeRelation.to;
  var isFromField = fieldName === fromTypeName || fieldName === 'from';
  var isToField = fieldName === toTypeName || fieldName === 'to'; // Since the translations are significantly different,
  // we first check whether the relationship is reflexive

  if (fromTypeName === toTypeName) {
    var relationshipVariableName = ''
      .concat(variableName, '_')
      .concat(isFromField ? 'from' : 'to', '_relation');

    if ((0, _utils.isRelationTypeDirectedField)(fieldName)) {
      var temporalFieldRelationshipVariableName = ''.concat(
        nestedVariable,
        '_relation'
      );
      var neo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
        filterParams,
        temporalFieldRelationshipVariableName,
        neo4jTypeArgs
      );

      var _processFilterArgumen5 = processFilterArgument({
          fieldArgs: fieldArgs,
          schemaType: innerSchemaType,
          variableName: relationshipVariableName,
          resolveInfo: resolveInfo,
          params: selectionFilters,
          paramIndex: paramIndex,
          rootIsRelationType: true
        }),
        _processFilterArgumen6 = (0, _slicedToArray2['default'])(
          _processFilterArgumen5,
          2
        ),
        filterPredicates = _processFilterArgumen6[0],
        serializedFilterParam = _processFilterArgumen6[1];

      var filterParamKey = ''.concat(tailParams.paramIndex, '_filter');
      var fieldArgumentParams = subSelection[1];
      var filterParam = fieldArgumentParams[filterParamKey];

      if (
        filterParam &&
        typeof serializedFilterParam[filterParamKey] !== 'undefined'
      ) {
        subSelection[1][filterParamKey] = serializedFilterParam[filterParamKey];
      }

      var whereClauses = [].concat(
        (0, _toConsumableArray2['default'])(neo4jTypeClauses),
        (0, _toConsumableArray2['default'])(filterPredicates)
      );
      tailParams.initial = ''
        .concat(initial)
        .concat(fieldName, ': ')
        .concat(!(0, _utils.isArrayType)(fieldType) ? 'head(' : '', '[(')
        .concat((0, _utils.safeVar)(variableName), ')')
        .concat(isFromField ? '<' : '', '-[')
        .concat((0, _utils.safeVar)(relationshipVariableName), ':')
        .concat((0, _utils.safeLabel)(relType))
        .concat(queryParams, ']-')
        .concat(isToField ? '>' : '', '(')
        .concat((0, _utils.safeVar)(nestedVariable))
        .concat(
          !isInterfaceTypeField
            ? ':'.concat(
                (0, _utils.safeLabel)(
                  [fromTypeName].concat(
                    (0, _toConsumableArray2['default'])(
                      (0, _utils.getAdditionalLabels)(
                        resolveInfo.schema.getType(fromTypeName),
                        cypherParams
                      )
                    )
                  )
                )
              )
            : '',
          ') '
        )
        .concat(
          whereClauses.length > 0
            ? 'WHERE '.concat(whereClauses.join(' AND '), ' ')
            : '',
          '| '
        )
        .concat(relationshipVariableName, ' {')
        .concat(
          // TODO switch to using buildMapProjection to support fragments
          isInterfaceTypeField
            ? ''
                .concat(fragmentType(nestedVariable, innerSchemaType.name))
                .concat(subSelection[0] ? ', '.concat(subSelection[0]) : '')
            : subSelection[0],
          '}]'
        )
        .concat(!(0, _utils.isArrayType)(fieldType) ? ')' : '')
        .concat(skipLimit, ' ')
        .concat(commaIfTail);
      return [tailParams, subSelection];
    } else {
      tailParams.initial = ''
        .concat(initial)
        .concat(fieldName, ': ')
        .concat(variableName, ' {')
        .concat(subSelection[0], '}')
        .concat(skipLimit, ' ')
        .concat(commaIfTail); // Case of a renamed directed field
      // e.g., 'from: Movie' -> 'Movie: Movie'

      return [tailParams, subSelection];
    }
  } else {
    variableName = variableName + '_relation';
    tailParams.initial = ''
      .concat(initial)
      .concat(fieldName, ': ')
      .concat(!(0, _utils.isArrayType)(fieldType) ? 'head(' : '', '[(:')
      .concat(
        (0, _utils.safeLabel)(
          isFromField
            ? [toTypeName].concat(
                (0, _toConsumableArray2['default'])(
                  (0, _utils.getAdditionalLabels)(
                    resolveInfo.schema.getType(toTypeName),
                    cypherParams
                  )
                )
              )
            : [fromTypeName].concat(
                (0, _toConsumableArray2['default'])(
                  (0, _utils.getAdditionalLabels)(
                    resolveInfo.schema.getType(fromTypeName),
                    cypherParams
                  )
                )
              )
        ),
        ')'
      )
      .concat(isFromField ? '<' : '', '-[')
      .concat((0, _utils.safeVar)(variableName), ']-')
      .concat(isToField ? '>' : '', '(')
      .concat((0, _utils.safeVar)(nestedVariable), ':')
      .concat(
        !isInterfaceTypeField
          ? (0, _utils.safeLabel)(
              [innerSchemaType.name].concat(
                (0, _toConsumableArray2['default'])(
                  (0, _utils.getAdditionalLabels)(
                    resolveInfo.schema.getType(innerSchemaType.name),
                    cypherParams
                  )
                )
              )
            )
          : ''
      )
      .concat(queryParams, ') | ')
      .concat(nestedVariable, ' {')
      .concat(
        // TODO switch to using buildMapProjection to support fragments
        isInterfaceTypeField
          ? ''
              .concat(fragmentType(nestedVariable, innerSchemaType.name))
              .concat(subSelection[0] ? ', '.concat(subSelection[0]) : '')
          : subSelection[0],
        '}]'
      )
      .concat(!(0, _utils.isArrayType)(fieldType) ? ')' : '')
      .concat(skipLimit, ' ')
      .concat(commaIfTail);
    return [tailParams, subSelection];
  }
};

var neo4jTypeField = function neo4jTypeField(_ref8) {
  var initial = _ref8.initial,
    fieldName = _ref8.fieldName,
    commaIfTail = _ref8.commaIfTail,
    tailParams = _ref8.tailParams,
    parentSelectionInfo = _ref8.parentSelectionInfo,
    secondParentSelectionInfo = _ref8.secondParentSelectionInfo;
  var parentFieldName = parentSelectionInfo.fieldName;
  var parentFieldType = parentSelectionInfo.fieldType;
  var parentSchemaType = parentSelectionInfo.schemaType;
  var parentVariableName = parentSelectionInfo.variableName;
  var secondParentVariableName = secondParentSelectionInfo.variableName; // Initially assume that the parent type of the temporal type
  // containing this temporal field was a node

  var variableName = parentVariableName;
  var fieldIsArray = (0, _utils.isArrayType)(parentFieldType);

  if (parentSchemaType && !(0, _utils.isNodeType)(parentSchemaType.astNode)) {
    // initial assumption wrong, build appropriate relationship variable
    if (
      (0, _utils.isRootSelection)({
        selectionInfo: secondParentSelectionInfo,
        rootType: 'relationship'
      })
    ) {
      // If the second parent selection scope above is the root
      // then we need to use the root variableName
      variableName = ''.concat(secondParentVariableName, '_relation');
    } else if ((0, _utils.isRelationTypePayload)(parentSchemaType)) {
      var parentSchemaTypeRelation = (0, _utils.getRelationTypeDirective)(
        parentSchemaType.astNode
      );

      if (parentSchemaTypeRelation.from === parentSchemaTypeRelation.to) {
        variableName = ''.concat(variableName, '_relation');
      } else {
        variableName = ''.concat(variableName, '_relation');
      }
    }
  }

  return _objectSpread(
    {
      initial: ''
        .concat(initial, ' ')
        .concat(fieldName, ': ')
        .concat(
          fieldIsArray
            ? ''
                .concat(
                  fieldName === 'formatted'
                    ? 'toString(INSTANCE)'
                    : 'INSTANCE.'.concat(fieldName),
                  ' '
                )
                .concat(commaIfTail)
            : ''.concat(
                fieldName === 'formatted'
                  ? 'toString('
                      .concat((0, _utils.safeVar)(variableName), '.')
                      .concat(parentFieldName, ') ')
                      .concat(commaIfTail)
                  : ''
                      .concat((0, _utils.safeVar)(variableName), '.')
                      .concat(parentFieldName, '.')
                      .concat(fieldName, ' ')
                      .concat(commaIfTail)
              )
        )
    },
    tailParams
  );
};

exports.neo4jTypeField = neo4jTypeField;

var neo4jType = function neo4jType(_ref9) {
  var initial = _ref9.initial,
    fieldName = _ref9.fieldName,
    subSelection = _ref9.subSelection,
    commaIfTail = _ref9.commaIfTail,
    tailParams = _ref9.tailParams,
    variableName = _ref9.variableName,
    nestedVariable = _ref9.nestedVariable,
    fieldType = _ref9.fieldType,
    schemaType = _ref9.schemaType,
    schemaTypeRelation = _ref9.schemaTypeRelation,
    parentSelectionInfo = _ref9.parentSelectionInfo;
  var parentVariableName = parentSelectionInfo.variableName;
  var parentFilterParams = parentSelectionInfo.filterParams;
  var parentSchemaType = parentSelectionInfo.schemaType;
  var safeVariableName = (0, _utils.safeVar)(variableName);
  var relationshipVariableSuffix = 'relation';
  var fieldIsArray = (0, _utils.isArrayType)(fieldType);

  if (!(0, _utils.isNodeType)(schemaType.astNode)) {
    if (
      (0, _utils.isRelationTypePayload)(schemaType) &&
      schemaTypeRelation.from === schemaTypeRelation.to
    ) {
      variableName = ''
        .concat(nestedVariable, '_')
        .concat(relationshipVariableSuffix);
    } else {
      if (fieldIsArray) {
        if (
          (0, _utils.isRootSelection)({
            selectionInfo: parentSelectionInfo,
            rootType: 'relationship'
          })
        ) {
          variableName = ''
            .concat(parentVariableName, '_')
            .concat(relationshipVariableSuffix);
        } else {
          variableName = ''
            .concat(variableName, '_')
            .concat(relationshipVariableSuffix);
        }
      } else {
        variableName = ''
          .concat(nestedVariable, '_')
          .concat(relationshipVariableSuffix);
      }
    }
  }

  return _objectSpread(
    {
      initial: ''
        .concat(initial)
        .concat(fieldName, ': ')
        .concat(
          fieldIsArray
            ? 'reduce(a = [], INSTANCE IN '
                .concat(variableName, '.')
                .concat(fieldName, ' | a + {')
                .concat(subSelection[0], '})')
                .concat(commaIfTail)
            : temporalOrderingFieldExists(parentSchemaType, parentFilterParams)
            ? ''
                .concat(safeVariableName, '.')
                .concat(fieldName)
                .concat(commaIfTail)
            : '{'.concat(subSelection[0], '}').concat(commaIfTail)
        )
    },
    tailParams
  );
}; // Query API root operation branch

exports.neo4jType = neo4jType;

var translateQuery = function translateQuery(_ref10) {
  var resolveInfo = _ref10.resolveInfo,
    context = _ref10.context,
    first = _ref10.first,
    offset = _ref10.offset,
    _id = _ref10._id,
    orderBy = _ref10.orderBy,
    otherParams = _ref10.otherParams;

  var _typeIdentifiers = (0, _utils.typeIdentifiers)(resolveInfo.returnType),
    typeName = _typeIdentifiers.typeName,
    variableName = _typeIdentifiers.variableName;

  var schemaType = resolveInfo.schema.getType(typeName);
  var typeMap = resolveInfo.schema.getTypeMap();
  var selections = (0, _utils.getPayloadSelections)(resolveInfo);
  var isInterfaceType = (0, _utils.isGraphqlInterfaceType)(schemaType);
  var isUnionType = (0, _utils.isGraphqlUnionType)(schemaType);
  var isObjectType = (0, _utils.isGraphqlObjectType)(schemaType);

  var _filterNullParams = (0, _utils.filterNullParams)({
      offset: offset,
      first: first,
      otherParams: otherParams
    }),
    _filterNullParams2 = (0, _slicedToArray2['default'])(_filterNullParams, 2),
    nullParams = _filterNullParams2[0],
    nonNullParams = _filterNullParams2[1]; // Check is this is a federated operation, in which case get the lookup keys

  var operation = resolveInfo.operation || {}; // check if the operation name is the name used for generated queries

  var isFederatedOperation =
    operation.name &&
    operation.name.value === _federation.NEO4j_GRAPHQL_SERVICE;
  var queryTypeCypherDirective = (0, _utils.getQueryCypherDirective)(
    resolveInfo,
    isFederatedOperation
  );
  var scalarKeys = {};
  var compoundKeys = {};
  var requiredData = {};

  if (isFederatedOperation) {
    var operationData = (0, _federation.getFederatedOperationData)({
      context: context
    });
    scalarKeys = operationData.scalarKeys;
    compoundKeys = operationData.compoundKeys;
    requiredData = operationData.requiredData;

    if (queryTypeCypherDirective) {
      // all nonnull keys become available as cypher variables
      nonNullParams = _objectSpread(
        {},
        scalarKeys,
        {},
        compoundKeys,
        {},
        requiredData
      );
    } else {
      // all scalar keys get used as field arguments, while relationship
      // field keys being translated as a filter argument
      nonNullParams = _objectSpread({}, scalarKeys);
    }
  }

  var filterParams = (0, _utils.getFilterParams)(nonNullParams);
  var queryArgs = (0, _utils.getQueryArguments)(
    resolveInfo,
    isFederatedOperation
  );
  var neo4jTypeArgs = (0, _utils.getNeo4jTypeArguments)(queryArgs);
  var cypherParams = getCypherParams(context);
  var queryParams = (0, _utils.paramsToString)(
    (0, _utils.innerFilterParams)(
      filterParams,
      neo4jTypeArgs,
      null,
      queryTypeCypherDirective ? true : false
    ),
    cypherParams
  );
  var safeVariableName = (0, _utils.safeVar)(variableName);
  var neo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
    filterParams,
    safeVariableName,
    neo4jTypeArgs
  );
  var outerSkipLimit = (0, _utils.getOuterSkipLimit)(first, offset);
  var orderByValue = (0, _utils.computeOrderBy)(resolveInfo, schemaType);
  var usesFragments = (0, _selections.isFragmentedSelection)({
    selections: selections
  });
  var isFragmentedInterfaceType = isInterfaceType && usesFragments;
  var isFragmentedObjectType = isObjectType && usesFragments;

  var _mergeSelectionFragme = (0, _selections.mergeSelectionFragments)({
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
    (0, _keys['default'])(derivedTypeMap).length === 0; // TODO refactor

  if (hasOnlySchemaTypeFragments) usesFragments = false;

  if (queryTypeCypherDirective) {
    return customQuery({
      resolveInfo: resolveInfo,
      cypherParams: cypherParams,
      schemaType: schemaType,
      argString: queryParams,
      selections: selections,
      variableName: variableName,
      safeVariableName: safeVariableName,
      isObjectType: isObjectType,
      isInterfaceType: isInterfaceType,
      isUnionType: isUnionType,
      isFragmentedInterfaceType: isFragmentedInterfaceType,
      usesFragments: usesFragments,
      schemaTypeFields: schemaTypeFields,
      derivedTypeMap: derivedTypeMap,
      orderByValue: orderByValue,
      outerSkipLimit: outerSkipLimit,
      queryTypeCypherDirective: queryTypeCypherDirective,
      nonNullParams: nonNullParams
    });
  } else {
    var additionalLabels = (0, _utils.getAdditionalLabels)(
      schemaType,
      cypherParams
    );

    if (isFederatedOperation) {
      nonNullParams = (0, _federation.setCompoundKeyFilter)({
        params: nonNullParams,
        compoundKeys: compoundKeys
      });
      nonNullParams = _objectSpread(
        {},
        nonNullParams,
        {},
        otherParams,
        {},
        requiredData
      );
    }

    return nodeQuery({
      resolveInfo: resolveInfo,
      isFederatedOperation: isFederatedOperation,
      context: context,
      cypherParams: cypherParams,
      schemaType: schemaType,
      argString: queryParams,
      selections: selections,
      variableName: variableName,
      typeName: typeName,
      isObjectType: isObjectType,
      isInterfaceType: isInterfaceType,
      isUnionType: isUnionType,
      isFragmentedInterfaceType: isFragmentedInterfaceType,
      isFragmentedObjectType: isFragmentedObjectType,
      usesFragments: usesFragments,
      schemaTypeFields: schemaTypeFields,
      derivedTypeMap: derivedTypeMap,
      additionalLabels: additionalLabels,
      neo4jTypeClauses: neo4jTypeClauses,
      orderByValue: orderByValue,
      outerSkipLimit: outerSkipLimit,
      nullParams: nullParams,
      nonNullParams: nonNullParams,
      filterParams: filterParams,
      neo4jTypeArgs: neo4jTypeArgs,
      _id: _id
    });
  }
};

exports.translateQuery = translateQuery;

var buildTypeCompositionPredicate = function buildTypeCompositionPredicate(
  _ref11
) {
  var schemaType = _ref11.schemaType,
    schemaTypeFields = _ref11.schemaTypeFields,
    _ref11$listVariable = _ref11.listVariable,
    listVariable = _ref11$listVariable === void 0 ? 'x' : _ref11$listVariable,
    derivedTypeMap = _ref11.derivedTypeMap,
    safeVariableName = _ref11.safeVariableName,
    isInterfaceType = _ref11.isInterfaceType,
    isUnionType = _ref11.isUnionType,
    isComputedQuery = _ref11.isComputedQuery,
    isComputedMutation = _ref11.isComputedMutation,
    isComputedField = _ref11.isComputedField,
    usesFragments = _ref11.usesFragments,
    resolveInfo = _ref11.resolveInfo;
  var schemaTypeName = schemaType.name;
  var isFragmentedInterfaceType = isInterfaceType && usesFragments;
  var labelPredicate = '';

  if (isFragmentedInterfaceType || isUnionType) {
    var derivedTypes = []; // If shared fields are selected then the translation builds
    // a type specific list comprehension for each interface implementing
    // type. Because of this, the type selecting predicate applied to
    // the interface type path pattern should allow for all possible
    // implementing types

    if (schemaTypeFields.length) {
      derivedTypes = (0, _selections.getDerivedTypes)({
        schemaTypeName: schemaTypeName,
        derivedTypeMap: derivedTypeMap,
        isUnionType: isUnionType,
        isFragmentedInterfaceType: isFragmentedInterfaceType,
        resolveInfo: resolveInfo
      });
    } else if (isUnionType) {
      derivedTypes = (0, _selections.getUnionDerivedTypes)({
        derivedTypeMap: derivedTypeMap,
        resolveInfo: resolveInfo
      });
    } else {
      // Otherwise, use only those types provided in fragments
      derivedTypes = (0, _keys['default'])(derivedTypeMap);
    } // TODO refactor above branch now that more specific branching was needed

    var typeSelectionPredicates = derivedTypes.map(function(selectedType) {
      return '"'
        .concat(selectedType, '" IN labels(')
        .concat(safeVariableName, ')');
    });

    if (typeSelectionPredicates.length) {
      labelPredicate = '('.concat(typeSelectionPredicates.join(' OR '), ')');
    }
  }

  if (labelPredicate) {
    if (isComputedQuery) {
      labelPredicate = 'WITH ['
        .concat(safeVariableName, ' IN ')
        .concat(listVariable, ' WHERE ')
        .concat(labelPredicate, ' | ')
        .concat(safeVariableName, '] AS ')
        .concat(listVariable, ' ');
    } else if (isComputedMutation) {
      labelPredicate = 'UNWIND ['
        .concat(safeVariableName, ' IN ')
        .concat(listVariable, ' WHERE ')
        .concat(labelPredicate, ' | ')
        .concat(safeVariableName, '] ');
    } else if (isComputedField) {
      labelPredicate = 'WHERE '.concat(labelPredicate, ' ');
    }
  }

  return labelPredicate;
};

var getCypherParams = function getCypherParams(context) {
  return context &&
    context.cypherParams &&
    context.cypherParams instanceof Object &&
    (0, _keys['default'])(context.cypherParams).length > 0
    ? context.cypherParams
    : undefined;
}; // Custom read operation

var customQuery = function customQuery(_ref12) {
  var resolveInfo = _ref12.resolveInfo,
    cypherParams = _ref12.cypherParams,
    schemaType = _ref12.schemaType,
    argString = _ref12.argString,
    selections = _ref12.selections,
    variableName = _ref12.variableName,
    isObjectType = _ref12.isObjectType,
    isInterfaceType = _ref12.isInterfaceType,
    isUnionType = _ref12.isUnionType,
    usesFragments = _ref12.usesFragments,
    schemaTypeFields = _ref12.schemaTypeFields,
    derivedTypeMap = _ref12.derivedTypeMap,
    orderByValue = _ref12.orderByValue,
    outerSkipLimit = _ref12.outerSkipLimit,
    queryTypeCypherDirective = _ref12.queryTypeCypherDirective,
    nonNullParams = _ref12.nonNullParams;
  var safeVariableName = (0, _utils.safeVar)(variableName);

  var _buildCypherSelection = (0, _selections.buildCypherSelection)({
      cypherParams: cypherParams,
      selections: selections,
      variableName: variableName,
      schemaType: schemaType,
      resolveInfo: resolveInfo
    }),
    _buildCypherSelection2 = (0, _slicedToArray2['default'])(
      _buildCypherSelection,
      2
    ),
    subQuery = _buildCypherSelection2[0],
    subParams = _buildCypherSelection2[1];

  var params = _objectSpread({}, nonNullParams, {}, subParams);

  if (cypherParams) {
    params['cypherParams'] = cypherParams;
  } // QueryType with a @cypher directive

  var cypherQueryArg = queryTypeCypherDirective.arguments.find(function(x) {
    return x.name.value === 'statement';
  });
  var isScalarType = (0, _utils.isGraphqlScalarType)(schemaType);
  var isNeo4jTypeOutput = (0, _utils.isNeo4jType)(schemaType.name);
  var orderByClause = orderByValue.cypherPart; // Don't add subQuery for scalar type payloads
  // FIXME: fix subselection translation for temporal type payload

  var isScalarPayload = isNeo4jTypeOutput || isScalarType;
  var fragmentTypeParams = derivedTypesParams({
    isInterfaceType: isInterfaceType,
    isUnionType: isUnionType,
    schema: resolveInfo.schema,
    schemaTypeName: schemaType.name,
    usesFragments: usesFragments
  });

  var _buildMapProjection7 = buildMapProjection({
      isComputedQuery: true,
      schemaType: schemaType,
      schemaTypeFields: schemaTypeFields,
      derivedTypeMap: derivedTypeMap,
      isObjectType: isObjectType,
      isInterfaceType: isInterfaceType,
      isUnionType: isUnionType,
      isScalarPayload: isScalarPayload,
      usesFragments: usesFragments,
      safeVariableName: safeVariableName,
      subQuery: subQuery,
      resolveInfo: resolveInfo
    }),
    _buildMapProjection8 = (0, _slicedToArray2['default'])(
      _buildMapProjection7,
      2
    ),
    mapProjection = _buildMapProjection8[0],
    labelPredicate = _buildMapProjection8[1];

  var query = 'WITH apoc.cypher.runFirstColumn("'
    .concat(cypherQueryArg.value.value, '", ')
    .concat(argString || 'null', ', True) AS x ')
    .concat(labelPredicate, 'UNWIND x AS ')
    .concat(safeVariableName, ' RETURN ')
    .concat(
      isScalarPayload
        ? ''.concat(mapProjection, ' ')
        : ''
            .concat(mapProjection, ' AS ')
            .concat(safeVariableName)
            .concat(orderByClause)
    )
    .concat(outerSkipLimit);
  return [query, _objectSpread({}, params, {}, fragmentTypeParams)];
}; // Generated API

var nodeQuery = function nodeQuery(_ref13) {
  var resolveInfo = _ref13.resolveInfo,
    isFederatedOperation = _ref13.isFederatedOperation,
    context = _ref13.context,
    cypherParams = _ref13.cypherParams,
    schemaType = _ref13.schemaType,
    selections = _ref13.selections,
    variableName = _ref13.variableName,
    typeName = _ref13.typeName,
    isObjectType = _ref13.isObjectType,
    isInterfaceType = _ref13.isInterfaceType,
    isUnionType = _ref13.isUnionType,
    usesFragments = _ref13.usesFragments,
    schemaTypeFields = _ref13.schemaTypeFields,
    derivedTypeMap = _ref13.derivedTypeMap,
    _ref13$additionalLabe = _ref13.additionalLabels,
    additionalLabels =
      _ref13$additionalLabe === void 0 ? [] : _ref13$additionalLabe,
    neo4jTypeClauses = _ref13.neo4jTypeClauses,
    orderByValue = _ref13.orderByValue,
    outerSkipLimit = _ref13.outerSkipLimit,
    nullParams = _ref13.nullParams,
    nonNullParams = _ref13.nonNullParams,
    filterParams = _ref13.filterParams,
    neo4jTypeArgs = _ref13.neo4jTypeArgs,
    _id = _ref13._id;
  var safeVariableName = (0, _utils.safeVar)(variableName);
  var safeLabelName = (0, _utils.safeLabel)(
    [typeName].concat((0, _toConsumableArray2['default'])(additionalLabels))
  );
  var rootParamIndex = 1;

  var _buildCypherSelection3 = (0, _selections.buildCypherSelection)({
      cypherParams: cypherParams,
      selections: selections,
      variableName: variableName,
      schemaType: schemaType,
      resolveInfo: resolveInfo,
      paramIndex: rootParamIndex,
      isFederatedOperation: isFederatedOperation,
      context: context
    }),
    _buildCypherSelection4 = (0, _slicedToArray2['default'])(
      _buildCypherSelection3,
      2
    ),
    subQuery = _buildCypherSelection4[0],
    subParams = _buildCypherSelection4[1];

  var fieldArgs = (0, _utils.getQueryArguments)(
    resolveInfo,
    isFederatedOperation
  );

  var _processFilterArgumen7 = processFilterArgument({
      fieldArgs: fieldArgs,
      isFederatedOperation: isFederatedOperation,
      schemaType: schemaType,
      variableName: variableName,
      resolveInfo: resolveInfo,
      params: nonNullParams,
      paramIndex: rootParamIndex
    }),
    _processFilterArgumen8 = (0, _slicedToArray2['default'])(
      _processFilterArgumen7,
      2
    ),
    filterPredicates = _processFilterArgumen8[0],
    serializedFilter = _processFilterArgumen8[1];

  var params = _objectSpread({}, serializedFilter, {}, subParams);

  if (cypherParams) {
    params['cypherParams'] = cypherParams;
  }

  var arrayParams = _lodash['default'].pickBy(
    filterParams,
    _isArray['default']
  );

  var args = (0, _utils.innerFilterParams)(filterParams, neo4jTypeArgs);
  var argString = (0, _utils.paramsToString)(
    _lodash['default'].filter(args, function(arg) {
      return !(0, _isArray['default'])(arg.value);
    })
  );
  var idWherePredicate =
    typeof _id !== 'undefined'
      ? 'ID('.concat(safeVariableName, ')=').concat(_id)
      : '';
  var nullFieldPredicates = (0, _keys['default'])(nullParams).map(function(
    key
  ) {
    return ''.concat(variableName, '.').concat(key, ' IS NULL');
  });

  var arrayPredicates = _lodash['default'].map(arrayParams, function(
    value,
    key
  ) {
    return ''
      .concat(safeVariableName, '.')
      .concat((0, _utils.safeVar)(key), ' IN $')
      .concat(key);
  });

  var fragmentTypeParams = derivedTypesParams({
    isInterfaceType: isInterfaceType,
    isUnionType: isUnionType,
    schema: resolveInfo.schema,
    schemaTypeName: schemaType.name,
    usesFragments: usesFragments
  });

  var _buildMapProjection9 = buildMapProjection({
      schemaType: schemaType,
      schemaTypeFields: schemaTypeFields,
      derivedTypeMap: derivedTypeMap,
      isObjectType: isObjectType,
      isInterfaceType: isInterfaceType,
      isUnionType: isUnionType,
      usesFragments: usesFragments,
      safeVariableName: safeVariableName,
      subQuery: subQuery,
      resolveInfo: resolveInfo
    }),
    _buildMapProjection10 = (0, _slicedToArray2['default'])(
      _buildMapProjection9,
      2
    ),
    mapProjection = _buildMapProjection10[0],
    labelPredicate = _buildMapProjection10[1];

  var predicateClauses = [idWherePredicate, labelPredicate]
    .concat(
      (0, _toConsumableArray2['default'])(filterPredicates),
      (0, _toConsumableArray2['default'])(nullFieldPredicates),
      (0, _toConsumableArray2['default'])(neo4jTypeClauses),
      (0, _toConsumableArray2['default'])(arrayPredicates)
    )
    .filter(function(predicate) {
      return !!predicate;
    })
    .join(' AND ');
  var predicate = predicateClauses
    ? 'WHERE '.concat(predicateClauses, ' ')
    : '';
  var optimization = orderByValue.optimization,
    orderByClause = orderByValue.cypherPart;
  var query = 'MATCH ('
    .concat(safeVariableName, ':')
    .concat(safeLabelName)
    .concat(argString ? ' '.concat(argString) : '', ') ')
    .concat(predicate)
    .concat(
      optimization.earlyOrderBy
        ? 'WITH '.concat(safeVariableName).concat(orderByClause)
        : '',
      'RETURN '
    )
    .concat(mapProjection, ' AS ')
    .concat(safeVariableName)
    .concat(optimization.earlyOrderBy ? '' : orderByClause)
    .concat(outerSkipLimit);
  return [query, _objectSpread({}, params, {}, fragmentTypeParams)];
};

var buildMapProjection = function buildMapProjection(_ref14) {
  var schemaType = _ref14.schemaType,
    schemaTypeFields = _ref14.schemaTypeFields,
    listVariable = _ref14.listVariable,
    derivedTypeMap = _ref14.derivedTypeMap,
    isObjectType = _ref14.isObjectType,
    isInterfaceType = _ref14.isInterfaceType,
    isUnionType = _ref14.isUnionType,
    isScalarPayload = _ref14.isScalarPayload,
    isComputedQuery = _ref14.isComputedQuery,
    isComputedMutation = _ref14.isComputedMutation,
    isComputedField = _ref14.isComputedField,
    usesFragments = _ref14.usesFragments,
    safeVariableName = _ref14.safeVariableName,
    subQuery = _ref14.subQuery,
    resolveInfo = _ref14.resolveInfo;
  var labelPredicate = buildTypeCompositionPredicate({
    schemaType: schemaType,
    schemaTypeFields: schemaTypeFields,
    listVariable: listVariable,
    derivedTypeMap: derivedTypeMap,
    safeVariableName: safeVariableName,
    isInterfaceType: isInterfaceType,
    isUnionType: isUnionType,
    isComputedQuery: isComputedQuery,
    isComputedMutation: isComputedMutation,
    isComputedField: isComputedField,
    usesFragments: usesFragments,
    resolveInfo: resolveInfo
  });
  var isFragmentedInterfaceType = usesFragments && isInterfaceType;
  var isFragmentedUnionType = usesFragments && isUnionType;
  var mapProjection = '';

  if (isScalarPayload) {
    // A scalar type payload has no map projection
    mapProjection = safeVariableName;
  } else if (isObjectType) {
    mapProjection = ''.concat(safeVariableName, ' {').concat(subQuery, '}');
  } else if (isFragmentedInterfaceType || isFragmentedUnionType) {
    // An interface type possibly uses fragments and a
    // union type necessarily uses fragments
    mapProjection = subQuery;
  } else if (isInterfaceType || isUnionType) {
    // If no fragments are used, then this is an interface type
    // with only interface fields selected
    mapProjection = ''
      .concat(safeVariableName, ' {')
      .concat(fragmentType(safeVariableName, schemaType.name))
      .concat(subQuery ? ','.concat(subQuery) : '', '}');
  }

  return [mapProjection, labelPredicate];
};

var getUnionLabels = function getUnionLabels(_ref15) {
  var _ref15$typeName = _ref15.typeName,
    typeName = _ref15$typeName === void 0 ? '' : _ref15$typeName,
    _ref15$typeMap = _ref15.typeMap,
    typeMap = _ref15$typeMap === void 0 ? {} : _ref15$typeMap;
  var unionLabels = [];
  (0, _keys['default'])(typeMap).map(function(key) {
    var definition = typeMap[key];
    var astNode = definition.astNode;

    if (
      (0, _types.isUnionTypeDefinition)({
        definition: astNode
      })
    ) {
      var types = definition.getTypes();
      var unionTypeName = definition.name;

      if (
        types.find(function(type) {
          return type.name === typeName;
        })
      ) {
        unionLabels.push(unionTypeName);
      }
    }
  });
  return unionLabels;
}; // Mutation API root operation branch

var translateMutation = function translateMutation(_ref16) {
  var resolveInfo = _ref16.resolveInfo,
    context = _ref16.context,
    first = _ref16.first,
    offset = _ref16.offset,
    otherParams = _ref16.otherParams;
  var typeMap = resolveInfo.schema.getTypeMap();

  var _typeIdentifiers2 = (0, _utils.typeIdentifiers)(resolveInfo.returnType),
    typeName = _typeIdentifiers2.typeName,
    variableName = _typeIdentifiers2.variableName;

  var schemaType = resolveInfo.schema.getType(typeName);
  var selections = (0, _utils.getPayloadSelections)(resolveInfo);
  var outerSkipLimit = (0, _utils.getOuterSkipLimit)(first, offset);
  var orderByValue = (0, _utils.computeOrderBy)(resolveInfo, schemaType);
  var additionalNodeLabels = (0, _utils.getAdditionalLabels)(
    schemaType,
    getCypherParams(context)
  );
  var mutationTypeCypherDirective = (0, _utils.getMutationCypherDirective)(
    resolveInfo
  );
  var mutationMeta = resolveInfo.schema
    .getMutationType()
    .getFields()
    [resolveInfo.fieldName].astNode.directives.find(function(x) {
      return x.name.value === 'MutationMeta';
    });
  var params = (0, _utils.initializeMutationParams)({
    mutationMeta: mutationMeta,
    resolveInfo: resolveInfo,
    mutationTypeCypherDirective: mutationTypeCypherDirective,
    first: first,
    otherParams: otherParams,
    offset: offset
  });
  var isInterfaceType = (0, _utils.isGraphqlInterfaceType)(schemaType);
  var isObjectType = (0, _utils.isGraphqlObjectType)(schemaType);
  var isUnionType = (0, _utils.isGraphqlUnionType)(schemaType);
  var usesFragments = (0, _selections.isFragmentedSelection)({
    selections: selections
  });
  var isFragmentedObjectType = isObjectType && usesFragments;
  var interfaceLabels =
    typeof schemaType.getInterfaces === 'function'
      ? schemaType.getInterfaces().map(function(i) {
          return i.name;
        })
      : [];
  var unionLabels = getUnionLabels({
    typeName: typeName,
    typeMap: typeMap
  });
  var additionalLabels = [].concat(
    (0, _toConsumableArray2['default'])(additionalNodeLabels),
    (0, _toConsumableArray2['default'])(interfaceLabels),
    (0, _toConsumableArray2['default'])(unionLabels)
  );

  var _mergeSelectionFragme3 = (0, _selections.mergeSelectionFragments)({
      schemaType: schemaType,
      selections: selections,
      isFragmentedObjectType: isFragmentedObjectType,
      isUnionType: isUnionType,
      typeMap: typeMap,
      resolveInfo: resolveInfo
    }),
    _mergeSelectionFragme4 = (0, _slicedToArray2['default'])(
      _mergeSelectionFragme3,
      2
    ),
    schemaTypeFields = _mergeSelectionFragme4[0],
    derivedTypeMap = _mergeSelectionFragme4[1];

  if (mutationTypeCypherDirective) {
    return customMutation({
      resolveInfo: resolveInfo,
      schemaType: schemaType,
      schemaTypeFields: schemaTypeFields,
      derivedTypeMap: derivedTypeMap,
      isObjectType: isObjectType,
      isInterfaceType: isInterfaceType,
      isUnionType: isUnionType,
      usesFragments: usesFragments,
      selections: selections,
      params: params,
      context: context,
      mutationTypeCypherDirective: mutationTypeCypherDirective,
      variableName: variableName,
      orderByValue: orderByValue,
      outerSkipLimit: outerSkipLimit
    });
  } else if ((0, _utils.isCreateMutation)(resolveInfo)) {
    return nodeCreate({
      resolveInfo: resolveInfo,
      schemaType: schemaType,
      selections: selections,
      params: params,
      variableName: variableName,
      typeName: typeName,
      additionalLabels: additionalLabels
    });
  } else if ((0, _utils.isDeleteMutation)(resolveInfo)) {
    return nodeDelete({
      resolveInfo: resolveInfo,
      schemaType: schemaType,
      selections: selections,
      params: params,
      variableName: variableName,
      typeName: typeName
    });
  } else if ((0, _utils.isAddMutation)(resolveInfo)) {
    return relationshipCreate({
      resolveInfo: resolveInfo,
      schemaType: schemaType,
      selections: selections,
      params: params,
      context: context
    });
  } else if (
    (0, _utils.isUpdateMutation)(resolveInfo) ||
    (0, _utils.isMergeMutation)(resolveInfo)
  ) {
    /**
     * TODO: Once we are no longer using the @MutationMeta directive
     * on relationship mutations, we will need to more directly identify
     * whether this Merge mutation if for a node or relationship
     */
    if (mutationMeta) {
      return relationshipMergeOrUpdate({
        mutationMeta: mutationMeta,
        resolveInfo: resolveInfo,
        selections: selections,
        schemaType: schemaType,
        params: params,
        context: context
      });
    } else {
      return nodeMergeOrUpdate({
        resolveInfo: resolveInfo,
        variableName: variableName,
        typeName: typeName,
        selections: selections,
        schemaType: schemaType,
        additionalLabels: additionalLabels,
        params: params
      });
    }
  } else if ((0, _utils.isRemoveMutation)(resolveInfo)) {
    return relationshipDelete({
      resolveInfo: resolveInfo,
      schemaType: schemaType,
      selections: selections,
      params: params,
      context: context
    });
  } else {
    // throw error - don't know how to handle this type of mutation
    throw new Error(
      'Do not know how to handle this type of mutation. Mutation does not follow naming convention.'
    );
  }
}; // Custom write operation

exports.translateMutation = translateMutation;

var customMutation = function customMutation(_ref17) {
  var params = _ref17.params,
    context = _ref17.context,
    mutationTypeCypherDirective = _ref17.mutationTypeCypherDirective,
    selections = _ref17.selections,
    variableName = _ref17.variableName,
    schemaType = _ref17.schemaType,
    schemaTypeFields = _ref17.schemaTypeFields,
    derivedTypeMap = _ref17.derivedTypeMap,
    isObjectType = _ref17.isObjectType,
    isInterfaceType = _ref17.isInterfaceType,
    isUnionType = _ref17.isUnionType,
    usesFragments = _ref17.usesFragments,
    resolveInfo = _ref17.resolveInfo,
    orderByValue = _ref17.orderByValue,
    outerSkipLimit = _ref17.outerSkipLimit;
  var cypherParams = getCypherParams(context);
  var safeVariableName = (0, _utils.safeVar)(variableName); // FIXME: support IN for multiple values -> WHERE

  var argString = (0, _utils.paramsToString)(
    (0, _utils.innerFilterParams)(
      (0, _utils.getFilterParams)(params.params || params),
      null,
      null,
      true
    ),
    cypherParams
  );
  var cypherQueryArg = mutationTypeCypherDirective.arguments.find(function(x) {
    return x.name.value === 'statement';
  });

  var _buildCypherSelection5 = (0, _selections.buildCypherSelection)({
      selections: selections,
      variableName: variableName,
      schemaType: schemaType,
      resolveInfo: resolveInfo,
      cypherParams: cypherParams
    }),
    _buildCypherSelection6 = (0, _slicedToArray2['default'])(
      _buildCypherSelection5,
      2
    ),
    subQuery = _buildCypherSelection6[0],
    subParams = _buildCypherSelection6[1];

  var isScalarType = (0, _utils.isGraphqlScalarType)(schemaType);
  var isNeo4jTypeOutput = (0, _utils.isNeo4jType)(schemaType.name);
  var isScalarField = isNeo4jTypeOutput || isScalarType;
  var orderByClause = orderByValue.cypherPart;
  var listVariable = 'apoc.map.values(value, [keys(value)[0]])[0] ';

  var _buildMapProjection11 = buildMapProjection({
      isComputedMutation: true,
      listVariable: listVariable,
      schemaType: schemaType,
      schemaTypeFields: schemaTypeFields,
      derivedTypeMap: derivedTypeMap,
      isObjectType: isObjectType,
      isInterfaceType: isInterfaceType,
      isUnionType: isUnionType,
      usesFragments: usesFragments,
      safeVariableName: safeVariableName,
      subQuery: subQuery,
      resolveInfo: resolveInfo
    }),
    _buildMapProjection12 = (0, _slicedToArray2['default'])(
      _buildMapProjection11,
      2
    ),
    mapProjection = _buildMapProjection12[0],
    labelPredicate = _buildMapProjection12[1];

  var query = ''; // TODO refactor

  if (labelPredicate) {
    query = 'CALL apoc.cypher.doIt("'
      .concat(cypherQueryArg.value.value, '", ')
      .concat(argString, ') YIELD value\n    ')
      .concat(!isScalarField ? labelPredicate : '', 'AS ')
      .concat(safeVariableName, '\n    RETURN ')
      .concat(
        !isScalarField
          ? ''
              .concat(mapProjection, ' AS ')
              .concat(safeVariableName)
              .concat(orderByClause)
              .concat(outerSkipLimit)
          : ''
      );
  } else {
    query = 'CALL apoc.cypher.doIt("'
      .concat(cypherQueryArg.value.value, '", ')
      .concat(argString, ') YIELD value\n    WITH ')
      .concat(listVariable, 'AS ')
      .concat(safeVariableName, '\n    RETURN ')
      .concat(safeVariableName, ' ')
      .concat(
        !isScalarField
          ? '{'
              .concat(
                isInterfaceType
                  ? ''.concat(
                      fragmentType(safeVariableName, schemaType.name),
                      ','
                    )
                  : ''
              )
              .concat(subQuery, '} AS ')
              .concat(safeVariableName)
              .concat(orderByClause)
              .concat(outerSkipLimit)
          : ''
      );
  }

  var fragmentTypeParams = derivedTypesParams({
    isInterfaceType: isInterfaceType,
    isUnionType: isUnionType,
    schema: resolveInfo.schema,
    schemaTypeName: schemaType.name,
    usesFragments: usesFragments
  });
  params = _objectSpread({}, params, {}, subParams, {}, fragmentTypeParams);

  if (cypherParams) {
    params['cypherParams'] = cypherParams;
  }

  return [query, _objectSpread({}, params)];
}; // Generated API
// Node Create - Update - Delete

var nodeCreate = function nodeCreate(_ref18) {
  var variableName = _ref18.variableName,
    typeName = _ref18.typeName,
    selections = _ref18.selections,
    schemaType = _ref18.schemaType,
    resolveInfo = _ref18.resolveInfo,
    additionalLabels = _ref18.additionalLabels,
    params = _ref18.params;
  var safeVariableName = (0, _utils.safeVar)(variableName);
  var safeLabelName = (0, _utils.safeLabel)(
    [typeName].concat((0, _toConsumableArray2['default'])(additionalLabels))
  );
  var statements = [];
  var args = (0, _utils.getMutationArguments)(resolveInfo);
  statements = (0, _utils.possiblySetFirstId)({
    args: args,
    statements: statements,
    params: params.params
  });

  var _buildCypherParameter = (0, _utils.buildCypherParameters)({
      args: args,
      statements: statements,
      params: params,
      paramKey: 'params',
      resolveInfo: resolveInfo
    }),
    _buildCypherParameter2 = (0, _slicedToArray2['default'])(
      _buildCypherParameter,
      2
    ),
    preparedParams = _buildCypherParameter2[0],
    paramStatements = _buildCypherParameter2[1];

  var _buildCypherSelection7 = (0, _selections.buildCypherSelection)({
      selections: selections,
      variableName: variableName,
      schemaType: schemaType,
      resolveInfo: resolveInfo
    }),
    _buildCypherSelection8 = (0, _slicedToArray2['default'])(
      _buildCypherSelection7,
      2
    ),
    subQuery = _buildCypherSelection8[0],
    subParams = _buildCypherSelection8[1];

  params = _objectSpread({}, preparedParams, {}, subParams);
  var query = '\n    CREATE ('
    .concat(safeVariableName, ':')
    .concat(safeLabelName, ' {')
    .concat(paramStatements.join(','), '})\n    RETURN ')
    .concat(safeVariableName, ' {')
    .concat(subQuery, '} AS ')
    .concat(safeVariableName, '\n  ');
  return [query, params];
};

var nodeDelete = function nodeDelete(_ref19) {
  var resolveInfo = _ref19.resolveInfo,
    selections = _ref19.selections,
    variableName = _ref19.variableName,
    typeName = _ref19.typeName,
    schemaType = _ref19.schemaType,
    params = _ref19.params;
  var safeVariableName = (0, _utils.safeVar)(variableName);
  var safeLabelName = (0, _utils.safeLabel)(typeName);
  var args = (0, _utils.getMutationArguments)(resolveInfo);
  var primaryKeyArg = args[0];
  var primaryKeyArgName = primaryKeyArg.name.value;
  var neo4jTypeArgs = (0, _utils.getNeo4jTypeArguments)(args);

  var _splitSelectionParame = (0, _utils.splitSelectionParameters)(
      params,
      primaryKeyArgName
    ),
    _splitSelectionParame2 = (0, _slicedToArray2['default'])(
      _splitSelectionParame,
      1
    ),
    primaryKeyParam = _splitSelectionParame2[0];

  var neo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
    primaryKeyParam,
    safeVariableName,
    neo4jTypeArgs
  );

  var _buildCypherParameter3 = (0, _utils.buildCypherParameters)({
      args: args,
      params: params,
      resolveInfo: resolveInfo
    }),
    _buildCypherParameter4 = (0, _slicedToArray2['default'])(
      _buildCypherParameter3,
      1
    ),
    preparedParams = _buildCypherParameter4[0];

  var query = 'MATCH ('
    .concat(safeVariableName, ':')
    .concat(safeLabelName)
    .concat(
      neo4jTypeClauses.length > 0
        ? ') WHERE '.concat(neo4jTypeClauses.join(' AND '))
        : ' {'.concat(primaryKeyArgName, ': $').concat(primaryKeyArgName, '})')
    );

  var _buildCypherSelection9 = (0, _selections.buildCypherSelection)({
      selections: selections,
      variableName: variableName,
      schemaType: schemaType,
      resolveInfo: resolveInfo
    }),
    _buildCypherSelection10 = (0, _slicedToArray2['default'])(
      _buildCypherSelection9,
      2
    ),
    subQuery = _buildCypherSelection10[0],
    subParams = _buildCypherSelection10[1];

  params = _objectSpread({}, preparedParams, {}, subParams);
  var deletionVariableName = (0, _utils.safeVar)(
    ''.concat(variableName, '_toDelete')
  ); // Cannot execute a map projection on a deleted node in Neo4j
  // so the projection is executed and aliased before the delete

  query += '\nWITH '
    .concat(safeVariableName, ' AS ')
    .concat(deletionVariableName, ', ')
    .concat(safeVariableName, ' {')
    .concat(subQuery, '} AS ')
    .concat(safeVariableName, '\nDETACH DELETE ')
    .concat(deletionVariableName, '\nRETURN ')
    .concat(safeVariableName);
  return [query, params];
}; // Relation Add / Remove

var relationshipCreate = function relationshipCreate(_ref20) {
  var resolveInfo = _ref20.resolveInfo,
    selections = _ref20.selections,
    schemaType = _ref20.schemaType,
    params = _ref20.params,
    context = _ref20.context;
  var mutationMeta, relationshipNameArg, fromTypeArg, toTypeArg;

  try {
    mutationMeta = resolveInfo.schema
      .getMutationType()
      .getFields()
      [resolveInfo.fieldName].astNode.directives.find(function(x) {
        return x.name.value === 'MutationMeta';
      });
  } catch (e) {
    throw new Error(
      'Missing required MutationMeta directive on add relationship directive'
    );
  }

  try {
    relationshipNameArg = mutationMeta.arguments.find(function(x) {
      return x.name.value === 'relationship';
    });
    fromTypeArg = mutationMeta.arguments.find(function(x) {
      return x.name.value === 'from';
    });
    toTypeArg = mutationMeta.arguments.find(function(x) {
      return x.name.value === 'to';
    });
  } catch (e) {
    throw new Error(
      'Missing required argument in MutationMeta directive (relationship, from, or to)'
    );
  } //TODO: need to handle one-to-one and one-to-many

  var args = (0, _utils.getMutationArguments)(resolveInfo);
  var typeMap = resolveInfo.schema.getTypeMap();
  var cypherParams = getCypherParams(context);
  var fromType = fromTypeArg.value.value;
  var fromVar = ''.concat((0, _utils.lowFirstLetter)(fromType), '_from');
  var fromInputArg = args.find(function(e) {
    return e.name.value === 'from';
  }).type;
  var fromInputAst =
    typeMap[(0, _graphql.getNamedType)(fromInputArg).type.name.value].astNode;
  var fromFields = fromInputAst.fields;
  var fromParam = fromFields[0].name.value;
  var fromNodeNeo4jTypeArgs = (0, _utils.getNeo4jTypeArguments)(fromFields);
  var toType = toTypeArg.value.value;
  var toVar = ''.concat((0, _utils.lowFirstLetter)(toType), '_to');
  var toInputArg = args.find(function(e) {
    return e.name.value === 'to';
  }).type;
  var toInputAst =
    typeMap[(0, _graphql.getNamedType)(toInputArg).type.name.value].astNode;
  var toFields = toInputAst.fields;
  var toParam = toFields[0].name.value;
  var toNodeNeo4jTypeArgs = (0, _utils.getNeo4jTypeArguments)(toFields);
  var relationshipName = relationshipNameArg.value.value;
  var lowercased = relationshipName.toLowerCase();
  var dataInputArg = args.find(function(e) {
    return e.name.value === 'data';
  });
  var dataInputAst = dataInputArg
    ? typeMap[(0, _graphql.getNamedType)(dataInputArg.type).type.name.value]
        .astNode
    : undefined;
  var dataFields = dataInputAst ? dataInputAst.fields : [];

  var _buildCypherParameter5 = (0, _utils.buildCypherParameters)({
      args: dataFields,
      params: params,
      paramKey: 'data',
      resolveInfo: resolveInfo
    }),
    _buildCypherParameter6 = (0, _slicedToArray2['default'])(
      _buildCypherParameter5,
      2
    ),
    preparedParams = _buildCypherParameter6[0],
    paramStatements = _buildCypherParameter6[1];

  var schemaTypeName = (0, _utils.safeVar)(schemaType);
  var fromVariable = (0, _utils.safeVar)(fromVar);
  var fromAdditionalLabels = (0, _utils.getAdditionalLabels)(
    resolveInfo.schema.getType(fromType),
    cypherParams
  );
  var fromLabel = (0, _utils.safeLabel)(
    [fromType].concat((0, _toConsumableArray2['default'])(fromAdditionalLabels))
  );
  var toVariable = (0, _utils.safeVar)(toVar);
  var toAdditionalLabels = (0, _utils.getAdditionalLabels)(
    resolveInfo.schema.getType(toType),
    cypherParams
  );
  var toLabel = (0, _utils.safeLabel)(
    [toType].concat((0, _toConsumableArray2['default'])(toAdditionalLabels))
  );
  var relationshipVariable = (0, _utils.safeVar)(lowercased + '_relation');
  var relationshipLabel = (0, _utils.safeLabel)(relationshipName);
  var fromNodeNeo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
    preparedParams.from,
    fromVariable,
    fromNodeNeo4jTypeArgs,
    'from'
  );
  var toNodeNeo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
    preparedParams.to,
    toVariable,
    toNodeNeo4jTypeArgs,
    'to'
  );

  var _buildCypherSelection11 = (0, _selections.buildCypherSelection)({
      selections: selections,
      schemaType: schemaType,
      resolveInfo: resolveInfo,
      parentSelectionInfo: {
        rootType: 'relationship',
        from: fromVar,
        to: toVar,
        variableName: lowercased
      },
      variableName:
        schemaType.name === fromType ? ''.concat(toVar) : ''.concat(fromVar),
      cypherParams: getCypherParams(context)
    }),
    _buildCypherSelection12 = (0, _slicedToArray2['default'])(
      _buildCypherSelection11,
      2
    ),
    subQuery = _buildCypherSelection12[0],
    subParams = _buildCypherSelection12[1];

  params = _objectSpread({}, preparedParams, {}, subParams);
  var query = '\n      MATCH ('
    .concat(fromVariable, ':')
    .concat(fromLabel)
    .concat(
      fromNodeNeo4jTypeClauses && fromNodeNeo4jTypeClauses.length > 0 // uses either a WHERE clause for managed type primary keys (temporal, etc.)
        ? ') WHERE '.concat(fromNodeNeo4jTypeClauses.join(' AND '), ' ') // or a an internal matching clause for normal, scalar property primary keys
        : // NOTE this will need to change if we at some point allow for multi field node selection
          ' {'.concat(fromParam, ': $from.').concat(fromParam, '})'),
      '\n      MATCH ('
    )
    .concat(toVariable, ':')
    .concat(toLabel)
    .concat(
      toNodeNeo4jTypeClauses && toNodeNeo4jTypeClauses.length > 0
        ? ') WHERE '.concat(toNodeNeo4jTypeClauses.join(' AND '), ' ')
        : ' {'.concat(toParam, ': $to.').concat(toParam, '})'),
      '\n      CREATE ('
    )
    .concat(fromVariable, ')-[')
    .concat(relationshipVariable, ':')
    .concat(relationshipLabel)
    .concat(
      paramStatements.length > 0
        ? ' {'.concat(paramStatements.join(','), '}')
        : '',
      ']->('
    )
    .concat(toVariable, ')\n      RETURN ')
    .concat(relationshipVariable, ' { ')
    .concat(subQuery, ' } AS ')
    .concat(schemaTypeName, ';\n    ');
  return [query, params];
};

var relationshipDelete = function relationshipDelete(_ref21) {
  var resolveInfo = _ref21.resolveInfo,
    selections = _ref21.selections,
    schemaType = _ref21.schemaType,
    params = _ref21.params,
    context = _ref21.context;
  var mutationMeta, relationshipNameArg, fromTypeArg, toTypeArg;

  try {
    mutationMeta = resolveInfo.schema
      .getMutationType()
      .getFields()
      [resolveInfo.fieldName].astNode.directives.find(function(x) {
        return x.name.value === 'MutationMeta';
      });
  } catch (e) {
    throw new Error(
      'Missing required MutationMeta directive on add relationship directive'
    );
  }

  try {
    relationshipNameArg = mutationMeta.arguments.find(function(x) {
      return x.name.value === 'relationship';
    });
    fromTypeArg = mutationMeta.arguments.find(function(x) {
      return x.name.value === 'from';
    });
    toTypeArg = mutationMeta.arguments.find(function(x) {
      return x.name.value === 'to';
    });
  } catch (e) {
    throw new Error(
      'Missing required argument in MutationMeta directive (relationship, from, or to)'
    );
  } //TODO: need to handle one-to-one and one-to-many

  var args = (0, _utils.getMutationArguments)(resolveInfo);
  var typeMap = resolveInfo.schema.getTypeMap();
  var cypherParams = getCypherParams(context);
  var fromType = fromTypeArg.value.value;
  var fromVar = ''.concat((0, _utils.lowFirstLetter)(fromType), '_from');
  var fromInputArg = args.find(function(e) {
    return e.name.value === 'from';
  }).type;
  var fromInputAst =
    typeMap[(0, _graphql.getNamedType)(fromInputArg).type.name.value].astNode;
  var fromFields = fromInputAst.fields;
  var fromParam = fromFields[0].name.value;
  var fromNodeNeo4jTypeArgs = (0, _utils.getNeo4jTypeArguments)(fromFields);
  var toType = toTypeArg.value.value;
  var toVar = ''.concat((0, _utils.lowFirstLetter)(toType), '_to');
  var toInputArg = args.find(function(e) {
    return e.name.value === 'to';
  }).type;
  var toInputAst =
    typeMap[(0, _graphql.getNamedType)(toInputArg).type.name.value].astNode;
  var toFields = toInputAst.fields;
  var toParam = toFields[0].name.value;
  var toNodeNeo4jTypeArgs = (0, _utils.getNeo4jTypeArguments)(toFields);
  var relationshipName = relationshipNameArg.value.value;
  var schemaTypeName = (0, _utils.safeVar)(schemaType);
  var fromVariable = (0, _utils.safeVar)(fromVar);
  var fromAdditionalLabels = (0, _utils.getAdditionalLabels)(
    resolveInfo.schema.getType(fromType),
    cypherParams
  );
  var fromLabel = (0, _utils.safeLabel)(
    [fromType].concat((0, _toConsumableArray2['default'])(fromAdditionalLabels))
  );
  var toVariable = (0, _utils.safeVar)(toVar);
  var toAdditionalLabels = (0, _utils.getAdditionalLabels)(
    resolveInfo.schema.getType(toType),
    cypherParams
  );
  var toLabel = (0, _utils.safeLabel)(
    [toType].concat((0, _toConsumableArray2['default'])(toAdditionalLabels))
  );
  var relationshipVariable = (0, _utils.safeVar)(fromVar + toVar);
  var relationshipLabel = (0, _utils.safeLabel)(relationshipName);
  var fromRootVariable = (0, _utils.safeVar)('_' + fromVar);
  var toRootVariable = (0, _utils.safeVar)('_' + toVar);
  var fromNodeNeo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
    params.from,
    fromVariable,
    fromNodeNeo4jTypeArgs,
    'from'
  );
  var toNodeNeo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
    params.to,
    toVariable,
    toNodeNeo4jTypeArgs,
    'to'
  ); // TODO cleaner semantics: remove use of _ prefixes in root variableNames and variableName

  var _buildCypherSelection13 = (0, _selections.buildCypherSelection)({
      selections: selections,
      schemaType: schemaType,
      resolveInfo: resolveInfo,
      parentSelectionInfo: {
        rootType: 'relationship',
        from: '_'.concat(fromVar),
        to: '_'.concat(toVar)
      },
      variableName:
        schemaType.name === fromType ? '_'.concat(toVar) : '_'.concat(fromVar),
      cypherParams: getCypherParams(context)
    }),
    _buildCypherSelection14 = (0, _slicedToArray2['default'])(
      _buildCypherSelection13,
      2
    ),
    subQuery = _buildCypherSelection14[0],
    subParams = _buildCypherSelection14[1];

  params = _objectSpread({}, params, {}, subParams);
  var query = '\n      MATCH ('
    .concat(fromVariable, ':')
    .concat(fromLabel)
    .concat(
      fromNodeNeo4jTypeClauses && fromNodeNeo4jTypeClauses.length > 0 // uses either a WHERE clause for managed type primary keys (temporal, etc.)
        ? ') WHERE '.concat(fromNodeNeo4jTypeClauses.join(' AND '), ' ') // or a an internal matching clause for normal, scalar property primary keys
        : ' {'.concat(fromParam, ': $from.').concat(fromParam, '})'),
      '\n      MATCH ('
    )
    .concat(toVariable, ':')
    .concat(toLabel)
    .concat(
      toNodeNeo4jTypeClauses && toNodeNeo4jTypeClauses.length > 0
        ? ') WHERE '.concat(toNodeNeo4jTypeClauses.join(' AND '), ' ')
        : ' {'.concat(toParam, ': $to.').concat(toParam, '})'),
      '\n      OPTIONAL MATCH ('
    )
    .concat(fromVariable, ')-[')
    .concat(relationshipVariable, ':')
    .concat(relationshipLabel, ']->(')
    .concat(toVariable, ')\n      DELETE ')
    .concat(relationshipVariable, '\n      WITH COUNT(*) AS scope, ')
    .concat(fromVariable, ' AS ')
    .concat(fromRootVariable, ', ')
    .concat(toVariable, ' AS ')
    .concat(toRootVariable, '\n      RETURN {')
    .concat(subQuery, '} AS ')
    .concat(schemaTypeName, ';\n    ');
  return [query, params];
};

var relationshipMergeOrUpdate = function relationshipMergeOrUpdate(_ref22) {
  var mutationMeta = _ref22.mutationMeta,
    resolveInfo = _ref22.resolveInfo,
    selections = _ref22.selections,
    schemaType = _ref22.schemaType,
    params = _ref22.params,
    context = _ref22.context;
  var query = '';
  var relationshipNameArg = undefined;
  var fromTypeArg = undefined;
  var toTypeArg = undefined;

  try {
    relationshipNameArg = mutationMeta.arguments.find(function(x) {
      return x.name.value === 'relationship';
    });
    fromTypeArg = mutationMeta.arguments.find(function(x) {
      return x.name.value === 'from';
    });
    toTypeArg = mutationMeta.arguments.find(function(x) {
      return x.name.value === 'to';
    });
  } catch (e) {
    throw new Error(
      'Missing required argument in MutationMeta directive (relationship, from, or to)'
    );
  }

  if (relationshipNameArg && fromTypeArg && toTypeArg) {
    //TODO: need to handle one-to-one and one-to-many
    var args = (0, _utils.getMutationArguments)(resolveInfo);
    var typeMap = resolveInfo.schema.getTypeMap();
    var cypherParams = getCypherParams(context);
    var fromType = fromTypeArg.value.value;
    var fromVar = ''.concat((0, _utils.lowFirstLetter)(fromType), '_from');
    var fromInputArg = args.find(function(e) {
      return e.name.value === 'from';
    }).type;
    var fromInputAst =
      typeMap[(0, _graphql.getNamedType)(fromInputArg).type.name.value].astNode;
    var fromFields = fromInputAst.fields;
    var fromParam = fromFields[0].name.value;
    var fromNodeNeo4jTypeArgs = (0, _utils.getNeo4jTypeArguments)(fromFields);
    var toType = toTypeArg.value.value;
    var toVar = ''.concat((0, _utils.lowFirstLetter)(toType), '_to');
    var toInputArg = args.find(function(e) {
      return e.name.value === 'to';
    }).type;
    var toInputAst =
      typeMap[(0, _graphql.getNamedType)(toInputArg).type.name.value].astNode;
    var toFields = toInputAst.fields;
    var toParam = toFields[0].name.value;
    var toNodeNeo4jTypeArgs = (0, _utils.getNeo4jTypeArguments)(toFields);
    var relationshipName = relationshipNameArg.value.value;
    var lowercased = relationshipName.toLowerCase();
    var dataInputArg = args.find(function(e) {
      return e.name.value === 'data';
    });
    var dataInputAst = dataInputArg
      ? typeMap[(0, _graphql.getNamedType)(dataInputArg.type).type.name.value]
          .astNode
      : undefined;
    var dataFields = dataInputAst ? dataInputAst.fields : [];

    var _buildCypherParameter7 = (0, _utils.buildCypherParameters)({
        args: dataFields,
        params: params,
        paramKey: 'data',
        resolveInfo: resolveInfo
      }),
      _buildCypherParameter8 = (0, _slicedToArray2['default'])(
        _buildCypherParameter7,
        2
      ),
      preparedParams = _buildCypherParameter8[0],
      paramStatements = _buildCypherParameter8[1];

    var schemaTypeName = (0, _utils.safeVar)(schemaType);
    var fromVariable = (0, _utils.safeVar)(fromVar);
    var fromAdditionalLabels = (0, _utils.getAdditionalLabels)(
      resolveInfo.schema.getType(fromType),
      cypherParams
    );
    var fromLabel = (0, _utils.safeLabel)(
      [fromType].concat(
        (0, _toConsumableArray2['default'])(fromAdditionalLabels)
      )
    );
    var toVariable = (0, _utils.safeVar)(toVar);
    var toAdditionalLabels = (0, _utils.getAdditionalLabels)(
      resolveInfo.schema.getType(toType),
      cypherParams
    );
    var toLabel = (0, _utils.safeLabel)(
      [toType].concat((0, _toConsumableArray2['default'])(toAdditionalLabels))
    );
    var relationshipVariable = (0, _utils.safeVar)(lowercased + '_relation');
    var relationshipLabel = (0, _utils.safeLabel)(relationshipName);
    var fromNodeNeo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
      preparedParams.from,
      fromVariable,
      fromNodeNeo4jTypeArgs,
      'from'
    );
    var toNodeNeo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
      preparedParams.to,
      toVariable,
      toNodeNeo4jTypeArgs,
      'to'
    );

    var _buildCypherSelection15 = (0, _selections.buildCypherSelection)({
        selections: selections,
        schemaType: schemaType,
        resolveInfo: resolveInfo,
        parentSelectionInfo: {
          rootType: 'relationship',
          from: fromVar,
          to: toVar,
          variableName: lowercased
        },
        variableName:
          schemaType.name === fromType ? ''.concat(toVar) : ''.concat(fromVar),
        cypherParams: getCypherParams(context)
      }),
      _buildCypherSelection16 = (0, _slicedToArray2['default'])(
        _buildCypherSelection15,
        2
      ),
      subQuery = _buildCypherSelection16[0],
      subParams = _buildCypherSelection16[1];

    var cypherOperation = '';

    if ((0, _utils.isMergeMutation)(resolveInfo)) {
      cypherOperation = 'MERGE';
    } else if ((0, _utils.isUpdateMutation)(resolveInfo)) {
      cypherOperation = 'MATCH';
    }

    params = _objectSpread({}, preparedParams, {}, subParams);
    query = '\n      MATCH ('
      .concat(fromVariable, ':')
      .concat(fromLabel)
      .concat(
        fromNodeNeo4jTypeClauses && fromNodeNeo4jTypeClauses.length > 0 // uses either a WHERE clause for managed type primary keys (temporal, etc.)
          ? ') WHERE '.concat(fromNodeNeo4jTypeClauses.join(' AND '), ' ') // or a an internal matching clause for normal, scalar property primary keys
          : // NOTE this will need to change if we at some point allow for multi field node selection
            ' {'.concat(fromParam, ': $from.').concat(fromParam, '})'),
        '\n      MATCH ('
      )
      .concat(toVariable, ':')
      .concat(toLabel)
      .concat(
        toNodeNeo4jTypeClauses && toNodeNeo4jTypeClauses.length > 0
          ? ') WHERE '.concat(toNodeNeo4jTypeClauses.join(' AND '), ' ')
          : ' {'.concat(toParam, ': $to.').concat(toParam, '})'),
        '\n      '
      )
      .concat(cypherOperation, ' (')
      .concat(fromVariable, ')-[')
      .concat(relationshipVariable, ':')
      .concat(relationshipLabel, ']->(')
      .concat(toVariable, ')')
      .concat(
        paramStatements.length > 0
          ? '\n      SET '
              .concat(relationshipVariable, ' += {')
              .concat(paramStatements.join(','), '} ')
          : '',
        '\n      RETURN '
      )
      .concat(relationshipVariable, ' { ')
      .concat(subQuery, ' } AS ')
      .concat(schemaTypeName, ';\n    ');
  }

  return [query, params];
};

var nodeMergeOrUpdate = function nodeMergeOrUpdate(_ref23) {
  var resolveInfo = _ref23.resolveInfo,
    variableName = _ref23.variableName,
    typeName = _ref23.typeName,
    selections = _ref23.selections,
    schemaType = _ref23.schemaType,
    additionalLabels = _ref23.additionalLabels,
    params = _ref23.params;
  var safeVariableName = (0, _utils.safeVar)(variableName);
  var args = (0, _utils.getMutationArguments)(resolveInfo);
  var primaryKeyArg = args[0];
  var primaryKeyArgName = primaryKeyArg.name.value;
  var neo4jTypeArgs = (0, _utils.getNeo4jTypeArguments)(args);

  var _splitSelectionParame3 = (0, _utils.splitSelectionParameters)(
      params,
      primaryKeyArgName,
      'params'
    ),
    _splitSelectionParame4 = (0, _slicedToArray2['default'])(
      _splitSelectionParame3,
      2
    ),
    primaryKeyParam = _splitSelectionParame4[0],
    updateParams = _splitSelectionParame4[1];

  var neo4jTypeClauses = (0, _utils.neo4jTypePredicateClauses)(
    primaryKeyParam,
    safeVariableName,
    neo4jTypeArgs,
    'params'
  );
  var predicateClauses = (0, _toConsumableArray2['default'])(neo4jTypeClauses)
    .filter(function(predicate) {
      return !!predicate;
    })
    .join(' AND ');
  var predicate = predicateClauses
    ? 'WHERE '.concat(predicateClauses, ' ')
    : '';

  var _buildCypherParameter9 = (0, _utils.buildCypherParameters)({
      args: args,
      params: updateParams,
      paramKey: 'params',
      resolveInfo: resolveInfo
    }),
    _buildCypherParameter10 = (0, _slicedToArray2['default'])(
      _buildCypherParameter9,
      2
    ),
    preparedParams = _buildCypherParameter10[0],
    paramUpdateStatements = _buildCypherParameter10[1];

  var cypherOperation = '';
  var safeLabelName = (0, _utils.safeLabel)(typeName);

  if ((0, _utils.isMergeMutation)(resolveInfo)) {
    safeLabelName = (0, _utils.safeLabel)(
      [typeName].concat((0, _toConsumableArray2['default'])(additionalLabels))
    );
    cypherOperation = 'MERGE';
  } else if ((0, _utils.isUpdateMutation)(resolveInfo)) {
    cypherOperation = 'MATCH';
  }

  var query = ''
    .concat(cypherOperation, ' (')
    .concat(safeVariableName, ':')
    .concat(safeLabelName)
    .concat(
      predicate !== ''
        ? ') '.concat(predicate, ' ')
        : '{'
            .concat(primaryKeyArgName, ': $params.')
            .concat(primaryKeyArgName, '})'),
      '\n  '
    );

  if (paramUpdateStatements.length > 0) {
    query += 'SET '
      .concat(safeVariableName, ' += {')
      .concat(paramUpdateStatements.join(','), '} ');
  }

  var _buildCypherSelection17 = (0, _selections.buildCypherSelection)({
      selections: selections,
      variableName: variableName,
      schemaType: schemaType,
      resolveInfo: resolveInfo
    }),
    _buildCypherSelection18 = (0, _slicedToArray2['default'])(
      _buildCypherSelection17,
      2
    ),
    subQuery = _buildCypherSelection18[0],
    subParams = _buildCypherSelection18[1];

  preparedParams.params[primaryKeyArgName] = primaryKeyParam[primaryKeyArgName];
  params = _objectSpread({}, preparedParams, {}, subParams);
  query += 'RETURN '
    .concat(safeVariableName, ' {')
    .concat(subQuery, '} AS ')
    .concat(safeVariableName);
  return [query, params];
};

var neo4jTypeOrderingClauses = function neo4jTypeOrderingClauses(
  selections,
  innerSchemaType
) {
  var selectedTypes =
    selections && selections[0] && selections[0].selectionSet
      ? selections[0].selectionSet.selections
      : [];
  return selectedTypes
    .reduce(function(temporalTypeFields, innerSelection) {
      // name of temporal type field
      var fieldName = innerSelection.name.value;
      var fieldTypeName = getFieldTypeName(innerSchemaType, fieldName);

      if ((0, _utils.isTemporalType)(fieldTypeName)) {
        var innerSelectedTypes = innerSelection.selectionSet
          ? innerSelection.selectionSet.selections
          : [];
        temporalTypeFields.push(
          ''.concat(fieldName, ': {').concat(
            innerSelectedTypes
              .reduce(function(temporalSubFields, t) {
                // temporal type subfields, year, minute, etc.
                var subFieldName = t.name.value;

                if (subFieldName === 'formatted') {
                  temporalSubFields.push(
                    ''
                      .concat(subFieldName, ': toString(sortedElement.')
                      .concat(fieldName, ')')
                  );
                } else {
                  temporalSubFields.push(
                    ''
                      .concat(subFieldName, ': sortedElement.')
                      .concat(fieldName, '.')
                      .concat(subFieldName)
                  );
                }

                return temporalSubFields;
              }, [])
              .join(','),
            '}'
          )
        );
      }

      return temporalTypeFields;
    }, [])
    .join(',');
};

var getFieldTypeName = function getFieldTypeName(schemaType, fieldName) {
  // TODO handle for fragments?
  var field =
    schemaType && fieldName ? schemaType.getFields()[fieldName] : undefined;
  return field ? field.type.name : '';
};

var temporalOrderingFieldExists = function temporalOrderingFieldExists(
  schemaType,
  filterParams
) {
  var orderByParam = filterParams ? filterParams['orderBy'] : undefined;

  if (orderByParam) {
    orderByParam = orderByParam.value;
    if (!(0, _isArray['default'])(orderByParam)) orderByParam = [orderByParam];
    return orderByParam.find(function(e) {
      var fieldName = e.substring(0, e.lastIndexOf('_'));
      var fieldTypeName = getFieldTypeName(schemaType, fieldName);
      return (0, _utils.isTemporalType)(fieldTypeName);
    });
  }

  return undefined;
};

var buildSortMultiArgs = function buildSortMultiArgs(param) {
  var values = param ? param.value : [];
  var fieldName = '';
  if (!(0, _isArray['default'])(values)) values = [values];
  return values
    .map(function(e) {
      fieldName = e.substring(0, e.lastIndexOf('_'));
      return e.includes('_asc')
        ? "'^".concat(fieldName, "'")
        : "'".concat(fieldName, "'");
    })
    .join(',');
};

var processFilterArgument = function processFilterArgument(_ref24) {
  var fieldArgs = _ref24.fieldArgs,
    isFederatedOperation = _ref24.isFederatedOperation,
    schemaType = _ref24.schemaType,
    variableName = _ref24.variableName,
    resolveInfo = _ref24.resolveInfo,
    params = _ref24.params,
    paramIndex = _ref24.paramIndex,
    _ref24$rootIsRelation = _ref24.rootIsRelationType,
    rootIsRelationType =
      _ref24$rootIsRelation === void 0 ? false : _ref24$rootIsRelation;
  var filterArg = fieldArgs.find(function(e) {
    return e.name.value === 'filter';
  });
  var filterValue = (0, _keys['default'])(params).length
    ? params['filter']
    : undefined;
  var filterParamKey =
    paramIndex > 1 ? ''.concat(paramIndex - 1, '_filter') : 'filter';
  var filterCypherParam = '$'.concat(filterParamKey);
  var translations = []; // allows an exception for the existence of the filter argument AST
  // if isFederatedOperation

  if ((filterArg || isFederatedOperation) && filterValue) {
    // if field has both a filter argument and argument data is provided
    var schema = resolveInfo.schema;
    var serializedFilterParam = filterValue;
    var filterFieldMap = {};

    var _analyzeFilterArgumen = analyzeFilterArguments({
      filterValue: filterValue,
      variableName: variableName,
      filterCypherParam: filterCypherParam,
      schemaType: schemaType,
      schema: schema
    });

    var _analyzeFilterArgumen2 = (0, _slicedToArray2['default'])(
      _analyzeFilterArgumen,
      2
    );

    filterFieldMap = _analyzeFilterArgumen2[0];
    serializedFilterParam = _analyzeFilterArgumen2[1];
    translations = translateFilterArguments({
      filterFieldMap: filterFieldMap,
      filterCypherParam: filterCypherParam,
      rootIsRelationType: rootIsRelationType,
      variableName: variableName,
      schemaType: schemaType,
      schema: schema
    });
    params = _objectSpread(
      {},
      params,
      (0, _defineProperty3['default'])(
        {},
        filterParamKey,
        serializedFilterParam
      )
    );
  }

  return [translations, params];
};

var analyzeFilterArguments = function analyzeFilterArguments(_ref25) {
  var filterValue = _ref25.filterValue,
    variableName = _ref25.variableName,
    filterCypherParam = _ref25.filterCypherParam,
    schemaType = _ref25.schemaType,
    schema = _ref25.schema;
  return (0, _entries['default'])(filterValue).reduce(
    function(_ref26, _ref27) {
      var _ref28 = (0, _slicedToArray2['default'])(_ref26, 2),
        filterFieldMap = _ref28[0],
        serializedParams = _ref28[1];

      var _ref29 = (0, _slicedToArray2['default'])(_ref27, 2),
        name = _ref29[0],
        value = _ref29[1];

      var _analyzeFilterArgumen3 = analyzeFilterArgument({
          filterValue: value,
          filterValues: filterValue,
          fieldName: name,
          filterParam: filterCypherParam,
          variableName: variableName,
          schemaType: schemaType,
          schema: schema
        }),
        _analyzeFilterArgumen4 = (0, _slicedToArray2['default'])(
          _analyzeFilterArgumen3,
          2
        ),
        serializedValue = _analyzeFilterArgumen4[0],
        fieldMap = _analyzeFilterArgumen4[1];

      var filterParamName = serializeFilterFieldName(name, value);
      filterFieldMap[filterParamName] = fieldMap;
      serializedParams[filterParamName] = serializedValue;
      return [filterFieldMap, serializedParams];
    },
    [{}, {}]
  );
};

var analyzeFilterArgument = function analyzeFilterArgument(_ref30) {
  var parentFieldName = _ref30.parentFieldName,
    filterValue = _ref30.filterValue,
    fieldName = _ref30.fieldName,
    variableName = _ref30.variableName,
    filterParam = _ref30.filterParam,
    parentSchemaType = _ref30.parentSchemaType,
    schemaType = _ref30.schemaType,
    schema = _ref30.schema;
  var parsedFilterName = parseFilterArgumentName(fieldName);
  var filterOperationField = parsedFilterName.name;
  var filterOperationType = parsedFilterName.type; // defaults

  var filterMapValue = true;
  var serializedFilterParam = filterValue;
  var innerSchemaType = schemaType;
  var typeName = schemaType.name;

  if (filterOperationField !== 'OR' && filterOperationField !== 'AND') {
    var schemaTypeFields = schemaType.getFields();
    var filterField = schemaTypeFields[filterOperationField];
    var filterFieldAst = filterField.astNode;
    var filterType = filterFieldAst.type;
    var innerFieldType = (0, _fields.unwrapNamedType)({
      type: filterType
    });
    typeName = innerFieldType.name;
    innerSchemaType = schema.getType(typeName);
  }

  if (
    (0, _graphql.isScalarType)(innerSchemaType) ||
    (0, _graphql.isEnumType)(innerSchemaType)
  ) {
    if (isExistentialFilter(filterOperationType, filterValue)) {
      serializedFilterParam = true;
      filterMapValue = null;
    }
  } else if (
    (0, _graphql.isObjectType)(innerSchemaType) ||
    (0, _graphql.isInterfaceType)(innerSchemaType)
  ) {
    if (fieldName === 'AND' || fieldName === 'OR') {
      // recursion
      var _analyzeNestedFilterA = analyzeNestedFilterArgument({
        filterValue: filterValue,
        filterOperationType: filterOperationType,
        parentFieldName: fieldName,
        parentSchemaType: schemaType,
        schemaType: schemaType,
        variableName: variableName,
        filterParam: filterParam,
        schema: schema
      });

      var _analyzeNestedFilterA2 = (0, _slicedToArray2['default'])(
        _analyzeNestedFilterA,
        2
      );

      serializedFilterParam = _analyzeNestedFilterA2[0];
      filterMapValue = _analyzeNestedFilterA2[1];
    } else {
      var schemaTypeField = schemaType.getFields()[filterOperationField];

      var _innerSchemaType = (0, _utils.innerType)(schemaTypeField.type);

      var isObjectTypeFilter = (0, _graphql.isObjectType)(_innerSchemaType);
      var isInterfaceTypeFilter = (0, _graphql.isInterfaceType)(
        _innerSchemaType
      );

      if (isObjectTypeFilter || isInterfaceTypeFilter) {
        var _decideRelationFilter = decideRelationFilterMetadata({
            fieldName: fieldName,
            parentSchemaType: parentSchemaType,
            schemaType: schemaType,
            variableName: variableName,
            innerSchemaType: _innerSchemaType,
            filterOperationField: filterOperationField
          }),
          _decideRelationFilter2 = (0, _slicedToArray2['default'])(
            _decideRelationFilter,
            9
          ),
          thisType = _decideRelationFilter2[0],
          relatedType = _decideRelationFilter2[1],
          relationLabel = _decideRelationFilter2[2],
          relationDirection = _decideRelationFilter2[3],
          isRelation = _decideRelationFilter2[4],
          isRelationType = _decideRelationFilter2[5],
          isRelationTypeNode = _decideRelationFilter2[6],
          isReflexiveRelationType = _decideRelationFilter2[7],
          isReflexiveTypeDirectedField = _decideRelationFilter2[8];

        if (isReflexiveTypeDirectedField) {
          // for the 'from' and 'to' fields on the payload of a reflexive
          // relation type to use the parent field name, ex: 'knows_some'
          // is used for 'from' and 'to' in 'knows_some: { from: {}, to: {} }'
          var _parsedFilterName = parseFilterArgumentName(parentFieldName);

          filterOperationField = _parsedFilterName.name;
          filterOperationType = _parsedFilterName.type;
        }

        if (isExistentialFilter(filterOperationType, filterValue)) {
          serializedFilterParam = true;
          filterMapValue = null;
        } else if (
          (0, _utils.isTemporalType)(typeName) ||
          (0, _utils.isSpatialType)(typeName) ||
          (0, _utils.isSpatialDistanceInputType)({
            filterOperationType: filterOperationType
          })
        ) {
          serializedFilterParam = serializeNeo4jTypeParam(filterValue);
        } else if (isRelation || isRelationType || isRelationTypeNode) {
          // recursion
          var _analyzeNestedFilterA3 = analyzeNestedFilterArgument({
            filterValue: filterValue,
            filterOperationType: filterOperationType,
            isRelationType: isRelationType,
            parentFieldName: fieldName,
            parentSchemaType: schemaType,
            schemaType: _innerSchemaType,
            variableName: variableName,
            filterParam: filterParam,
            schema: schema
          });

          var _analyzeNestedFilterA4 = (0, _slicedToArray2['default'])(
            _analyzeNestedFilterA3,
            2
          );

          serializedFilterParam = _analyzeNestedFilterA4[0];
          filterMapValue = _analyzeNestedFilterA4[1];
        }
      }
    }
  }

  return [serializedFilterParam, filterMapValue];
};

var analyzeNestedFilterArgument = function analyzeNestedFilterArgument(_ref31) {
  var parentSchemaType = _ref31.parentSchemaType,
    parentFieldName = _ref31.parentFieldName,
    schemaType = _ref31.schemaType,
    variableName = _ref31.variableName,
    filterValue = _ref31.filterValue,
    filterParam = _ref31.filterParam,
    schema = _ref31.schema;
  var isList = (0, _isArray['default'])(filterValue); // coersion to array for dynamic iteration of objects and arrays

  if (!isList) filterValue = [filterValue];
  var serializedFilterValue = [];
  var filterValueFieldMap = {};
  filterValue.forEach(function(filter) {
    var serializedValues = {};
    var serializedValue = {};
    var valueFieldMap = {};
    (0, _entries['default'])(filter).forEach(function(_ref32) {
      var _ref33 = (0, _slicedToArray2['default'])(_ref32, 2),
        fieldName = _ref33[0],
        value = _ref33[1];

      fieldName = deserializeFilterFieldName(fieldName);

      var _analyzeFilterArgumen5 = analyzeFilterArgument({
        parentFieldName: parentFieldName,
        filterValue: value,
        filterValues: filter,
        fieldName: fieldName,
        variableName: variableName,
        filterParam: filterParam,
        parentSchemaType: parentSchemaType,
        schemaType: schemaType,
        schema: schema
      });

      var _analyzeFilterArgumen6 = (0, _slicedToArray2['default'])(
        _analyzeFilterArgumen5,
        2
      );

      serializedValue = _analyzeFilterArgumen6[0];
      valueFieldMap = _analyzeFilterArgumen6[1];
      var filterParamName = serializeFilterFieldName(fieldName, value);
      var filterMapEntry = filterValueFieldMap[filterParamName];
      if (!filterMapEntry) filterValueFieldMap[filterParamName] = valueFieldMap;
      // deep merges in order to capture differences in objects within nested array filters
      else
        filterValueFieldMap[filterParamName] = _lodash['default'].merge(
          filterMapEntry,
          valueFieldMap
        );
      serializedValues[filterParamName] = serializedValue;
    });
    serializedFilterValue.push(serializedValues);
  }); // undo array coersion

  if (!isList) serializedFilterValue = serializedFilterValue[0];
  return [serializedFilterValue, filterValueFieldMap];
};

var serializeFilterFieldName = function serializeFilterFieldName(name, value) {
  if (value === null) {
    var parsedFilterName = parseFilterArgumentName(name);
    var filterOperationType = parsedFilterName.type;

    if (!filterOperationType || filterOperationType === 'not') {
      return '_'.concat(name, '_null');
    }
  }

  return name;
};

var serializeNeo4jTypeParam = function serializeNeo4jTypeParam(filterValue) {
  var isList = (0, _isArray['default'])(filterValue);
  if (!isList) filterValue = [filterValue];
  var serializedValues = filterValue.reduce(function(serializedValues, filter) {
    var serializedValue = {};
    if (filter['formatted']) serializedValue = filter['formatted'];
    else {
      serializedValue = (0, _entries['default'])(filter).reduce(function(
        serialized,
        _ref34
      ) {
        var _ref35 = (0, _slicedToArray2['default'])(_ref34, 2),
          key = _ref35[0],
          value = _ref35[1];

        if ((0, _isInteger['default'])(value))
          value = _neo4jDriver['default']['int'](value);
        serialized[key] = value;
        return serialized;
      },
      {});
    }
    serializedValues.push(serializedValue);
    return serializedValues;
  }, []);
  if (!isList) serializedValues = serializedValues[0];
  return serializedValues;
};

var deserializeFilterFieldName = function deserializeFilterFieldName(name) {
  if (name.startsWith('_') && name.endsWith('_null')) {
    name = name.substring(1, name.length - 5);
  }

  return name;
};

var translateFilterArguments = function translateFilterArguments(_ref36) {
  var filterFieldMap = _ref36.filterFieldMap,
    filterCypherParam = _ref36.filterCypherParam,
    variableName = _ref36.variableName,
    rootIsRelationType = _ref36.rootIsRelationType,
    schemaType = _ref36.schemaType,
    schema = _ref36.schema;
  return (0, _entries['default'])(filterFieldMap).reduce(function(
    translations,
    _ref37
  ) {
    var _ref38 = (0, _slicedToArray2['default'])(_ref37, 2),
      name = _ref38[0],
      value = _ref38[1];

    // the filter field map uses serialized field names to allow for both field: {} and field: null
    name = deserializeFilterFieldName(name);
    var translation = translateFilterArgument({
      filterParam: filterCypherParam,
      fieldName: name,
      filterValue: value,
      rootIsRelationType: rootIsRelationType,
      variableName: variableName,
      schemaType: schemaType,
      schema: schema
    });

    if (translation) {
      translations.push('('.concat(translation, ')'));
    }

    return translations;
  },
  []);
};

var translateFilterArgument = function translateFilterArgument(_ref39) {
  var parentParamPath = _ref39.parentParamPath,
    parentFieldName = _ref39.parentFieldName,
    isListFilterArgument = _ref39.isListFilterArgument,
    filterValue = _ref39.filterValue,
    fieldName = _ref39.fieldName,
    rootIsRelationType = _ref39.rootIsRelationType,
    variableName = _ref39.variableName,
    filterParam = _ref39.filterParam,
    parentSchemaType = _ref39.parentSchemaType,
    schemaType = _ref39.schemaType,
    schema = _ref39.schema;
  // parse field name into prefix (ex: name, company) and
  // possible suffix identifying operation type (ex: _gt, _in)
  var parsedFilterName = parseFilterArgumentName(fieldName);
  var filterOperationField = parsedFilterName.name;
  var filterOperationType = parsedFilterName.type;
  var innerSchemaType = schemaType;
  var typeName = schemaType.name;

  if (filterOperationField !== 'OR' && filterOperationField !== 'AND') {
    var schemaTypeFields = schemaType.getFields();
    var filterField = schemaTypeFields[filterOperationField];
    var filterFieldAst = filterField.astNode;
    var filterType = filterFieldAst.type;
    var innerFieldType = (0, _fields.unwrapNamedType)({
      type: filterType
    });
    typeName = innerFieldType.name;
    innerSchemaType = schema.getType(typeName);
  } // build path for parameter data for current filter field

  var parameterPath = buildParamaterPathExpression({
    parentParamPath: parentParamPath,
    filterParam: filterParam,
    fieldName: fieldName,
    filterOperationType: filterOperationType
  }); // short-circuit evaluation: predicate used to skip a field
  // if processing a list of objects that possibly contain different arguments

  var nullFieldPredicate = decideNullSkippingPredicate({
    parameterPath: parameterPath,
    isListFilterArgument: isListFilterArgument,
    parentParamPath: parentParamPath
  });
  var translation = '';

  if (
    (0, _graphql.isScalarType)(innerSchemaType) ||
    (0, _graphql.isEnumType)(innerSchemaType)
  ) {
    translation = translateScalarFilter({
      isListFilterArgument: isListFilterArgument,
      filterOperationField: filterOperationField,
      filterOperationType: filterOperationType,
      filterValue: filterValue,
      fieldName: fieldName,
      variableName: variableName,
      parameterPath: parameterPath,
      parentParamPath: parentParamPath,
      filterParam: filterParam,
      nullFieldPredicate: nullFieldPredicate
    });
  } else if (
    (0, _graphql.isObjectType)(innerSchemaType) ||
    (0, _graphql.isInterfaceType)(innerSchemaType)
  ) {
    translation = translateInputFilter({
      rootIsRelationType: rootIsRelationType,
      isListFilterArgument: isListFilterArgument,
      filterOperationField: filterOperationField,
      filterOperationType: filterOperationType,
      filterValue: filterValue,
      variableName: variableName,
      fieldName: fieldName,
      filterParam: filterParam,
      schema: schema,
      parentSchemaType: parentSchemaType,
      schemaType: schemaType,
      parameterPath: parameterPath,
      parentParamPath: parentParamPath,
      parentFieldName: parentFieldName,
      nullFieldPredicate: nullFieldPredicate
    });
  }

  return translation;
};

var parseFilterArgumentName = function parseFilterArgumentName(fieldName) {
  var fieldNameParts = fieldName.split('_');
  var filterTypes = [
    '_not',
    '_in',
    '_not_in',
    '_contains',
    '_contains_i',
    '_not_contains',
    '_starts_with',
    '_not_starts_with',
    '_ends_with',
    '_not_ends_with',
    '_lt',
    '_lte',
    '_gt',
    '_gte',
    '_some',
    '_none',
    '_single',
    '_every',
    '_distance',
    '_distance_lt',
    '_distance_lte',
    '_distance_gt',
    '_distance_gte'
  ];
  var filterType = '';

  if (fieldNameParts.length > 1) {
    var regExp = [];

    _lodash['default'].each(filterTypes, function(f) {
      regExp.push(f + '$');
    });

    var regExpJoin = '(' + regExp.join('|') + ')';

    var preparedFieldAndFilterField = _lodash['default'].replace(
      fieldName,
      new RegExp(regExpJoin),
      '[::filterFieldSeperator::]$1'
    );

    var _preparedFieldAndFilt = preparedFieldAndFilterField.split(
        '[::filterFieldSeperator::]'
      ),
      _preparedFieldAndFilt2 = (0, _slicedToArray2['default'])(
        _preparedFieldAndFilt,
        2
      ),
      parsedField = _preparedFieldAndFilt2[0],
      parsedFilterField = _preparedFieldAndFilt2[1];

    fieldName = !_lodash['default'].isUndefined(parsedField)
      ? parsedField
      : fieldName;
    filterType = !_lodash['default'].isUndefined(parsedFilterField)
      ? parsedFilterField.substr(1)
      : ''; // Strip off first underscore
  }

  return {
    name: fieldName,
    type: filterType
  };
};

var buildParamaterPathExpression = function buildParamaterPathExpression(
  _ref40
) {
  var parentParamPath = _ref40.parentParamPath,
    filterParam = _ref40.filterParam,
    fieldName = _ref40.fieldName,
    filterOperationType = _ref40.filterOperationType;
  // build path for parameter data for current filter field
  var parameterPath = ''
    .concat(parentParamPath ? parentParamPath : filterParam, '.')
    .concat(fieldName); // may need to call expression on path value depending on filter type

  if (filterOperationType.slice(-2) === '_i') {
    // case insensitive
    return 'toLower('.concat(parameterPath, ')');
  }

  return parameterPath;
};

var translateScalarFilter = function translateScalarFilter(_ref41) {
  var isListFilterArgument = _ref41.isListFilterArgument,
    filterOperationField = _ref41.filterOperationField,
    filterOperationType = _ref41.filterOperationType,
    filterValue = _ref41.filterValue,
    variableName = _ref41.variableName,
    parameterPath = _ref41.parameterPath,
    parentParamPath = _ref41.parentParamPath,
    filterParam = _ref41.filterParam,
    nullFieldPredicate = _ref41.nullFieldPredicate;
  // build path to node/relationship property
  var propertyPath = ''
    .concat((0, _utils.safeVar)(variableName), '.')
    .concat(filterOperationField);

  if (isExistentialFilter(filterOperationType, filterValue)) {
    return translateNullFilter({
      filterOperationField: filterOperationField,
      filterOperationType: filterOperationType,
      propertyPath: propertyPath,
      filterParam: filterParam,
      parentParamPath: parentParamPath,
      isListFilterArgument: isListFilterArgument
    });
  }

  return ''
    .concat(nullFieldPredicate)
    .concat(
      buildOperatorExpression({
        filterOperationType: filterOperationType,
        propertyPath: propertyPath
      }),
      ' '
    )
    .concat(parameterPath);
};

var isExistentialFilter = function isExistentialFilter(type, value) {
  return (!type || type === 'not') && value === null;
};

var decideNullSkippingPredicate = function decideNullSkippingPredicate(_ref42) {
  var parameterPath = _ref42.parameterPath,
    isListFilterArgument = _ref42.isListFilterArgument,
    parentParamPath = _ref42.parentParamPath;
  return isListFilterArgument && parentParamPath
    ? ''.concat(parameterPath, ' IS NULL OR ')
    : '';
};

var translateNullFilter = function translateNullFilter(_ref43) {
  var filterOperationField = _ref43.filterOperationField,
    filterOperationType = _ref43.filterOperationType,
    filterParam = _ref43.filterParam,
    propertyPath = _ref43.propertyPath,
    parentParamPath = _ref43.parentParamPath,
    isListFilterArgument = _ref43.isListFilterArgument;
  var isNegationFilter = filterOperationType === 'not'; // allign with modified parameter names for null filters

  var paramPath = ''
    .concat(parentParamPath ? parentParamPath : filterParam, '._')
    .concat(filterOperationField, '_')
    .concat(isNegationFilter ? 'not_' : '', 'null'); // build a predicate for checking the existence of a
  // property or relationship

  var predicate = ''
    .concat(paramPath, ' = TRUE AND')
    .concat(isNegationFilter ? '' : ' NOT', ' EXISTS(')
    .concat(propertyPath, ')'); // skip the field if it is null in the case of it
  // existing within one of many objects in a list filter

  var nullFieldPredicate = decideNullSkippingPredicate({
    parameterPath: paramPath,
    isListFilterArgument: isListFilterArgument,
    parentParamPath: parentParamPath
  });
  return ''.concat(nullFieldPredicate).concat(predicate);
};

var buildOperatorExpression = function buildOperatorExpression(_ref44) {
  var filterOperationType = _ref44.filterOperationType,
    propertyPath = _ref44.propertyPath,
    isListFilterArgument = _ref44.isListFilterArgument,
    parameterPath = _ref44.parameterPath;
  if (isListFilterArgument) return ''.concat(propertyPath, ' =');

  switch (filterOperationType) {
    case 'not':
      return 'NOT '.concat(propertyPath, ' = ');

    case 'in':
      return ''.concat(propertyPath, ' IN');

    case 'not_in':
      return 'NOT '.concat(propertyPath, ' IN');

    case 'contains':
      return ''.concat(propertyPath, ' CONTAINS');

    case 'contains_i':
      return 'toLower('.concat(propertyPath, ') CONTAINS');

    case 'not_contains':
      return 'NOT '.concat(propertyPath, ' CONTAINS');

    case 'starts_with':
      return ''.concat(propertyPath, ' STARTS WITH');

    case 'not_starts_with':
      return 'NOT '.concat(propertyPath, ' STARTS WITH');

    case 'ends_with':
      return ''.concat(propertyPath, ' ENDS WITH');

    case 'not_ends_with':
      return 'NOT '.concat(propertyPath, ' ENDS WITH');

    case 'distance':
      return 'distance('
        .concat(propertyPath, ', point(')
        .concat(parameterPath, '.point)) =');

    case 'lt':
      return ''.concat(propertyPath, ' <');

    case 'distance_lt':
      return 'distance('
        .concat(propertyPath, ', point(')
        .concat(parameterPath, '.point)) <');

    case 'lte':
      return ''.concat(propertyPath, ' <=');

    case 'distance_lte':
      return 'distance('
        .concat(propertyPath, ', point(')
        .concat(parameterPath, '.point)) <=');

    case 'gt':
      return ''.concat(propertyPath, ' >');

    case 'distance_gt':
      return 'distance('
        .concat(propertyPath, ', point(')
        .concat(parameterPath, '.point)) >');

    case 'gte':
      return ''.concat(propertyPath, ' >=');

    case 'distance_gte':
      return 'distance('
        .concat(propertyPath, ', point(')
        .concat(parameterPath, '.point)) >=');

    default: {
      return ''.concat(propertyPath, ' =');
    }
  }
};

var translateInputFilter = function translateInputFilter(_ref45) {
  var rootIsRelationType = _ref45.rootIsRelationType,
    isListFilterArgument = _ref45.isListFilterArgument,
    filterOperationField = _ref45.filterOperationField,
    filterOperationType = _ref45.filterOperationType,
    filterValue = _ref45.filterValue,
    variableName = _ref45.variableName,
    fieldName = _ref45.fieldName,
    filterParam = _ref45.filterParam,
    schema = _ref45.schema,
    parentSchemaType = _ref45.parentSchemaType,
    schemaType = _ref45.schemaType,
    parameterPath = _ref45.parameterPath,
    parentParamPath = _ref45.parentParamPath,
    parentFieldName = _ref45.parentFieldName,
    nullFieldPredicate = _ref45.nullFieldPredicate;

  if (fieldName === 'AND' || fieldName === 'OR') {
    return translateLogicalFilter({
      filterValue: filterValue,
      variableName: variableName,
      filterOperationType: filterOperationType,
      filterOperationField: filterOperationField,
      fieldName: fieldName,
      filterParam: filterParam,
      schema: schema,
      schemaType: schemaType,
      parameterPath: parameterPath,
      nullFieldPredicate: nullFieldPredicate
    });
  } else {
    var schemaTypeField = schemaType.getFields()[filterOperationField];
    var innerSchemaType = (0, _utils.innerType)(schemaTypeField.type);
    var typeName = innerSchemaType.name;
    var isObjectTypeFilter = (0, _graphql.isObjectType)(innerSchemaType);
    var isInterfaceTypeFilter = (0, _graphql.isInterfaceType)(innerSchemaType);

    if (isObjectTypeFilter || isInterfaceTypeFilter) {
      var _decideRelationFilter3 = decideRelationFilterMetadata({
          fieldName: fieldName,
          parentSchemaType: parentSchemaType,
          schemaType: schemaType,
          variableName: variableName,
          innerSchemaType: innerSchemaType,
          filterOperationField: filterOperationField
        }),
        _decideRelationFilter4 = (0, _slicedToArray2['default'])(
          _decideRelationFilter3,
          9
        ),
        thisType = _decideRelationFilter4[0],
        relatedType = _decideRelationFilter4[1],
        relationLabel = _decideRelationFilter4[2],
        relationDirection = _decideRelationFilter4[3],
        isRelation = _decideRelationFilter4[4],
        isRelationType = _decideRelationFilter4[5],
        isRelationTypeNode = _decideRelationFilter4[6],
        isReflexiveRelationType = _decideRelationFilter4[7],
        isReflexiveTypeDirectedField = _decideRelationFilter4[8];

      if (
        (0, _utils.isTemporalType)(typeName) ||
        (0, _utils.isSpatialType)(typeName) ||
        (0, _utils.isSpatialDistanceInputType)({
          filterOperationType: filterOperationType
        })
      ) {
        return translateNeo4jTypeFilter({
          typeName: typeName,
          isRelationTypeNode: isRelationTypeNode,
          filterValue: filterValue,
          variableName: variableName,
          filterOperationField: filterOperationField,
          filterOperationType: filterOperationType,
          fieldName: fieldName,
          filterParam: filterParam,
          parameterPath: parameterPath,
          parentParamPath: parentParamPath,
          isListFilterArgument: isListFilterArgument,
          nullFieldPredicate: nullFieldPredicate
        });
      } else if (isRelation || isRelationType || isRelationTypeNode) {
        return translateRelationFilter({
          rootIsRelationType: rootIsRelationType,
          thisType: thisType,
          relatedType: relatedType,
          relationLabel: relationLabel,
          relationDirection: relationDirection,
          isRelationType: isRelationType,
          isRelationTypeNode: isRelationTypeNode,
          isReflexiveRelationType: isReflexiveRelationType,
          isReflexiveTypeDirectedField: isReflexiveTypeDirectedField,
          filterValue: filterValue,
          variableName: variableName,
          filterOperationField: filterOperationField,
          filterOperationType: filterOperationType,
          fieldName: fieldName,
          filterParam: filterParam,
          schema: schema,
          schemaType: schemaType,
          innerSchemaType: innerSchemaType,
          parameterPath: parameterPath,
          parentParamPath: parentParamPath,
          isListFilterArgument: isListFilterArgument,
          nullFieldPredicate: nullFieldPredicate,
          parentSchemaType: parentSchemaType,
          parentFieldName: parentFieldName
        });
      }
    }
  }
};

var translateLogicalFilter = function translateLogicalFilter(_ref46) {
  var filterValue = _ref46.filterValue,
    variableName = _ref46.variableName,
    filterOperationType = _ref46.filterOperationType,
    filterOperationField = _ref46.filterOperationField,
    fieldName = _ref46.fieldName,
    filterParam = _ref46.filterParam,
    schema = _ref46.schema,
    schemaType = _ref46.schemaType,
    parameterPath = _ref46.parameterPath,
    nullFieldPredicate = _ref46.nullFieldPredicate;
  var listElementVariable = '_'.concat(fieldName); // build predicate expressions for all unique arguments within filterValue
  // isListFilterArgument is true here so that nullFieldPredicate is used

  var predicates = buildFilterPredicates({
    filterOperationType: filterOperationType,
    parentFieldName: fieldName,
    listVariable: listElementVariable,
    parentSchemaType: schemaType,
    isListFilterArgument: true,
    schemaType: schemaType,
    variableName: variableName,
    filterValue: filterValue,
    filterParam: filterParam,
    // typeFields,
    schema: schema
  });
  var predicateListVariable = parameterPath; // decide root predicate function

  var rootPredicateFunction = decidePredicateFunction({
    filterOperationField: filterOperationField
  }); // build root predicate expression

  var translation = buildPredicateFunction({
    nullFieldPredicate: nullFieldPredicate,
    predicateListVariable: predicateListVariable,
    rootPredicateFunction: rootPredicateFunction,
    predicates: predicates,
    listElementVariable: listElementVariable
  });
  return translation;
};

var translateRelationFilter = function translateRelationFilter(_ref47) {
  var rootIsRelationType = _ref47.rootIsRelationType,
    thisType = _ref47.thisType,
    relatedType = _ref47.relatedType,
    relationLabel = _ref47.relationLabel,
    relationDirection = _ref47.relationDirection,
    isRelationType = _ref47.isRelationType,
    isRelationTypeNode = _ref47.isRelationTypeNode,
    isReflexiveRelationType = _ref47.isReflexiveRelationType,
    isReflexiveTypeDirectedField = _ref47.isReflexiveTypeDirectedField,
    filterValue = _ref47.filterValue,
    variableName = _ref47.variableName,
    filterOperationField = _ref47.filterOperationField,
    filterOperationType = _ref47.filterOperationType,
    fieldName = _ref47.fieldName,
    filterParam = _ref47.filterParam,
    schema = _ref47.schema,
    schemaType = _ref47.schemaType,
    innerSchemaType = _ref47.innerSchemaType,
    parameterPath = _ref47.parameterPath,
    parentParamPath = _ref47.parentParamPath,
    isListFilterArgument = _ref47.isListFilterArgument,
    nullFieldPredicate = _ref47.nullFieldPredicate,
    parentSchemaType = _ref47.parentSchemaType,
    parentFieldName = _ref47.parentFieldName;

  if (isReflexiveTypeDirectedField) {
    // when at the 'from' or 'to' fields of a reflexive relation type payload
    // we need to use the name of the parent schema type, ex: 'person' for
    // Person.knows gets used here for reflexive path patterns, rather than
    // the normally set 'person_filter_person' variableName
    variableName = parentSchemaType.name.toLowerCase();
  }

  var pathExistencePredicate = buildRelationExistencePath(
    variableName,
    relationLabel,
    relationDirection,
    relatedType,
    isRelationTypeNode
  );

  if (isExistentialFilter(filterOperationType, filterValue)) {
    return translateNullFilter({
      filterOperationField: filterOperationField,
      filterOperationType: filterOperationType,
      propertyPath: pathExistencePredicate,
      filterParam: filterParam,
      parentParamPath: parentParamPath,
      isListFilterArgument: isListFilterArgument
    });
  }

  var parentFilterOperationField = filterOperationField;
  var parentFilterOperationType = filterOperationType;

  if (isReflexiveTypeDirectedField) {
    // causes the 'from' and 'to' fields on the payload of a reflexive
    // relation type to use the parent field name, ex: 'knows_some'
    // is used for 'from' and 'to' in 'knows_some: { from: {}, to: {} }'
    var parsedFilterName = parseFilterArgumentName(parentFieldName);
    parentFilterOperationField = parsedFilterName.name;
    parentFilterOperationType = parsedFilterName.type;
  } // build a list comprehension containing path pattern for related type

  var predicateListVariable = buildRelatedTypeListComprehension({
    rootIsRelationType: rootIsRelationType,
    variableName: variableName,
    thisType: thisType,
    relatedType: relatedType,
    relationLabel: relationLabel,
    relationDirection: relationDirection,
    isRelationTypeNode: isRelationTypeNode,
    isRelationType: isRelationType
  });
  var rootPredicateFunction = decidePredicateFunction({
    isRelationTypeNode: isRelationTypeNode,
    filterOperationField: parentFilterOperationField,
    filterOperationType: parentFilterOperationType
  });
  return buildRelationPredicate({
    rootIsRelationType: rootIsRelationType,
    parentFieldName: parentFieldName,
    isRelationType: isRelationType,
    isListFilterArgument: isListFilterArgument,
    isReflexiveRelationType: isReflexiveRelationType,
    isReflexiveTypeDirectedField: isReflexiveTypeDirectedField,
    thisType: thisType,
    relatedType: relatedType,
    schemaType: schemaType,
    innerSchemaType: innerSchemaType,
    fieldName: fieldName,
    filterOperationType: filterOperationType,
    filterValue: filterValue,
    filterParam: filterParam,
    schema: schema,
    parameterPath: parameterPath,
    nullFieldPredicate: nullFieldPredicate,
    pathExistencePredicate: pathExistencePredicate,
    predicateListVariable: predicateListVariable,
    rootPredicateFunction: rootPredicateFunction
  });
};

var decideRelationFilterMetadata = function decideRelationFilterMetadata(
  _ref48
) {
  var fieldName = _ref48.fieldName,
    parentSchemaType = _ref48.parentSchemaType,
    schemaType = _ref48.schemaType,
    variableName = _ref48.variableName,
    innerSchemaType = _ref48.innerSchemaType,
    filterOperationField = _ref48.filterOperationField;
  var thisType = '';
  var relatedType = '';
  var isRelation = false;
  var isRelationType = false;
  var isRelationTypeNode = false;
  var isReflexiveRelationType = false;
  var isReflexiveTypeDirectedField = false; // @relation field directive

  var _relationDirective = (0, _utils.relationDirective)(
      schemaType,
      filterOperationField
    ),
    relLabel = _relationDirective.name,
    relDirection = _relationDirective.direction; // @relation type directive on node type field

  var innerRelationTypeDirective = (0, _utils.getRelationTypeDirective)(
    innerSchemaType.astNode
  ); // @relation type directive on this type; node type field on relation type
  // If there is no @relation directive on the schemaType, check the parentSchemaType
  // for the same directive obtained above when the relation type is first seen

  var relationTypeDirective = (0, _utils.getRelationTypeDirective)(
    schemaType.astNode
  );

  if (relLabel && relDirection) {
    isRelation = true;
    var typeVariables = (0, _utils.typeIdentifiers)(innerSchemaType);
    thisType = schemaType.name;
    relatedType = typeVariables.typeName;
  } else if (innerRelationTypeDirective) {
    isRelationType = true;

    var _decideRelationTypeDi = decideRelationTypeDirection(
      schemaType,
      innerRelationTypeDirective
    );

    var _decideRelationTypeDi2 = (0, _slicedToArray2['default'])(
      _decideRelationTypeDi,
      3
    );

    thisType = _decideRelationTypeDi2[0];
    relatedType = _decideRelationTypeDi2[1];
    relDirection = _decideRelationTypeDi2[2];

    if (thisType === relatedType) {
      isReflexiveRelationType = true;

      if (fieldName === 'from') {
        isReflexiveTypeDirectedField = true;
        relDirection = 'IN';
      } else if (fieldName === 'to') {
        isReflexiveTypeDirectedField = true;
        relDirection = 'OUT';
      }
    }

    relLabel = innerRelationTypeDirective.name;
  } else if (relationTypeDirective) {
    isRelationTypeNode = true;

    var _decideRelationTypeDi3 = decideRelationTypeDirection(
      parentSchemaType,
      relationTypeDirective
    );

    var _decideRelationTypeDi4 = (0, _slicedToArray2['default'])(
      _decideRelationTypeDi3,
      3
    );

    thisType = _decideRelationTypeDi4[0];
    relatedType = _decideRelationTypeDi4[1];
    relDirection = _decideRelationTypeDi4[2];
    relLabel = variableName;
  }

  return [
    thisType,
    relatedType,
    relLabel,
    relDirection,
    isRelation,
    isRelationType,
    isRelationTypeNode,
    isReflexiveRelationType,
    isReflexiveTypeDirectedField
  ];
};

var decideRelationTypeDirection = function decideRelationTypeDirection(
  schemaType,
  relationTypeDirective
) {
  var fromType = relationTypeDirective.from;
  var toType = relationTypeDirective.to;
  var relDirection = 'OUT';

  if (fromType !== toType) {
    if (schemaType && schemaType.name === toType) {
      var temp = fromType;
      fromType = toType;
      toType = temp;
      relDirection = 'IN';
    }
  }

  return [fromType, toType, relDirection];
};

var buildRelationPredicate = function buildRelationPredicate(_ref49) {
  var rootIsRelationType = _ref49.rootIsRelationType,
    parentFieldName = _ref49.parentFieldName,
    isRelationType = _ref49.isRelationType,
    isReflexiveRelationType = _ref49.isReflexiveRelationType,
    isReflexiveTypeDirectedField = _ref49.isReflexiveTypeDirectedField,
    thisType = _ref49.thisType,
    isListFilterArgument = _ref49.isListFilterArgument,
    relatedType = _ref49.relatedType,
    schemaType = _ref49.schemaType,
    innerSchemaType = _ref49.innerSchemaType,
    fieldName = _ref49.fieldName,
    filterOperationType = _ref49.filterOperationType,
    filterValue = _ref49.filterValue,
    filterParam = _ref49.filterParam,
    schema = _ref49.schema,
    parameterPath = _ref49.parameterPath,
    nullFieldPredicate = _ref49.nullFieldPredicate,
    pathExistencePredicate = _ref49.pathExistencePredicate,
    predicateListVariable = _ref49.predicateListVariable,
    rootPredicateFunction = _ref49.rootPredicateFunction;
  var isRelationList =
    filterOperationType === 'in' || filterOperationType === 'not_in';
  var relationVariable = buildRelationVariable(thisType, relatedType);
  var variableName = relatedType.toLowerCase();
  var listVariable = parameterPath;

  if (rootIsRelationType || isRelationType) {
    // change the variable to be used in filtering
    // to the appropriate relationship variable
    // ex: project -> person_filter_project
    variableName = relationVariable;
  }

  if (isRelationList) {
    // set the base list comprehension variable
    // to point at each array element instead
    // ex: $filter.company_in -> _company_in
    listVariable = '_'.concat(fieldName); // set to list to enable null field
    // skipping for all child filters

    isListFilterArgument = true;
  }

  var predicates = buildFilterPredicates({
    parentFieldName: fieldName,
    parentSchemaType: schemaType,
    schemaType: innerSchemaType,
    variableName: variableName,
    isListFilterArgument: isListFilterArgument,
    listVariable: listVariable,
    filterOperationType: filterOperationType,
    isRelationType: isRelationType,
    filterValue: filterValue,
    filterParam: filterParam,
    schema: schema
  });

  if (isRelationList) {
    predicates = buildPredicateFunction({
      predicateListVariable: parameterPath,
      listElementVariable: listVariable,
      rootPredicateFunction: rootPredicateFunction,
      predicates: predicates
    });
    rootPredicateFunction = decidePredicateFunction({
      isRelationList: isRelationList
    });
  }

  if (isReflexiveRelationType && !isReflexiveTypeDirectedField) {
    // At reflexive relation type fields, sufficient predicates and values are already
    // obtained from the above call to the recursive buildFilterPredicates
    // ex: Person.knows, Person.knows_in, etc.
    // Note: Since only the internal 'from' and 'to' fields are translated for reflexive
    // relation types, their translations will use the fieldName and schema type name
    // of this field. See: the top of translateRelationFilter
    return predicates;
  }

  var listElementVariable = (0, _utils.safeVar)(variableName);
  return buildPredicateFunction({
    nullFieldPredicate: nullFieldPredicate,
    pathExistencePredicate: pathExistencePredicate,
    predicateListVariable: predicateListVariable,
    rootPredicateFunction: rootPredicateFunction,
    predicates: predicates,
    listElementVariable: listElementVariable
  });
};

var buildPredicateFunction = function buildPredicateFunction(_ref50) {
  var nullFieldPredicate = _ref50.nullFieldPredicate,
    pathExistencePredicate = _ref50.pathExistencePredicate,
    predicateListVariable = _ref50.predicateListVariable,
    rootPredicateFunction = _ref50.rootPredicateFunction,
    predicates = _ref50.predicates,
    listElementVariable = _ref50.listElementVariable;
  // https://neo4j.com/docs/cypher-manual/current/functions/predicate/
  return ''
    .concat(nullFieldPredicate || '')
    .concat(
      pathExistencePredicate
        ? 'EXISTS('.concat(pathExistencePredicate, ') AND ')
        : ''
    )
    .concat(rootPredicateFunction, '(')
    .concat(listElementVariable, ' IN ')
    .concat(predicateListVariable, ' WHERE ')
    .concat(predicates, ')');
};

var buildRelationVariable = function buildRelationVariable(
  thisType,
  relatedType
) {
  return ''
    .concat(thisType.toLowerCase(), '_filter_')
    .concat(relatedType.toLowerCase());
};

var decidePredicateFunction = function decidePredicateFunction(_ref51) {
  var filterOperationField = _ref51.filterOperationField,
    filterOperationType = _ref51.filterOperationType,
    isRelationTypeNode = _ref51.isRelationTypeNode,
    isRelationList = _ref51.isRelationList;
  if (filterOperationField === 'AND') return 'ALL';
  else if (filterOperationField === 'OR') return 'ANY';
  else if (isRelationTypeNode) return 'ALL';
  else if (isRelationList) return 'ALL';
  else {
    switch (filterOperationType) {
      case 'not':
        return 'NONE';

      case 'in':
        return 'ANY';

      case 'not_in':
        return 'NONE';

      case 'some':
        return 'ANY';

      case 'every':
        return 'ALL';

      case 'none':
        return 'NONE';

      case 'single':
        return 'SINGLE';

      case 'distance':
      case 'distance_lt':
      case 'distance_lte':
      case 'distance_gt':
      case 'distance_gte':
        return 'distance';

      default:
        return 'ALL';
    }
  }
};

var buildRelatedTypeListComprehension = function buildRelatedTypeListComprehension(
  _ref52
) {
  var rootIsRelationType = _ref52.rootIsRelationType,
    variableName = _ref52.variableName,
    thisType = _ref52.thisType,
    relatedType = _ref52.relatedType,
    relationLabel = _ref52.relationLabel,
    relationDirection = _ref52.relationDirection,
    isRelationTypeNode = _ref52.isRelationTypeNode,
    isRelationType = _ref52.isRelationType;
  var relationVariable = buildRelationVariable(thisType, relatedType);

  if (rootIsRelationType) {
    relationVariable = variableName;
  }

  var thisTypeVariable =
    !rootIsRelationType && !isRelationTypeNode
      ? (0, _utils.safeVar)((0, _utils.lowFirstLetter)(variableName))
      : (0, _utils.safeVar)((0, _utils.lowFirstLetter)(thisType)); // prevents related node variable from
  // conflicting with parent variables

  var relatedTypeVariable = (0, _utils.safeVar)(
    '_'.concat(relatedType.toLowerCase())
  ); // builds a path pattern within a list comprehension
  // that extracts related nodes

  return '[('
    .concat(thisTypeVariable, ')')
    .concat(relationDirection === 'IN' ? '<' : '', '-[')
    .concat(
      isRelationType
        ? (0, _utils.safeVar)('_'.concat(relationVariable))
        : isRelationTypeNode
        ? (0, _utils.safeVar)(relationVariable)
        : ''
    )
    .concat(!isRelationTypeNode ? ':'.concat(relationLabel) : '', ']-')
    .concat(relationDirection === 'OUT' ? '>' : '', '(')
    .concat(isRelationType ? '' : relatedTypeVariable, ':')
    .concat(relatedType, ') | ')
    .concat(
      isRelationType
        ? (0, _utils.safeVar)('_'.concat(relationVariable))
        : relatedTypeVariable,
      ']'
    );
};

var buildRelationExistencePath = function buildRelationExistencePath(
  fromVar,
  relLabel,
  relDirection,
  toType,
  isRelationTypeNode
) {
  // because ALL(n IN [] WHERE n) currently returns true
  // an existence predicate is added to make sure a relationship exists
  // otherwise a node returns when it has 0 such relationships, since the
  // predicate function then evaluates an empty list
  var safeFromVar = (0, _utils.safeVar)(fromVar);
  return !isRelationTypeNode
    ? '('
        .concat(safeFromVar, ')')
        .concat(relDirection === 'IN' ? '<' : '', '-[:')
        .concat(relLabel, ']-')
        .concat(relDirection === 'OUT' ? '>' : '', '(:')
        .concat(toType, ')')
    : '';
};

var buildFilterPredicates = function buildFilterPredicates(_ref53) {
  var parentSchemaType = _ref53.parentSchemaType,
    parentFieldName = _ref53.parentFieldName,
    schemaType = _ref53.schemaType,
    variableName = _ref53.variableName,
    listVariable = _ref53.listVariable,
    filterValue = _ref53.filterValue,
    filterParam = _ref53.filterParam,
    schema = _ref53.schema,
    isListFilterArgument = _ref53.isListFilterArgument;
  return (0, _entries['default'])(filterValue)
    .reduce(function(predicates, _ref54) {
      var _ref55 = (0, _slicedToArray2['default'])(_ref54, 2),
        name = _ref55[0],
        value = _ref55[1];

      name = deserializeFilterFieldName(name);
      var predicate = translateFilterArgument({
        parentParamPath: listVariable,
        fieldName: name,
        filterValue: value,
        parentFieldName: parentFieldName,
        parentSchemaType: parentSchemaType,
        isListFilterArgument: isListFilterArgument,
        variableName: variableName,
        filterParam: filterParam,
        schemaType: schemaType,
        schema: schema
      });

      if (predicate) {
        predicates.push('('.concat(predicate, ')'));
      }

      return predicates;
    }, [])
    .join(' AND ');
};

var translateNeo4jTypeFilter = function translateNeo4jTypeFilter(_ref56) {
  var typeName = _ref56.typeName,
    isRelationTypeNode = _ref56.isRelationTypeNode,
    filterValue = _ref56.filterValue,
    variableName = _ref56.variableName,
    filterOperationField = _ref56.filterOperationField,
    filterOperationType = _ref56.filterOperationType,
    fieldName = _ref56.fieldName,
    filterParam = _ref56.filterParam,
    parameterPath = _ref56.parameterPath,
    parentParamPath = _ref56.parentParamPath,
    isListFilterArgument = _ref56.isListFilterArgument,
    nullFieldPredicate = _ref56.nullFieldPredicate;
  var predicate = '';
  var cypherTypeConstructor = '';

  if (
    !(0, _utils.isSpatialDistanceInputType)({
      filterOperationType: filterOperationType
    })
  ) {
    switch (typeName) {
      case '_Neo4jTime':
        cypherTypeConstructor = 'time';
        break;

      case '_Neo4jDate':
        cypherTypeConstructor = 'date';
        break;

      case '_Neo4jDateTime':
        cypherTypeConstructor = 'datetime';
        break;

      case '_Neo4jLocalTime':
        cypherTypeConstructor = 'localtime';
        break;

      case '_Neo4jLocalDateTime':
        cypherTypeConstructor = 'localdatetime';
        break;

      case '_Neo4jPoint':
        cypherTypeConstructor = 'point';
        break;
    }
  }

  var safeVariableName = (0, _utils.safeVar)(variableName);
  var propertyPath = ''
    .concat(safeVariableName, '.')
    .concat(filterOperationField);

  if (isExistentialFilter(filterOperationType, filterValue)) {
    return translateNullFilter({
      filterOperationField: filterOperationField,
      filterOperationType: filterOperationType,
      propertyPath: propertyPath,
      filterParam: filterParam,
      parentParamPath: parentParamPath,
      isListFilterArgument: isListFilterArgument
    });
  }

  var rootPredicateFunction = decidePredicateFunction({
    isRelationTypeNode: isRelationTypeNode,
    filterOperationField: filterOperationField,
    filterOperationType: filterOperationType
  });
  predicate = buildNeo4jTypePredicate({
    typeName: typeName,
    fieldName: fieldName,
    filterOperationField: filterOperationField,
    filterOperationType: filterOperationType,
    parameterPath: parameterPath,
    variableName: variableName,
    nullFieldPredicate: nullFieldPredicate,
    rootPredicateFunction: rootPredicateFunction,
    cypherTypeConstructor: cypherTypeConstructor
  });
  return predicate;
};

var buildNeo4jTypePredicate = function buildNeo4jTypePredicate(_ref57) {
  var fieldName = _ref57.fieldName,
    filterOperationField = _ref57.filterOperationField,
    filterOperationType = _ref57.filterOperationType,
    parameterPath = _ref57.parameterPath,
    variableName = _ref57.variableName,
    nullFieldPredicate = _ref57.nullFieldPredicate,
    rootPredicateFunction = _ref57.rootPredicateFunction,
    cypherTypeConstructor = _ref57.cypherTypeConstructor;
  var isListFilterArgument =
    filterOperationType === 'in' || filterOperationType === 'not_in'; // ex: project -> person_filter_project

  var listVariable = parameterPath; // ex: $filter.datetime_in -> _datetime_in

  if (isListFilterArgument) listVariable = '_'.concat(fieldName);
  var safeVariableName = (0, _utils.safeVar)(variableName);
  var propertyPath = ''
    .concat(safeVariableName, '.')
    .concat(filterOperationField);
  var operatorExpression = buildOperatorExpression({
    filterOperationType: filterOperationType,
    propertyPath: propertyPath,
    isListFilterArgument: isListFilterArgument,
    parameterPath: parameterPath
  });

  if (
    (0, _utils.isSpatialDistanceInputType)({
      filterOperationType: filterOperationType
    })
  ) {
    listVariable = ''.concat(listVariable, '.distance');
  }

  var translation = '('
    .concat(nullFieldPredicate)
    .concat(operatorExpression, ' ')
    .concat(cypherTypeConstructor, '(')
    .concat(listVariable, '))');

  if (isListFilterArgument) {
    translation = buildPredicateFunction({
      predicateListVariable: parameterPath,
      listElementVariable: listVariable,
      rootPredicateFunction: rootPredicateFunction,
      predicates: translation
    });
  }

  return translation;
};
