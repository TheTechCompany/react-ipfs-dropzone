"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ReactIPFSDropzone;

var _react = _interopRequireDefault(require("react"));

var _ipfs = _interopRequireDefault(require("ipfs"));

var _blobToBuffer = _interopRequireDefault(require("blob-to-buffer"));

var _reactDropzone = _interopRequireDefault(require("react-dropzone"));

var _async = _interopRequireDefault(require("async"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ipfs = window.ipfs;

function ReactIPFSDropzone(props) {
  _react["default"].useEffect(function () {
    if (!ipfs && !window.ipfs && !props.ipfs) {
      var initIPFS = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _ipfs["default"].create();

                case 2:
                  ipfs = _context.sent;
                  window.ipfs = ipfs;
                  console.debug("=> IPFS Dropzone: IPFS node created");

                case 5:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function initIPFS() {
          return _ref.apply(this, arguments);
        };
      }();

      console.debug("=> IPFS Dropzone: Creating IPFS node");
      initIPFS();
    } else if (window.ipfs && !ipfs) {
      console.debug("=> IPFS Dropzone: Reusing open IPFS node");
      ipfs = window.ipfs;
    } else if (props.ipfs) {
      ipfs = props.ipfs;
      window.ipfs = ipfs;
    }
  }, [window.ipfs, props.ipfs]);

  var onDrop = _react["default"].useCallback(function (files) {
    if (files && files.length > 0) {
      if (props.onLoadStart) props.onLoadStart(files.map(function (x) {
        return parseName(x.name);
      }));

      _async["default"].map(files, function (file, cb) {
        (0, _blobToBuffer["default"])(file, function (err, buff) {
          if (err) return cb(err);
          ipfs.add(buff).then(function (results) {
            console.debug("=> IPFS Dropzone added: ", results.cid.string);

            var _file = parseName(file.name);

            cb(null, _objectSpread(_objectSpread({}, _file), {}, {
              cid: results.cid.string
            }));
          });
        });
      }, function (err, results) {
        if (err) return console.error("=> IPFS Dropzone: IPFS Upload Error: ", err);
        if (props.onLoad) props.onLoad(results);
      });
    }
  }, []);

  var parseName = function parseName(name) {
    var ext = name.match(/\.[^/.]+$/);
    var file = name.replace(/\.[^/.]+$/, "");
    return {
      ext: ext ? ext[0] : null,
      name: file
    };
  };

  var dropzoneRef = /*#__PURE__*/_react["default"].createRef();

  var rootProps = {
    onClick: function onClick(e) {
      if (props.dropOnly) e.stopPropagation();
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_reactDropzone["default"], {
    ref: dropzoneRef,
    onDrop: onDrop
  }, function (_ref2) {
    var getRootProps = _ref2.getRootProps,
        getInputProps = _ref2.getInputProps,
        isDragActive = _ref2.isDragActive;
    return /*#__PURE__*/_react["default"].createElement("div", _extends({
      className: "react-ipfs-dropzone"
    }, getRootProps(rootProps), props), /*#__PURE__*/_react["default"].createElement("input", getInputProps()), props.children ? props.children : "Drop files here");
  });
}
