"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _compiler = _interopRequireDefault(require("knex/lib/schema/compiler"));

var _lodash = require("lodash");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// Schema Compiler
// -------
var SchemaCompiler_Firebird = /*#__PURE__*/function (_SchemaCompiler) {
  (0, _inherits2["default"])(SchemaCompiler_Firebird, _SchemaCompiler);

  var _super = _createSuper(SchemaCompiler_Firebird);

  function SchemaCompiler_Firebird() {
    (0, _classCallCheck2["default"])(this, SchemaCompiler_Firebird);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(SchemaCompiler_Firebird, [{
    key: "hasTable",
    value: // Compile the query to determine if a table exists.
    function hasTable(tableName) {
      var fullTableName = this.formatter.wrap(prefixedTableName(this.schema, String(tableName))).toUpperCase();
      var sql = "select 1 from rdb$relations where rdb$relation_name = '".concat(fullTableName, "'");
      this.pushQuery({
        sql: sql,
        output: function output(resp) {
          return resp.length > 0;
        }
      });
    } // Compile the query to determine if a column exists.

  }, {
    key: "hasColumn",
    value: function hasColumn(tableName, column) {
      this.pushQuery({
        sql: "select i.rdb$field_name as \"Field\" from " + "rdb$relations r join rdb$RELATION_FIELDS i " + "on (i.rdb$relation_name = r.rdb$relation_name) " + "where r.rdb$relation_name = ".concat(this.formatter.wrap(tableName)),
        output: function output(resp) {
          var _this = this;

          return (0, _lodash.some)(resp, function (col) {
            return _this.client.wrapIdentifier(col.name.toLowerCase()) === _this.client.wrapIdentifier(column.toLowerCase());
          });
        }
      });
    }
  }, {
    key: "dropTableIfExists",
    value: function dropTableIfExists(tableName) {
      var fullTableName = this.formatter.wrap(prefixedTableName(this.schema, tableName)).toUpperCase();
      var dropTableSql = this.dropTablePrefix + fullTableName;
      this.pushQuery("\n      EXECUTE BLOCK AS BEGIN\n      if (exists(select 1 from rdb$relations where rdb$relation_name = '".concat(fullTableName, "')) then\n      execute statement '").concat(dropTableSql, "';\n      END\n    "));
      return this;
    }
  }, {
    key: "renameTable",
    value: function renameTable(tableName, to) {
      throw new Error("".concat(this.name, " is not implemented for this dialect (http://www.firebirdfaq.org/faq363/)."));
    }
  }]);
  return SchemaCompiler_Firebird;
}(_compiler["default"]);

function prefixedTableName(prefix, table) {
  return prefix ? "".concat(prefix, ".").concat(table) : table;
}

var _default = SchemaCompiler_Firebird;
exports["default"] = _default;