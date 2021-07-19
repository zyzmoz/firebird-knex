"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _lodash = require("lodash");

var _util = require("util");

var _assert = _interopRequireDefault(require("assert"));

var _client = _interopRequireDefault(require("knex/lib/client"));

var _columncompiler = _interopRequireDefault(require("./schema/columncompiler"));

var _compiler = _interopRequireDefault(require("./query/compiler"));

var _tablecompiler = _interopRequireDefault(require("./schema/tablecompiler"));

var _transaction = _interopRequireDefault(require("./transaction"));

var _compiler2 = _interopRequireDefault(require("./schema/compiler"));

var _formatter = _interopRequireDefault(require("./formatter"));

var _ddl = _interopRequireDefault(require("./schema/ddl"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Client_Firebird = /*#__PURE__*/function (_Client) {
  (0, _inherits2["default"])(Client_Firebird, _Client);

  var _super = _createSuper(Client_Firebird);

  function Client_Firebird() {
    (0, _classCallCheck2["default"])(this, Client_Firebird);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Client_Firebird, [{
    key: "_driver",
    value: function _driver() {
      return require('node-firebird');
    }
  }, {
    key: "schemaCompiler",
    value: function schemaCompiler() {
      return (0, _construct2["default"])(_compiler2["default"], [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "queryCompiler",
    value: function queryCompiler(builder, formatter) {
      return new _compiler["default"](this, builder, formatter);
    }
  }, {
    key: "columnCompiler",
    value: function columnCompiler() {
      return (0, _construct2["default"])(_columncompiler["default"], [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "tableCompiler",
    value: function tableCompiler() {
      return (0, _construct2["default"])(_tablecompiler["default"], [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "transaction",
    value: function transaction() {
      return (0, _construct2["default"])(_transaction["default"], [this].concat(Array.prototype.slice.call(arguments)));
    }
  }, {
    key: "wrapIdentifierImpl",
    value: function wrapIdentifierImpl(value) {
      if (value === '*') return value;

      if (!/^[A-Za-z0-9_]+$/.test(value)) {
        //Dialect 1 of firebird doesn't support special characters
        //Backquotes only available on dialect 3
        throw new Error("Invalid identifier: \"".concat(value, "\"; Dialect 1 doesn't support special characters."));
      }

      return value;
    } // Get a raw connection from the database, returning a promise with the connection object.

  }, {
    key: "acquireRawConnection",
    value: function acquireRawConnection() {
      var _this = this;

      (0, _assert["default"])(!this._connectionForTransactions);
      return new _bluebird["default"](function (resolve, reject) {
        _this.driver.attach(_this.connectionSettings, function (error, connection) {
          if (error) return reject(error);
          resolve(connection);
        });
      });
    } // Used to explicitly close a connection, called internally by the pool when
    // a connection times out or the pool is shutdown.

  }, {
    key: "destroyRawConnection",
    value: function () {
      var _destroyRawConnection = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(connection) {
        var close;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                close = (0, _util.promisify)(function (cb) {
                  return connection.detach(cb);
                });
                return _context.abrupt("return", close());

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function destroyRawConnection(_x) {
        return _destroyRawConnection.apply(this, arguments);
      }

      return destroyRawConnection;
    }() // Runs the query on the specified connection, providing the bindings and any
    // other necessary prep work.

  }, {
    key: "_query",
    value: function _query(connection, obj) {
      if (!obj || typeof obj === 'string') obj = {
        sql: obj
      };
      return new _bluebird["default"](function (resolver, rejecter) {
        if (!connection) {
          return rejecter(new Error("Error calling ".concat(callMethod, " on connection.")));
        }

        ;
        var _obj = obj,
            sql = _obj.sql;
        console.log('SQL', sql);
        if (!sql) return resolver();
        var c = connection._trasaction || connection;
        c.query(sql, obj.bindings, function (error, rows, fields) {
          if (error) return rejecter(error);
          obj.response = [rows, fields];
          resolver(obj);
        });
      });
    }
  }, {
    key: "_stream",
    value: function _stream(connection, sql, stream) {
      throw new Error('_stream not implemented'); // const client = this;
      // return new Bluebird(function (resolver, rejecter) {
      //   stream.on('error', rejecter);
      //   stream.on('end', resolver);
      //   return client
      //     ._query(connection, sql)
      //     .then((obj) => obj.response)
      //     .then((rows) => rows.forEach((row) => stream.write(row)))
      //     .catch(function (err) {
      //       stream.emit('error', err);
      //     })
      //     .then(function () {
      //       stream.end();
      //     });
      // });
    } // Ensures the response is returned in the same format as other clients.

  }, {
    key: "processResponse",
    value: function processResponse(obj, runner) {
      if (!obj) return;
      var response = obj.response;
      if (obj.output) return obj.output.call(runner, response);

      var _response = (0, _slicedToArray2["default"])(response, 2),
          rows = _response[0],
          fields = _response[1];

      this._fixBufferStrings(rows, fields);

      return this._fixBlobCallbacks(rows, fields);
    }
  }, {
    key: "_fixBufferStrings",
    value: function _fixBufferStrings(rows, fields) {
      if (!rows) return rows;

      var _iterator = _createForOfIteratorHelper(rows),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var row = _step.value;

          for (var cell in row) {
            var value = row[cell];

            if (Buffer.isBuffer(value)) {
              var _iterator2 = _createForOfIteratorHelper(fields),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var field = _step2.value;

                  if (field.alias === cell && (field.type === 448 || field.type === 452)) {
                    // SQLVarString
                    row[cell] = value.toString('latin1');
                    break;
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    /**
     * The Firebird library returns BLOLs with callback functions; Those need to be loaded asynchronously
     * @param {*} rows
     * @param {*} fields
     */

  }, {
    key: "_fixBlobCallbacks",
    value: function _fixBlobCallbacks(rows, fields) {
      if (!rows) return rows;
      var blobEntries = []; // Seek and verify if there is any BLOB

      var _iterator3 = _createForOfIteratorHelper(rows),
          _step3;

      try {
        var _loop = function _loop() {
          var row = _step3.value;

          var _loop2 = function _loop2(cell) {
            var value = row[cell]; // ATSTODO: Está presumindo que o blob é texto; recomenda-se diferenciar texto de binário. Talvez o "fields" ajude?
            // Is it a callback BLOB?

            if (value instanceof Function) {
              blobEntries.push(new Promise(function (resolve, reject) {
                value(function (err, name, stream) {
                  if (err) {
                    reject(err);
                    return;
                  } // ATSTODO: Ver como fazer quando o string não tiver o "setEncoding()"


                  if (!stream['setEncoding']) {
                    stream['setEncoding'] = function () {
                      return undefined;
                    };
                  } // ATSTODO: Não está convertendo os cadacteres acentuados corretamente, mesmo informando a codificação


                  resolve(readableToString(stream, 'latin1').then(function (blobString) {
                    row[cell] = blobString;
                  }));
                });
              }));
            }
          };

          for (var cell in row) {
            _loop2(cell);
          }
        };

        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          _loop();
        } // Returns a Promise that wait BLOBs be loaded and retuns it

      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return Promise.all(blobEntries).then(function () {
        return rows;
      });
    }
  }, {
    key: "poolDefaults",
    value: function poolDefaults() {
      return (0, _lodash.defaults)({
        min: 1,
        max: 1
      }, (0, _get2["default"])((0, _getPrototypeOf2["default"])(Client_Firebird.prototype), "poolDefaults", this).call(this, this));
    }
  }, {
    key: "ping",
    value: function ping(resource, callback) {
      resource.query('select 1 from RDB$DATABASE', callback);
    }
  }, {
    key: "ddl",
    value: function ddl(compiler, pragma, connection) {
      return new _ddl["default"](this, compiler, pragma, connection);
    }
  }]);
  return Client_Firebird;
}(_client["default"]);

Object.assign(Client_Firebird.prototype, {
  dialect: 'firebird',
  driverName: 'node-firebird',
  Firebird_Formatter: _formatter["default"]
});
var _default = Client_Firebird;
exports["default"] = _default;