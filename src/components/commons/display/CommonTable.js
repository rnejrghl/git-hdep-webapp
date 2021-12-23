import React, { useEffect, useState } from 'react';
import { Table, Select, Input, DatePicker, Checkbox } from 'antd';
import { service } from '@/configs';

const { Search } = Input;
const { Option } = Select;

const makeColumns = columns => {
  return columns.map(column => {
    if (column) {
      column.align = 'center';
    }

    if (column.children) {
      return {
        ...column,
        children: makeColumns(column.children)
      };
    }
    if (column.searchAble) {
      return {
        ...column,
        title: (
          <div>
            <p>{column.title}</p>
            <Search size="small" placeholder="Search" {...column.searchAble} onSearch={service.getValue(column.searchAble, 'onSearch', () => null)} />
          </div>
        )
      };
    }
    if (column.selectAble) {
      return {
        ...column,
        title: (
          <div key={column.key}>
            <p>{column.title}</p>
            <Select size="small" dropdownMatchSelectWidth={false} {...column.selectAble} onSelect={service.getValue(column.selectAble, 'onSelect', () => null)}>
              {service.getValue(column.selectAble, 'list', []).map((el, idx) => {
                return (
                  <Option key={service.getValue(el, 'key', idx)} value={el.value}>
                    {el.label}
                  </Option>
                );
              })}
            </Select>
          </div>
        )
      };
    }
    if (column.datepickAble) {
      return {
        ...column,
        title: (
          <div>
            <p>{column.title}</p>
            {column.datepickAble.reduce((result, obj, idx) => {
              result.push(
                <DatePicker
                  size="small"
                  {...obj}
                  placeholder={service.getValue(column, 'datepickAble.length', 1) > 1 ? (idx === 0 ? 'Start Date' : 'End Date') : 'Date'}
                  key={service.getValue(obj, 'key', idx)}
                  onChange={service.getValue(obj, 'onChange', () => null)}
                  style={{ width: column.datepickBlock ? '100%' : `calc(${100 / column.datepickAble.length}% - 8px)` }}
                />
              );
              if (idx === 0 && column.datepickAble.length === 2 && !column.datepickBlock) {
                result.push(' - ');
              }
              return result;
            }, [])}
          </div>
        )
      };
    }
    if (column.checkAble) {
      return {
        ...column,
        title: (
          <div>
            <p>{column.title}</p>
            <div>
              <Checkbox {...column.checkAble} onChange={event => column.checkAble.onChangeHeader(event)} />
            </div>
          </div>
        )
      };
    }
    return column;
  });
};

function CommonTable(props) {
  const { columns = [], dataSource = [], size = 'default', bordered = true, pagination = false, scroll = null, headerStyle = {}, ...restProps } = props;
  const [height, setHeight] = useState(482);

  useEffect(() => {
    const table = document.getElementsByClassName('common-table')[0];
    const { offsetTop } = table;
    setHeight(offsetTop + 207);
  }, []);

  return <Table {...restProps} columns={makeColumns(columns)} dataSource={dataSource} size={size} bordered={size === 'small' ? false : bordered} pagination={pagination} scroll={scroll || { x: 1400, y: `calc(100vh - ${height}px)` }} headerStyle={headerStyle} className="common-table" />;
}

export default CommonTable;
