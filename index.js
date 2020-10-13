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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var ipfs = window.ipfs;

function ReactIPFSDropzone(props) {
  _react["default"].useEffect(function () {
    if (!ipfs && !window.ipfs) {
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
                  console.debug("=> IPFS Dropzone: IPFS node created");

                case 4:
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
    }
  }, [window.ipfs]);

  var onDrop = _react["default"].useCallback(function (files) {
    if (files && files.length > 0) {
      _async["default"].map(files, function (file, cb) {
        (0, _blobToBuffer["default"])(file, function (err, buff) {
          if (err) return cb(err);
          ipfs.add(buff).then(function (results) {
            console.debug("=> IPFS Dropzone added: ", results.cid.string);
            cb(null, {
              name: file.name,
              cid: results.cid.string
            });
          });
        });
      }, function (err, results) {
        if (err) return console.error("=> IPFS Dropzone: IPFS Upload Error: ", err);
        props.onLoad(results);
      });
    }
  }, []);

  var dropzoneRef = /*#__PURE__*/_react["default"].createRef();

  return /*#__PURE__*/_react["default"].createElement(_reactDropzone["default"], {
    ref: dropzoneRef,
    onDrop: onDrop
  }, function (_ref2) {
    var getRootProps = _ref2.getRootProps,
        getInputProps = _ref2.getInputProps;
    return /*#__PURE__*/_react["default"].createElement("div", _extends({
      className: "react-ipfs-dropzone"
    }, getRootProps(), props), /*#__PURE__*/_react["default"].createElement("input", getInputProps()), props.loadBody ? props.loadBody(isDragActive) : "Drop files here");
  });
}
