import React from 'react';
import { withRouter } from 'react-router-dom';
import { Table, InputNumber, Input, Form, Button, Select, Checkbox } from 'antd';
import { service, locale } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

const EditableContext = React.createContext();

const { Search } = Input;

function getInput(type, options = []) {
  if (type === 'checkbox') {
    return <Checkbox />;
  }
  if (type === 'checkboxGroup') {
    return <Checkbox.Group options={options} />;
  }
  if (type === 'number') {
    return <InputNumber style={{ width: '100%' }} />;
  }
  if (type === 'select') {
    return (
      <Select style={{ width: '100%' }}>
        {options.map(option => {
          return (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          );
        })}
      </Select>
    );
  }
  return <Input width="80%" />;
}

const getInitiaValue = (type, record, dataIndex, options) => {
  switch (type) {
    case 'checkboxGroup':
      const newValue = options.filter(inner => service.getValue(record, `${inner.key}`, 'N') === 'Y');
      return newValue.map(item => item.value);
    case 'checkbox':
      return record[dataIndex] === 'Y';
    default:
      return record[dataIndex];
  }
};

function EditableCell(props) {
  function renderCell({ getFieldDecorator }) {
    const { editing, dataIndex, title, inputType, record, index, children, ...restProps } = props;
    return (
      <td {...restProps} style={{ padding: 10, textAlign: props.align || 'center' }}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(index ? `${index}.${dataIndex}` : dataIndex, {
              rules: [
                {
                  required: false,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: getInitiaValue(inputType, record, dataIndex, service.getValue(props, 'options', [])),
              valuePropName: inputType === 'checkbox' ? 'checked' : 'value'
            })(getInput(inputType, service.getValue(props, 'options', []), record))}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  }

  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editingKey: '',
      inputType: props.inputType || 'number',
      columns: []
    };
  }

  static getDerivedStateFromProps(props, state) {
    const propsEditLength = service.getValue(props, 'columns', []).filter(col => col.editing);
    const stateEditLength = state.columns.filter(col => col.editing);

    if (service.getValue(props, 'columns', []).length !== state.columns.length || propsEditLength !== stateEditLength) {
      return {
        columns: service.getValue(props, 'columns', []),
        data: service.getValue(props, 'dataSource', []).map((source, idx) => {
          return {
            ...source,
            key: idx
          };
        })
      };
    }

    if (service.getValue(props, 'dataSource', []).length !== state.data.length) {
      return {
        data: service.getValue(props, 'dataSource', []).map((source, idx) => {
          return {
            ...source,
            key: idx
          };
        }),
        columns: service.getValue(props, 'columns', [])
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.handler && this.props.handler !== prevProps.handler) {
      this.onSaveAll();
    }
  }

  onCancel = () => {
    this.setState({ editingKey: '' });
  };

  onSaveAll() {
    const { match, modeControll } = this.props;

    if (modeControll && service.getValue(match, 'params.mode', 'read') === 'update') {
      return this.props.onEvents({ method: 'submit', payload: { result: this.state.data } });
    }
    return this.props.form.validateFields((error, values) => {
      if (error) {
        return null;
      }
      const list = Object.keys(values).reduce((result, key, idx) => {
        result = result.concat({ ...service.getValue(this.state.data, `${idx}`, {}), ...values[key] });
        return result;
      }, []);
      return this.props.onEvents({ method: 'submit', payload: { result: list } });
    });
  }

  onSave(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return null;
      }

      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({ data: newData, editingKey: '' });
        return this.props.onEvents({ method: 'submit', payload: { ...newData[index], ...row } });
      }
      newData.push(row);
      this.setState({ data: newData, editingKey: '' });
      return this.props.onEvents({ method: 'submit', payload: row });
    });
    return null;
  }

  onRemove(record) {
    return this.props.onEvents({ method: 'remove', payload: record });
  }

  onEdit(key) {
    this.setState({ editingKey: key });
  }

  isEditing = record => {
    return record.key === this.state.editingKey;
  };

  render() {
    const { match } = this.props;

    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.state.columns.map(column => {
      if (column.dataIndex === 'action') {
        column.render = (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <Button type="primary" block style={{ height: '20px', fontSize: '10px', padding: '0 20px', lineHeight: '18px' }} onClick={() => this.onSave(form, record.key)}>
                    {service.getValue(lang, 'LANG00089', 'no-text')}
                  </Button>
                )}
              </EditableContext.Consumer>
              <Button type="default" block style={{ height: '20px', fontSize: '10px', padding: '0 20px', lineHeight: '18px', marginTop: 5 }} onClick={() => this.onCancel(record.key)}>
                {service.getValue(lang, 'LANG00069', 'no-text')}
              </Button>
            </span>
          ) : (
            <span>
              <Button type="primary" block className="deep-grey" style={{ height: '20px', fontSize: '10px', lineHeight: '18px', padding: '0 20px' }} disabled={editingKey !== ''} onClick={() => this.onEdit(record.key)}>
                {service.getValue(lang, 'LANG00208', 'no-text')}
              </Button>
              {this.props.addRemove ? (
                <Button type="danger" block style={{ height: '20px', fontSize: '10px', padding: '0 20px', lineHeight: '18px', marginTop: 5 }} onClick={() => this.onRemove(record)}>
                  {service.getValue(lang, 'LANG00068', 'no-text')}
                </Button>
              ) : null}
            </span>
          );
        };
      }

      // parent에서 column의 editable 속성을 통제할때
      if (this.props.editableAll) {
        if (column.searchAble) {
          return {
            ...column,
            align: column.align || 'center',
            title: (
              <>
                <span>{column.title}</span>
                <Search size="small" placeholder="Search" {...column.searchAble} onSearch={service.getValue(column.searchAble, 'onSearch', () => null)} />
              </>
            )
          };
        }
        if (column.selectAble) {
          return {
            ...column,
            align: column.align || 'center',
            title: (
              <>
                <span>{column.title}</span>
                <Select size="small" dropdownMatchSelectWidth={false} {...column.selectAble} onSelect={service.getValue(column.selectAble, 'onSelect', () => null)}>
                  {service.getValue(column.selectAble, 'list', []).map((el, idx) => {
                    return (
                      <Select.Option key={service.getValue(el, 'key', idx)} value={el.value}>
                        {el.label}
                      </Select.Option>
                    );
                  })}
                </Select>
              </>
            )
          };
        }
        return {
          ...column,
          align: column.align || 'center'
        };
      }

      if (!column.editable) {
        if (column.searchAble) {
          return {
            ...column,
            align: column.align || 'center',
            title: (
              <>
                <span>{column.title}</span>
                <Search size="small" placeholder="Search" {...column.searchAble} onSearch={service.getValue(column.searchAble, 'onSearch', () => null)} />
              </>
            )
          };
        }
        return {
          ...column,
          align: column.align || 'center'
        };
      }

      if (column.searchAble) {
        return {
          ...column,
          align: column.align || 'center',
          onCell: record => ({
            record,
            inputType: column.inputType || this.state.inputType,
            dataIndex: column.dataIndex,
            title: column.title,
            editing: this.isEditing(record)
          }),
          title: (
            <>
              <span>{column.title}</span>
              <Search size="small" placeholder="Search" {...column.searchAble} onSearch={service.getValue(column.searchAble, 'onSearch', () => null)} />
            </>
          )
        };
      }

      return {
        ...column,
        align: column.align || 'center',
        onCell: record => ({
          record,
          inputType: column.inputType || this.state.inputType,
          dataIndex: column.dataIndex,
          title: column.title,
          editing: this.isEditing(record)
        })
      };
    });

    const component =
      this.props.components && service.getValue(match, 'params.mode', 'read') === 'update'
        ? {
            body: {
              ...this.props.components.body,
              ...components.body
            }
          }
        : components;

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={component}
          bordered={this.props.bordered || true}
          size={this.props.size || 'middle'}
          dataSource={this.state.data}
          columns={columns}
          pagination={false}
          scroll={this.props.scroll || {}}
          className="common-table"
          onRow={this.props.onRow && service.getValue(match, 'params.mode', 'read') === 'update' ? this.props.onRow : null}
        />
      </EditableContext.Provider>
    );
  }
}

export default withRouter(Form.create()(EditableTable));
