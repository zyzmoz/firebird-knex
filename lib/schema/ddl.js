"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = require("lodash");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var Firebird_DDL = /*#__PURE__*/function () {
  function Firebird_DDL(client, tableCompiler, pragma, connection) {
    (0, _classCallCheck2["default"])(this, Firebird_DDL);
    this.client = client;
    this.tableCompiler = tableCompiler;
    this.pragma = pragma;
    this.tableNameRaw = this.tableCompiler.tableNameRaw;
    this.alteredName = (0, _lodash.uniqueId)('_knex_temp_alter');
    this.connection = connection;
    this.formatter = client && client.config && client.config.wrapIdentifier ? client.config.wrapIdentifier : function (value) {
      return value;
    };
  }

  (0, _createClass2["default"])(Firebird_DDL, [{
    key: "tableName",
    value: function tableName() {
      return this.formatter(this.tableNameRaw, function (value) {
        return value;
      });
    }
  }, {
    key: "getColumn",
    value: function () {
      var _getColumn = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(column) {
        var _this = this;

        var currentCol;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                currentCol = (0, _lodash.find)(this.pragma, function (col) {
                  return _this.client.wrapIdentifier(col.name).toLowerCase() === _this.client.wrapIdentifier(column).toLowerCase();
                });

                if (currentCol) {
                  _context.next = 3;
                  break;
                }

                throw new Error("The column ".concat(column, " is not in the ").concat(this.tableName(), " table"));

              case 3:
                return _context.abrupt("return", currentCol);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getColumn(_x) {
        return _getColumn.apply(this, arguments);
      }

      return getColumn;
    }()
  }, {
    key: "getTableSql",
    value: function getTableSql() {
      var _this2 = this;

      this.trx.disableProcessing();
      return this.trx.raw("SELECT name, sql FROM sqlite_master WHERE type=\"table\" AND name=\"".concat(this.tableName(), "\"")).then(function (result) {
        _this2.trx.enableProcessing();

        return result;
      });
    }
  }, {
    key: "renameTable",
    value: function () {
      var _renameTable = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", this.trx.raw("ALTER TABLE \"".concat(this.tableName(), "\" RENAME TO \"").concat(this.alteredName, "\"")));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function renameTable() {
        return _renameTable.apply(this, arguments);
      }

      return renameTable;
    }()
  }, {
    key: "dropOriginal",
    value: function dropOriginal() {
      return this.trx.raw("DROP TABLE \"".concat(this.tableName(), "\""));
    }
  }, {
    key: "dropTempTable",
    value: function dropTempTable() {
      return this.trx.raw("DROP TABLE \"".concat(this.alteredName, "\""));
    }
  }, {
    key: "copyData",
    value: function copyData() {
      var _this3 = this;

      return this.trx.raw("SELECT * FROM \"".concat(this.tableName(), "\"")).then(function (result) {
        return _this3.insertChunked(20, _this3.alteredName, _lodash.identity, result);
      });
    }
  }, {
    key: "reinsertData",
    value: function reinsertData(iterator) {
      var _this4 = this;

      return this.trx.raw("SELECT * FROM \"".concat(this.alteredName, "\"")).then(function (result) {
        return _this4.insertChunked(20, _this4.tableName(), iterator, result);
      });
    }
  }, {
    key: "insertChunked",
    value: function () {
      var _insertChunked = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(chunkSize, target, iterator, result) {
        var chunked, _iterator, _step, batch;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                iterator = iterator || _lodash.identity;
                chunked = (0, _lodash.chunk)(result, chunkSize);
                _iterator = _createForOfIteratorHelper(chunked);
                _context3.prev = 3;

                _iterator.s();

              case 5:
                if ((_step = _iterator.n()).done) {
                  _context3.next = 11;
                  break;
                }

                batch = _step.value;
                _context3.next = 9;
                return this.trx.queryBuilder().table(target).insert((0, _lodash.map)(batch, iterator));

              case 9:
                _context3.next = 5;
                break;

              case 11:
                _context3.next = 16;
                break;

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](3);

                _iterator.e(_context3.t0);

              case 16:
                _context3.prev = 16;

                _iterator.f();

                return _context3.finish(16);

              case 19:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[3, 13, 16, 19]]);
      }));

      function insertChunked(_x2, _x3, _x4, _x5) {
        return _insertChunked.apply(this, arguments);
      }

      return insertChunked;
    }()
  }, {
    key: "createTempTable",
    value: function createTempTable(createTable) {
      return this.trx.raw(createTable.sql.replace(this.tableName(), this.alteredName));
    }
  }, {
    key: "_doReplace",
    value: function _doReplace(sql, from, to) {
      var oneLineSql = sql.replace(/\s+/g, ' ');
      var matched = oneLineSql.match(/^CREATE TABLE\s+(\S+)\s*\((.*)\)/);
      var tableName = matched[1];
      var defs = matched[2];

      if (!defs) {
        throw new Error('No column definitions in this statement!');
      }

      var parens = 0,
          args = [],
          ptr = 0;
      var i = 0;
      var x = defs.length;

      for (i = 0; i < x; i++) {
        switch (defs[i]) {
          case '(':
            parens++;
            break;

          case ')':
            parens--;
            break;

          case ',':
            if (parens === 0) {
              args.push(defs.slice(ptr, i));
              ptr = i + 1;
            }

            break;

          case ' ':
            if (ptr === i) {
              ptr = i + 1;
            }

            break;
        }
      }

      args.push(defs.slice(ptr, i));
      var fromIdentifier = from.replace(/[`"'[\]]/g, '');
      args = args.map(function (item) {
        var split = item.trim().split(' ');
        var fromMatchCandidates = [new RegExp("`".concat(fromIdentifier, "`"), 'i'), new RegExp("\"".concat(fromIdentifier, "\""), 'i'), new RegExp("'".concat(fromIdentifier, "'"), 'i'), new RegExp("\\[".concat(fromIdentifier, "\\]"), 'i')];

        if (fromIdentifier.match(/^\S+$/)) {
          fromMatchCandidates.push(new RegExp("\\b".concat(fromIdentifier, "\\b"), 'i'));
        }

        var doesMatchFromIdentifier = function doesMatchFromIdentifier(target) {
          return (0, _lodash.some)(fromMatchCandidates, function (c) {
            return target.match(c);
          });
        };

        var replaceFromIdentifier = function replaceFromIdentifier(target) {
          return fromMatchCandidates.reduce(function (result, candidate) {
            return result.replace(candidate, to);
          }, target);
        };

        if (doesMatchFromIdentifier(split[0])) {
          // column definition
          if (to) {
            split[0] = to;
            return split.join(' ');
          }

          return ''; // for deletions
        } // skip constraint name


        var idx = /constraint/i.test(split[0]) ? 2 : 0; // primary key and unique constraints have one or more
        // columns from this table listed between (); replace
        // one if it matches

        if (/primary|unique/i.test(split[idx])) {
          var ret = item.replace(/\(.*\)/, replaceFromIdentifier); // If any member columns are dropped then uniqueness/pk constraint
          // can not be retained

          if (ret !== item && (0, _lodash.isEmpty)(to)) return '';
          return ret;
        } // foreign keys have one or more columns from this table
        // listed between (); replace one if it matches
        // foreign keys also have a 'references' clause
        // which may reference THIS table; if it does, replace
        // column references in that too!


        if (/foreign/.test(split[idx])) {
          split = item.split(/ references /i); // the quoted column names save us from having to do anything
          // other than a straight replace here

          var replacedKeySpec = replaceFromIdentifier(split[0]);

          if (split[0] !== replacedKeySpec) {
            // If we are removing one or more columns of a foreign
            // key, then we should not retain the key at all
            if ((0, _lodash.isEmpty)(to)) return '';else split[0] = replacedKeySpec;
          }

          if (split[1].slice(0, tableName.length) === tableName) {
            // self-referential foreign key
            var replacedKeyTargetSpec = split[1].replace(/\(.*\)/, replaceFromIdentifier);

            if (split[1] !== replacedKeyTargetSpec) {
              // If we are removing one or more columns of a foreign
              // key, then we should not retain the key at all
              if ((0, _lodash.isEmpty)(to)) return '';else split[1] = replacedKeyTargetSpec;
            }
          }

          return split.join(' references ');
        }

        return item;
      });
      args = args.filter((0, _lodash.negate)(_lodash.isEmpty));

      if (args.length === 0) {
        throw new Error('Unable to drop last column from table');
      }

      return oneLineSql.replace(/\(.*\)/, function () {
        return "(".concat(args.join(', '), ")");
      }).replace(/,\s*([,)])/, '$1');
    } // Boy, this is quite a method.

  }, {
    key: "renameColumn",
    value: function () {
      var _renameColumn = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(from, to) {
        var _this5 = this;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", this.client.transaction( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(trx) {
                    var column, sql, a, b, createTable, newSql, _invert, mappedFrom, mappedTo;

                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _this5.trx = trx;
                            _context4.next = 3;
                            return _this5.getColumn(from);

                          case 3:
                            column = _context4.sent;
                            _context4.next = 6;
                            return _this5.getTableSql(column);

                          case 6:
                            sql = _context4.sent;
                            a = _this5.client.wrapIdentifier(from);
                            b = _this5.client.wrapIdentifier(to);
                            createTable = sql[0];
                            newSql = _this5._doReplace(createTable.sql, a, b);

                            if (!(sql === newSql)) {
                              _context4.next = 13;
                              break;
                            }

                            throw new Error('Unable to find the column to change');

                          case 13:
                            _invert = (0, _lodash.invert)(_this5.client.postProcessResponse((0, _lodash.invert)({
                              from: from,
                              to: to
                            }))), mappedFrom = _invert.from, mappedTo = _invert.to;
                            return _context4.abrupt("return", _this5.reinsertMapped(createTable, newSql, function (row) {
                              row[mappedTo] = row[mappedFrom];
                              return (0, _lodash.omit)(row, mappedFrom);
                            }));

                          case 15:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x8) {
                    return _ref.apply(this, arguments);
                  };
                }(), {
                  connection: this.connection
                }));

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function renameColumn(_x6, _x7) {
        return _renameColumn.apply(this, arguments);
      }

      return renameColumn;
    }()
  }, {
    key: "dropColumn",
    value: function () {
      var _dropColumn = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(columns) {
        var _this6 = this;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", this.client.transaction(function (trx) {
                  _this6.trx = trx;
                  return Promise.all(columns.map(function (column) {
                    return _this6.getColumn(column);
                  })).then(function () {
                    return _this6.getTableSql();
                  }).then(function (sql) {
                    var createTable = sql[0];
                    var newSql = createTable.sql;
                    columns.forEach(function (column) {
                      var a = _this6.client.wrapIdentifier(column);

                      newSql = _this6._doReplace(newSql, a, '');
                    });

                    if (sql === newSql) {
                      throw new Error('Unable to find the column to change');
                    }

                    var mappedColumns = Object.keys(_this6.client.postProcessResponse((0, _lodash.fromPairs)(columns.map(function (column) {
                      return [column, column];
                    }))));
                    return _this6.reinsertMapped(createTable, newSql, function (row) {
                      return _lodash.omit.apply(void 0, [row].concat((0, _toConsumableArray2["default"])(mappedColumns)));
                    });
                  });
                }, {
                  connection: this.connection
                }));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function dropColumn(_x9) {
        return _dropColumn.apply(this, arguments);
      }

      return dropColumn;
    }()
  }, {
    key: "reinsertMapped",
    value: function reinsertMapped(createTable, newSql, mapRow) {
      var _this7 = this;

      return Promise.resolve().then(function () {
        return _this7.createTempTable(createTable);
      }).then(function () {
        return _this7.copyData();
      }).then(function () {
        return _this7.dropOriginal();
      }).then(function () {
        return _this7.trx.raw(newSql);
      }).then(function () {
        return _this7.reinsertData(mapRow);
      }).then(function () {
        return _this7.dropTempTable();
      });
    }
  }]);
  return Firebird_DDL;
}();

var _default = Firebird_DDL;
exports["default"] = _default;