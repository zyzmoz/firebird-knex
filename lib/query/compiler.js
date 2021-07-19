"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits3 = _interopRequireDefault(require("inherits"));

var _querycompiler = _interopRequireDefault(require("knex/lib/query/querycompiler"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var QueryCompiler_Firebird = /*#__PURE__*/function (_QueryCompiler) {
  (0, _inherits2["default"])(QueryCompiler_Firebird, _QueryCompiler);

  var _super = _createSuper(QueryCompiler_Firebird);

  function QueryCompiler_Firebird() {
    (0, _classCallCheck2["default"])(this, QueryCompiler_Firebird);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(QueryCompiler_Firebird, [{
    key: "_calcRows",
    value: // TODO probably buggy. test it
    // limit 5           -> rows 1 to 5   - or just rows 5
    // limit 5 offset  0 -> rows 1 to 5   - or just rows 5
    // limit 5 offset 10 -> rows 11 to 15
    //         offset 10 -> rows 11 to very big value
    //         offset  0 -> nothing
    function _calcRows() {
      var _this$single = this.single,
          limit = _this$single.limit,
          offset = _this$single.offset;

      if (!limit && limit !== 0) {
        if (!offset) return [];
        return [offset + 1, 1 << 30];
      } else {
        if (!offset) return [limit];
        return [offset + 1, offset + limit];
      }
    }
  }, {
    key: "limit",
    value: function limit() {
      var rows = this._calcRows()[0];

      if (rows === undefined) return;
      return 'rows ' + this.formatter.parameter(rows);
    }
  }, {
    key: "offset",
    value: function offset() {
      var to = this._calcRows()[1];

      if (to === undefined) return;
      return 'to ' + this.formatter.parameter(to);
    }
  }, {
    key: "_prepInsert",
    value: function _prepInsert(insertValues) {
      var newValues = {};

      for (var key in insertValues) {
        var value = insertValues[key];

        if (typeof value !== 'undefined') {
          newValues[key] = value;
        }
      }

      return _querycompiler["default"].prototype._prepInsert.call(this, newValues);
    } // Compiles a `columnInfo` query

  }, {
    key: "columnInfo",
    value: function columnInfo() {
      var column = this.single.columnInfo; // The user may have specified a custom wrapIdentifier function in the config. We
      // need to run the identifiers through that function, but not format them as
      // identifiers otherwise.

      var table = this.client.customWrapIdentifier(this.single.table, identity);
      return {
        sql: "\n      select \n        rlf.rdb$field_name as name,\n        fld.rdb$character_length as max_length,\n        typ.rdb$type_name as type,\n        rlf.rdb$null_flag as not_null\n      from rdb$relation_fields rlf\n      inner join rdb$fields fld on fld.rdb$field_name = rlf.rdb$field_source\n      inner join rdb$types typ on typ.rdb$type = fld.rdb$field_type\n      where rdb$relation_name = '".concat(table, "'\n      "),
        output: function output(resp) {
          var _resp = (0, _slicedToArray2["default"])(resp, 2),
              rows = _resp[0],
              fields = _resp[1];

          var maxLengthRegex = /.*\((\d+)\)/;
          var out = reduce(rows, function (columns, val) {
            var name = val.NAME.trim();
            columns[name] = {
              type: val.TYPE.trim().toLowerCase(),
              nullable: !val.NOT_NULL // ATSTODO: "defaultValue" não implementado
              // defaultValue: null,

            };

            if (val.MAX_LENGTH) {
              columns[name] = val.MAX_LENGTH;
            }

            return columns;
          }, {});
          console.log('Resultado columnInfo', {
            out: out,
            column: column
          });
          return column && out[column] || out;
        }
      };
    }
  }, {
    key: "whereIn",
    value: function whereIn(statement) {
      var _this = this;

      // O FB não suporta `in` de tupla para tupla; neste caso, monta um or
      if (Array.isArray(statement.column)) {
        var conditions = statement.value.map(function (valueCols) {
          return valueCols.map(function (value, idx) {
            return "".concat(_this['formatter'].columnize(statement.column[idx]), " = ").concat(_this['formatter'].values(value));
          }).join(' and ');
        });
        return "( ".concat(conditions.join('\n or '), " )");
      }

      return (0, _get2["default"])((0, _getPrototypeOf2["default"])(QueryCompiler_Firebird.prototype), "whereIn", this).call(this, statement);
    }
  }]);
  return QueryCompiler_Firebird;
}(_querycompiler["default"]);

var _default = QueryCompiler_Firebird;
exports["default"] = _default;