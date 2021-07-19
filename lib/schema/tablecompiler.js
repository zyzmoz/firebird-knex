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

var _inherits3 = _interopRequireDefault(require("inherits"));

var _tablecompiler = _interopRequireDefault(require("knex/lib/schema/tablecompiler"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// Table Compiler
// -------
var TableCompiler_Firebird = /*#__PURE__*/function (_TableCompiler) {
  (0, _inherits2["default"])(TableCompiler_Firebird, _TableCompiler);

  var _super = _createSuper(TableCompiler_Firebird);

  function TableCompiler_Firebird() {
    (0, _classCallCheck2["default"])(this, TableCompiler_Firebird);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(TableCompiler_Firebird, [{
    key: "createQuery",
    value: // Create a new table.
    function createQuery(columns, ifNot) {
      if (ifNot) throw new Error('createQuery ifNot not implemented');
      var createStatement = 'create table ';
      var sql = createStatement + this.tableName() + ' (' + columns.sql.join(', ') + ')';
      this.pushQuery(sql);
    } // Compile a plain index key command.

  }, {
    key: "index",
    value: function index(columns, indexName) {
      indexName = indexName ? this.formatter.wrap(indexName) : this._indexCommand('index', this.tableNameRaw, columns);
      this.pushQuery("create index ".concat(indexName, " on ").concat(this.tableName(), " (").concat(this.formatter.columnize(columns), ")"));
    } //TableCompiler_Firebird.prototype.foreign =

  }, {
    key: "primary",
    value: function primary() {
      this.constraintName = this.constraintName ? this.formatter.wrap(this.constraintName) : this.formatter.wrap("".concat(this.tableNameRaw, "_pkey"));
      this.pushQuery("alter table ".concat(this.tableName(), " add constraint ").concat(this.constraintName, " primary key (").concat(this.formatter.columnize(columns), ")"));
    }
  }]);
  return TableCompiler_Firebird;
}(_tablecompiler["default"]);

var _default = TableCompiler_Firebird;
exports["default"] = _default;