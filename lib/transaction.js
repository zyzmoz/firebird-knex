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

var _transaction = _interopRequireDefault(require("knex/lib/execution/transaction"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var debug = require('debug')('knex:tx');

var Transaction_Firebird = /*#__PURE__*/function (_Transaction) {
  (0, _inherits2["default"])(Transaction_Firebird, _Transaction);

  var _super = _createSuper(Transaction_Firebird);

  function Transaction_Firebird() {
    (0, _classCallCheck2["default"])(this, Transaction_Firebird);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Transaction_Firebird, [{
    key: "begin",
    value: function begin(conn) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        conn.transaction(_this.client.driver.ISOLATION_READ_COMMITED, function (error, transaction) {
          if (error) return reject(error);
          conn._transaction = transaction;
          resolve();
        });
      });
    }
  }, {
    key: "savepoint",
    value: function savepoint() {
      throw new Error('savepoints not implemented');
    }
  }, {
    key: "commit",
    value: function commit(conn, value) {
      return this.query(conn, 'commit', 1, value);
    }
  }, {
    key: "release",
    value: function release() {
      throw new Error('releasing savepoints not implemented');
    }
  }, {
    key: "rollback",
    value: function rollback(conn, error) {
      return this.query(conn, 'rollback', 2, error);
    }
  }, {
    key: "rollbackTo",
    value: function rollbackTo() {
      throw new Error('rolling back to savepoints not implemented');
    }
  }, {
    key: "query",
    value: function query(conn, method, status, value) {
      var _this2 = this;

      var q = new Promise(function (resolve, reject) {
        var transaction = conn._transaction;
        delete conn._transaction;
        transaction[method](function (error) {
          if (error) return reject(error);
          resolve();
        });
      })["catch"](function (error) {
        status = 2;
        value = error;
        _this2._completed = true;
        debug('%s error running transaction query', _this2.txid);
      }).tap(function () {
        if (status === 1) _this2._resolver(value);
        if (status === 2) _this2._rejecter(value);
      });

      if (status === 1 || status === 2) {
        this._completed = true;
      }

      return q;
    }
  }]);
  return Transaction_Firebird;
}(_transaction["default"]);

var _default = Transaction_Firebird;
exports["default"] = _default;