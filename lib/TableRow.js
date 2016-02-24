'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var TableRow = _react2['default'].createClass({
  displayName: 'TableRow',

  propTypes: {
    onDestroy: _react2['default'].PropTypes.func,
    record: _react2['default'].PropTypes.object,
    prefixCls: _react2['default'].PropTypes.string
  },

  componentWillUnmount: function componentWillUnmount() {
    this.props.onDestroy(this.props.record);
  },

  render: function render() {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var columns = props.columns;
    var record = props.record;
    var index = props.index;
    var cells = [];
    var expanded = props.expanded;
    var expandable = props.expandable;
    var expandIconAsCell = props.expandIconAsCell;
    var indent = props.indent;
    var indentSize = props.indentSize;
    var needIndentSpaced = props.needIndentSpaced;
    var onRowClick = props.onRowClick;

    for (var i = 0; i < columns.length; i++) {
      var col = columns[i];
      var colClassName = col.className || '';
      var render = col.render;
      var text = record[col.dataIndex];

      var expandIcon = null;
      var tdProps = undefined;
      var colSpan = undefined;
      var rowSpan = undefined;
      var notRender = false;
      var indentText = undefined;

      if (i === 0 && expandable) {
        expandIcon = _react2['default'].createElement('span', {
          className: prefixCls + '-expand-icon ' + prefixCls + '-' + (expanded ? 'expanded' : 'collapsed'),
          onClick: props.onExpand.bind(null, !expanded, record) });
      } else if (i === 0 && needIndentSpaced) {
        expandIcon = _react2['default'].createElement('span', {
          className: prefixCls + '-expand-icon ' + prefixCls + '-spaced' });
      }

      if (expandIconAsCell && i === 0) {
        cells.push(_react2['default'].createElement(
          'td',
          { className: prefixCls + '-expand-icon-cell',
            key: 'rc-table-expand-icon-cell' },
          expandIcon
        ));
        expandIcon = null;
      }

      if (render) {
        text = render(text, record, index) || {};
        tdProps = text.props || {};

        if (typeof text !== 'string' && !_react2['default'].isValidElement(text) && 'children' in text) {
          text = text.children;
        }
        rowSpan = tdProps.rowSpan;
        colSpan = tdProps.colSpan;
      }

      if (rowSpan === 0 || colSpan === 0) {
        notRender = true;
      }

      indentText = i === 0 ? _react2['default'].createElement('span', { style: { paddingLeft: indentSize * indent + 'px' }, className: prefixCls + '-indent indent-level-' + indent }) : null;

      if (!notRender) {
        cells.push(_react2['default'].createElement(
          'td',
          { key: col.key, colSpan: colSpan, rowSpan: rowSpan, className: '' + colClassName },
          indentText,
          expandIcon,
          text
        ));
      }
    }
    return _react2['default'].createElement(
      'tr',
      { onClick: onRowClick ? onRowClick.bind(null, record, index) : null, className: prefixCls + ' ' + props.className, style: { display: props.visible ? '' : 'none' } },
      cells
    );
  }
});

exports['default'] = TableRow;
module.exports = exports['default'];