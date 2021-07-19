"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _formatter = _interopRequireDefault(require("knex/lib/formatter"));

var _raw = _interopRequireDefault(require("knex/lib/raw"));

var _inherits = _interopRequireDefault(require("inherits"));

function Firebird_Formatter() {
  _formatter["default"].apply(this, arguments);
}

(0, _inherits["default"])(Firebird_Formatter, _formatter["default"]);
Object.assign(Firebird_Formatter.prototype, {
  values: function values(_values) {
    var _this = this;

    if (Array.isArray(_values)) {
      if (Array.isArray(_values[0])) {
        return "( values ".concat(_values.map(function (value) {
          return "(".concat(_this.parameterize(value), ")");
        }).join(', '), ")");
      }

      return "(".concat(this.parameterize(_values), ")");
    }

    if (_values instanceof _raw["default"]) {
      return "(".concat(this.parameter(_values), ")");
    }

    return this.parameter(_values);
  }
});
var _default = Firebird_Formatter;
exports["default"] = _default;