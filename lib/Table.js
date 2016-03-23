'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TableRow = require('./TableRow');

var _TableRow2 = _interopRequireDefault(_TableRow);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var Table = _react2['default'].createClass({
  displayName: 'Table',

  propTypes: {
    data: _react2['default'].PropTypes.array,
    expandIconAsCell: _react2['default'].PropTypes.bool,
    expandedRowKeys: _react2['default'].PropTypes.array,
    defaultExpandedRowKeys: _react2['default'].PropTypes.array,
    useFixedHeader: _react2['default'].PropTypes.bool,
    columns: _react2['default'].PropTypes.array,
    prefixCls: _react2['default'].PropTypes.string,
    bodyStyle: _react2['default'].PropTypes.object,
    style: _react2['default'].PropTypes.object,
    rowKey: _react2['default'].PropTypes.func,
    rowClassName: _react2['default'].PropTypes.func,
    expandedRowClassName: _react2['default'].PropTypes.func,
    childrenColumnName: _react2['default'].PropTypes.string,
    onExpandedRowsChange: _react2['default'].PropTypes.func,
    indentSize: _react2['default'].PropTypes.number,
    onRowClick: _react2['default'].PropTypes.func,
    columnsPageRange: _react2['default'].PropTypes.array,
    columnsPageSize: _react2['default'].PropTypes.number,
    expandIconColumnIndex: _react2['default'].PropTypes.number,
    showHeader: _react2['default'].PropTypes.bool,
    footer: _react2['default'].PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      data: [],
      useFixedHeader: false,
      expandIconAsCell: false,
      columns: [],
      defaultExpandedRowKeys: [],
      rowKey: function rowKey(o) {
        return o.key;
      },
      rowClassName: function rowClassName() {
        return '';
      },
      expandedRowClassName: function expandedRowClassName() {
        return '';
      },
      onExpandedRowsChange: function onExpandedRowsChange() {},
      prefixCls: 'rc-table',
      bodyStyle: {},
      style: {},
      childrenColumnName: 'children',
      indentSize: 15,
      columnsPageSize: 5,
      expandIconColumnIndex: 0,
      showHeader: true
    };
  },

  getInitialState: function getInitialState() {
    var props = this.props;
    return {
      expandedRowKeys: props.expandedRowKeys || props.defaultExpandedRowKeys,
      data: this.props.data,
      currentColumnsPage: 0
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.setState({
        data: nextProps.data
      });
    }
    if ('expandedRowKeys' in nextProps) {
      this.setState({
        expandedRowKeys: nextProps.expandedRowKeys
      });
    }
  },

  onExpandedRowsChange: function onExpandedRowsChange(expandedRowKeys) {
    if (!this.props.expandedRowKeys) {
      this.setState({
        expandedRowKeys: expandedRowKeys
      });
    }
    this.props.onExpandedRowsChange(expandedRowKeys);
  },

  onExpanded: function onExpanded(expanded, record) {
    var info = this.findExpandedRow(record);
    if (info && !expanded) {
      this.onRowDestroy(record);
    } else if (!info && expanded) {
      var expandedRows = this.getExpandedRows().concat();
      expandedRows.push(this.props.rowKey(record));
      this.onExpandedRowsChange(expandedRows);
    }
  },

  onRowDestroy: function onRowDestroy(record) {
    var expandedRows = this.getExpandedRows().concat();
    var rowKey = this.props.rowKey(record);
    var index = -1;
    expandedRows.forEach(function (r, i) {
      if (r === rowKey) {
        index = i;
      }
    });
    if (index !== -1) {
      expandedRows.splice(index, 1);
    }
    this.onExpandedRowsChange(expandedRows);
  },

  getExpandedRows: function getExpandedRows() {
    return this.props.expandedRowKeys || this.state.expandedRowKeys;
  },

  getThs: function getThs() {
    var ths = [];
    if (this.props.expandIconAsCell) {
      ths.push({
        key: 'rc-table-expandIconAsCell',
        className: this.props.prefixCls + '-expand-icon-th',
        title: ''
      });
    }
    ths = ths.concat(this.getCurrentColumns());
    return ths.map(function (c) {
      if (c.colSpan !== 0) {
        return _react2['default'].createElement(
          'th',
          { key: c.key, colSpan: c.colSpan, className: c.className || '' },
          c.title
        );
      }
    });
  },

  getExpandedRow: function getExpandedRow(key, content, visible, className) {
    var prefixCls = this.props.prefixCls;
    return _react2['default'].createElement(
      'tr',
      { key: key + '-extra-row', style: { display: visible ? '' : 'none' }, className: prefixCls + '-expanded-row ' + className },
      this.props.expandIconAsCell ? _react2['default'].createElement('td', { key: 'rc-table-expand-icon-placeholder' }) : '',
      _react2['default'].createElement(
        'td',
        { colSpan: this.props.columns.length },
        content
      )
    );
  },

  getRowsByData: function getRowsByData(data, visible, indent) {
    var props = this.props;
    var columns = this.getCurrentColumns();
    var childrenColumnName = props.childrenColumnName;
    var expandedRowRender = props.expandedRowRender;
    var expandIconAsCell = props.expandIconAsCell;
    var rst = [];
    var keyFn = props.rowKey;
    var rowClassName = props.rowClassName;
    var expandedRowClassName = props.expandedRowClassName;
    var needIndentSpaced = props.data.some(function (record) {
      return record[childrenColumnName] && record[childrenColumnName].length > 0;
    });
    var onRowClick = props.onRowClick;
    var expandIconColumnIndex = props.expandIconColumnIndex;

    for (var i = 0; i < data.length; i++) {
      var record = data[i];
      var key = keyFn ? keyFn(record, i) : undefined;
      var childrenColumn = record[childrenColumnName];
      var isRowExpanded = this.isRowExpanded(record);
      var expandedRowContent = undefined;
      if (expandedRowRender && isRowExpanded) {
        expandedRowContent = expandedRowRender(record, i);
      }
      var className = rowClassName(record, i);
      rst.push(_react2['default'].createElement(_TableRow2['default'], {
        indent: indent,
        indentSize: props.indentSize,
        needIndentSpaced: needIndentSpaced,
        className: className,
        record: record,
        expandIconAsCell: expandIconAsCell,
        onDestroy: this.onRowDestroy,
        index: i,
        visible: visible,
        onExpand: this.onExpanded,
        expandable: childrenColumn || expandedRowRender,
        expanded: isRowExpanded,
        prefixCls: props.prefixCls + '-row',
        childrenColumnName: childrenColumnName,
        columns: columns,
        expandIconColumnIndex: expandIconColumnIndex,
        onRowClick: onRowClick,
        key: key }));

      var subVisible = visible && isRowExpanded;

      if (expandedRowContent && isRowExpanded) {
        rst.push(this.getExpandedRow(key, expandedRowContent, subVisible, expandedRowClassName(record, i)));
      }
      if (childrenColumn) {
        rst = rst.concat(this.getRowsByData(childrenColumn, subVisible, indent + 1));
      }
    }
    return rst;
  },

  getRows: function getRows() {
    return this.getRowsByData(this.state.data, true, 0);
  },

  getColGroup: function getColGroup() {
    var cols = [];
    if (this.props.expandIconAsCell) {
      cols.push(_react2['default'].createElement('col', { className: this.props.prefixCls + '-expand-icon-col', key: 'rc-table-expand-icon-col' }));
    }
    cols = cols.concat(this.props.columns.map(function (c) {
      return _react2['default'].createElement('col', { key: c.key, style: { width: c.width } });
    }));
    return _react2['default'].createElement(
      'colgroup',
      null,
      cols
    );
  },

  getCurrentColumns: function getCurrentColumns() {
    var _this = this;

    var _props = this.props;
    var columns = _props.columns;
    var columnsPageRange = _props.columnsPageRange;
    var columnsPageSize = _props.columnsPageSize;
    var prefixCls = _props.prefixCls;
    var currentColumnsPage = this.state.currentColumnsPage;

    if (!columnsPageRange || columnsPageRange[0] > columnsPageRange[1]) {
      return columns;
    }
    return columns.map(function (column, i) {
      var newColumn = (0, _objectAssign2['default'])({}, column);
      if (i >= columnsPageRange[0] && i <= columnsPageRange[1]) {
        var pageIndexStart = columnsPageRange[0] + currentColumnsPage * columnsPageSize;
        var pageIndexEnd = columnsPageRange[0] + (currentColumnsPage + 1) * columnsPageSize - 1;
        if (pageIndexEnd > columnsPageRange[1]) {
          pageIndexEnd = columnsPageRange[1];
        }
        if (i < pageIndexStart || i > pageIndexEnd) {
          newColumn.className = newColumn.className || '';
          newColumn.className += ' ' + prefixCls + '-column-hidden';
        }
        newColumn = _this.wrapPageColumn(newColumn, i === pageIndexStart, i === pageIndexEnd);
      }
      return newColumn;
    });
  },

  getMaxColumnsPage: function getMaxColumnsPage() {
    var _props2 = this.props;
    var columnsPageRange = _props2.columnsPageRange;
    var columnsPageSize = _props2.columnsPageSize;

    return Math.floor((columnsPageRange[1] - columnsPageRange[0] - 1) / columnsPageSize);
  },

  goToColumnsPage: function goToColumnsPage(currentColumnsPage) {
    var maxColumnsPage = this.getMaxColumnsPage();
    var page = currentColumnsPage;
    if (page < 0) {
      page = 0;
    }
    if (page > maxColumnsPage) {
      page = maxColumnsPage;
    }
    this.setState({
      currentColumnsPage: page
    });
  },

  prevColumnsPage: function prevColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage - 1);
  },

  nextColumnsPage: function nextColumnsPage() {
    this.goToColumnsPage(this.state.currentColumnsPage + 1);
  },

  wrapPageColumn: function wrapPageColumn(column, hasPrev, hasNext) {
    var prefixCls = this.props.prefixCls;
    var currentColumnsPage = this.state.currentColumnsPage;

    var maxColumnsPage = this.getMaxColumnsPage();
    var prevHandlerCls = prefixCls + '-prev-columns-page';
    if (currentColumnsPage === 0) {
      prevHandlerCls += ' ' + prefixCls + '-prev-columns-page-disabled';
    }
    var prevHandler = _react2['default'].createElement('span', { className: prevHandlerCls, onClick: this.prevColumnsPage });
    var nextHandlerCls = prefixCls + '-next-columns-page';
    if (currentColumnsPage === maxColumnsPage) {
      nextHandlerCls += ' ' + prefixCls + '-next-columns-page-disabled';
    }
    var nextHandler = _react2['default'].createElement('span', { className: nextHandlerCls, onClick: this.nextColumnsPage });
    if (hasPrev) {
      column.title = _react2['default'].createElement(
        'span',
        null,
        prevHandler,
        column.title
      );
      column.className = (column.className || '') + (' ' + prefixCls + '-column-has-prev');
    }
    if (hasNext) {
      column.title = _react2['default'].createElement(
        'span',
        null,
        column.title,
        nextHandler
      );
      column.className = (column.className || '') + (' ' + prefixCls + '-column-has-next');
    }
    return column;
  },

  findExpandedRow: function findExpandedRow(record) {
    var keyFn = this.props.rowKey;
    var currentRowKey = keyFn(record);
    var rows = this.getExpandedRows().filter(function (i) {
      return i === currentRowKey;
    });
    return rows[0] || null;
  },

  isRowExpanded: function isRowExpanded(record) {
    return !!this.findExpandedRow(record);
  },

  render: function render() {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var columns = this.getThs();
    var rows = this.getRows();
    var className = props.prefixCls;
    if (props.className) {
      className += ' ' + props.className;
    }
    if (props.columnsPageRange) {
      className += ' ' + prefixCls + '-columns-paging';
    }
    var headerTable = undefined;
    var thead = props.showHeader ? _react2['default'].createElement(
      'thead',
      { className: prefixCls + '-thead' },
      _react2['default'].createElement(
        'tr',
        null,
        columns
      )
    ) : null;
    if (props.useFixedHeader) {
      headerTable = _react2['default'].createElement(
        'div',
        { className: prefixCls + '-header' },
        _react2['default'].createElement(
          'table',
          null,
          this.getColGroup(),
          thead
        )
      );
      thead = null;
    }
    return _react2['default'].createElement(
      'div',
      { className: className, style: props.style },
      headerTable,
      _react2['default'].createElement(
        'div',
        { className: prefixCls + '-body', style: props.bodyStyle },
        _react2['default'].createElement(
          'table',
          null,
          this.getColGroup(),
          thead,
          _react2['default'].createElement(
            'tbody',
            { className: prefixCls + '-tbody' },
            rows
          ),
          props.footer ? _react2['default'].createElement(
            'tfoot',
            { className: prefixCls + '-tfoot' },
            _react2['default'].createElement(
              'tr',
              null,
              _react2['default'].createElement(
                'td',
                { colSpan: '0' },
                props.footer(this.state.data)
              )
            )
          ) : null
        )
      )
    );
  }
});

exports['default'] = Table;
module.exports = exports['default'];