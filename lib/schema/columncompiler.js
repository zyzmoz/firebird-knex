"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _columncompiler = _interopRequireDefault(require("knex/lib/schema/columncompiler"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// Column Compiler
// -------
var ColumnCompiler_Firebird = /*#__PURE__*/function (_ColumnCompiler) {
  (0, _inherits2["default"])(ColumnCompiler_Firebird, _ColumnCompiler);

  var _super = _createSuper(ColumnCompiler_Firebird);

  function ColumnCompiler_Firebird() {
    var _this;

    (0, _classCallCheck2["default"])(this, ColumnCompiler_Firebird);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "modifiers", ['collate', 'nullable']);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "increments", 'integer not null primary key');
    return _this;
  }

  (0, _createClass2["default"])(ColumnCompiler_Firebird, [{
    key: "collate",
    value: function collate(collation) {
      // TODO request `charset` modifier of knex column
      return collation && "character set ".concat(collation || 'ASCII');
    }
  }]);
  return ColumnCompiler_Firebird;
}(_columncompiler["default"]);

var _default = ColumnCompiler_Firebird;
exports["default"] = _default;