import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, DatePicker, Row, Col, Upload, Button, Icon, Radio, Checkbox, Tooltip, Modal } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';

import { service, formats, upload, api, Fetcher, locale } from '@/configs';
import { ButtonWrap, Address } from '@/components/commons';

import PsidTable from './PsidTable';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const lang = service.getValue(locale, 'languages', {});

function CommonForm(props) {
  const { handler, form, onSubmit, style = {}, fields, formName, isReset = false } = props;
  const { getFieldDecorator, resetFields } = props.form;
  const buttons = service.getValue(props, 'buttons', {});
  const { left = [], right = [] } = buttons;
  const { menuId } = useParams();
  const [fileList, setFileList] = useState({});

  const [visible, setVisible] = useState(false);

  const onHandleSubmit = useCallback(() => {
    return form.validateFields((err, values) => {
      if (!err) {
        const obj = formName ? service.getValue(values, `${formName}`, {}) : values;
        const convertValue = Object.keys(obj).reduce((result, key) => {
          let newValue = obj[key];
          if (moment.isMoment(obj[key])) {
            newValue = moment(obj[key]).format(formats.timeFormat.YEARMONTHDAY);
          }
          if (Array.isArray(obj[key]) && obj[key].every(value => moment.isMoment(value))) {
            newValue = obj[key].map(value => moment(value).format(formats.timeFormat.YEARMONTHDAY));
          }
          if (service.getValue(newValue, 'event', false)) {
            newValue = fileList[`${key}`];
          }

          result[key] = newValue;

          return result;
        }, {});

        if (isReset) {
          resetFields();
        }

        return onSubmit({ method: 'submit', payload: formName ? { [formName]: convertValue } : convertValue });
      }
      return onSubmit({ method: 'error', payload: err });
    });
  }, [onSubmit, fileList, form, formName]);

  useEffect(() => {
    if (handler) {
      onHandleSubmit();
    }
  }, [handler, onHandleSubmit]);

  useEffect(() => {
    resetFields();
  }, [menuId, resetFields]);

  useEffect(() => {
    const mappingFileList = () => {
      const newFileList = fields.reduce((result, field) => {
        if (field.type === 'upload') {
          result[field.key] = service.getValue(field, 'initialValue', []);
        }
        return result;
      }, {});
      setFileList(newFileList);
    };
    mappingFileList();
    return () => {
      setFileList({});
    };
  }, [fields, setFileList]);

  const onSubmitAddress = (field, events) => {
    const { setFieldsValue } = props.form;
    const { payload = {} } = events;

    setFieldsValue({
      addr: service.getValue(payload, 'addr', null),
      latd: service.getValue(payload, 'lat', null),
      lgtd: service.getValue(payload, 'lng', null)
    });
  };

  const onHandler = (selectValue, field) => {
    const { value, target, options = [] } = field.onHandler;
    const { setFields } = form;
    const selected = options.filter(item => item[field.key] === selectValue).find(item => item);

    if (value === selectValue) {
      target.forEach(item => {
        setFields({
          [item]: {
            value: null
          }
        });
      });
    } else {
      target.forEach(inner => {
        setFields({
          [inner]: {
            value: service.getValue(selected, `${inner}`, null)
          }
        });
      });
    }
    return field.onChange && field.onChange(selectValue);
  };

  const onRemoveFile = (file, key) => {
    const obj = api.deleteFile(file.fileSeq);
    return Fetcher.postQuery(obj.url, obj.params).then(({ success }) => {
      if (success) {
        setFileList(state => {
          return {
            ...state,
            [key]: service.getValue(state, `${key}`, []).filter(item => item.fileSeq !== file.fileSeq)
          };
        });
      }
    });
  };

  const onChangeFile = useCallback(
    (info, key, field) => {
      const newFileList = service.getValue(field, 'props.only', false) ? info.fileList.slice(-1) : info.fileList;
      setFileList(state => {
        return {
          ...state,
          [key]: newFileList
        };
      });
    },
    [setFileList]
  );

  const onSuccessFile = useCallback(
    (response, file, key) => {
      if (service.getValue(response, 'success', false)) {
        setFileList(state => {
          const newItem = service
            .getValue(state, `${key}`, [])
            .filter(item => item.uid === file.uid)
            .map(item => {
              return {
                ...item,
                ...service.getValue(response, 'data.0', {}),
                status: 'done',
                url: service.getValue(response, 'data.0.filePath', ''),
                response: { status: 'success' }
              };
            })
            .find(item => item);
          const newFileList = service.getValue(state, `${key}`, []).filter(item => item.uid !== file.uid);
          return {
            ...state,
            [key]: [...newFileList, newItem]
          };
        });
      }
    },
    [setFileList]
  );

  function swichFormItem(field, formMode) {
    const defaultProps = {
      placeholder: field.placeholder,
      disabled: formMode === 'read',
      style: { ...field.style }
    };

    switch (field.type) {
      case 'checkbox':
        return <Checkbox.Group onChange={service.getValue(field, 'onChange', null)} options={field.options} {...defaultProps} {...field.props} />;
      case 'radio':
        return (
          <Radio.Group onChange={service.getValue(field, 'onChange', null)} {...defaultProps} {...field.props}>
            {field.options.map(option => {
              return (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              );
            })}
          </Radio.Group>
        );
      case 'input':
        return <Input {...defaultProps} {...field.props} />;
      case 'select':
        return (
          <Select onChange={service.getValue(field, 'onHandler', false) ? value => onHandler(value, field) : service.getValue(field, 'onChange', null)} {...defaultProps} {...field.props}>
            <Select.Option style={{ color: '#ddd' }} disabled value={null}>
              {service.getValue(lang, 'LANG00306', 'no-text')}
            </Select.Option>
            {field.options.map(option => {
              return (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              );
            })}
          </Select>
        );
      case 'datepicker':
        return <DatePicker onChange={service.getValue(field, 'onChange', null)} style={{ width: '100%' }} {...defaultProps} {...field.props} />;
      case 'rangepicker':
        return <RangePicker onChange={service.getValue(field, 'onChange', null)} style={{ width: '100%' }} {...defaultProps} {...field.props} />;
      case 'textarea':
        return <TextArea onChange={service.getValue(field, 'onChange', null)} {...defaultProps} {...field.props} />;
      case 'excelUpload':
        return (
          <Upload
            onSuccess={(res, file) => onSuccessFile(res, file, `${field.key}`)}
            onChange={file => onChangeFile(file, `${field.key}`, field)}
            onRemove={file => onRemoveFile(file, `${field.key}`)}
            fileList={service.getValue(fileList, `${field.key}`, [])}
            multiple
            {...defaultProps}
            {...field.props}
          >
            <Button>
              <Icon type="upload" /> Upload
            </Button>
          </Upload>
        );
      case 'upload':
        return (
          <Upload
            {...upload.getProps(service.getValue(fileList, `${field.key}`, []))}
            onSuccess={(res, file) => onSuccessFile(res, file, `${field.key}`)}
            onChange={file => onChangeFile(file, `${field.key}`, field)}
            onRemove={file => onRemoveFile(file, `${field.key}`)}
            fileList={service.getValue(fileList, `${field.key}`, [])}
            multiple
            {...defaultProps}
            {...field.props}
          >
            {service.getValue(field, 'props.listType', false) ? (
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
              </div>
            ) : (
              <Button type="primary">
                {' '}
                <Icon type="upload" /> Upload
              </Button>
            )}
          </Upload>
        );
      case 'tooltip':
        const tooltip = service.getValue(field, 'initialValue', '');
        if (tooltip === '') {
          return <Input {...defaultProps} {...field.props} />;
        }

        const inputOption = {
          ...field.props,
          value: service.getValue(field, 'initialValue', '')
        };

        const title = (
          <Row>
            <Col>{tooltip}</Col>
          </Row>
        );

        return (
          <>
            <Tooltip title={title} placement="topLeft">
              <Col>
                <Input {...defaultProps} {...inputOption} />
              </Col>
            </Tooltip>
          </>
        );
      case 'button':
        return <Button onClick={onPsfindModel}>찾기</Button>;

      case 'label':
        return <div></div>;
      default:
        return <div>CommonForm에 type을 추가하세요</div>;
    }
  }

  //psId 모델창 Open
  const onPsfindModel = () => {
    setVisible(true);
  };

  //psId 모델창 닫음
  const onCloseModal = () => {
    setVisible(false);
  };

  // onSubmitPsId 자식창으로 넘겨 psId를 받아와 "psId" 컬럼에 set해준다
  const onSubmitPsId = psId => {
    const { setFieldsValue } = props.form;
    setFieldsValue({
      psId: psId
    });
  };

  return (
    <Row type="flex" justify="start" align="stretch" style={{ ...style, height: '100%' }} className={`common-form-wrapper `.concat(props.className)}>
      {service.getValue(buttons, 'position', '') === 'top' && (
        <Col span={24} style={{ alignSelf: 'flex-start' }}>
          <ButtonWrap left={left} right={right} onEvents={onHandleSubmit} />
        </Col>
      )}
      <Col span={24}>
        <Form {...props.formLayout} layout={props.layout} colon={props.colon} hideRequiredMark={props.hideRequiredMark} labelAlign={props.labelAlign}>
          <Row type="flex" justify="space-between" align="top" gutter={8}>
            {fields.map(field => {
              const col = field.columns || props.columns;
              return (
                <Col key={field.key} span={parseInt(24 / col, 10)}>
                  <Form.Item
                    {...field.formLayout}
                    label={field.label}
                    extra={service.getValue(field, 'extra', null)}
                    style={{
                      width: field.key === 'addr' && service.getValue(field, 'geocode', false) ? 'calc(100% - 70px)' : '100%',
                      display: field.key === 'addr' && service.getValue(field, 'geocode', false) ? 'inline-block' : 'block'
                    }}
                  >
                    {getFieldDecorator(props.formName ? `${props.formName}.${field.key}` : `${field.key}`, {
                      rules: service.getValue(field, 'rules', []),
                      initialValue: field.initialValue
                    })(swichFormItem(field, props.formMode))}
                  </Form.Item>
                  {field.key === 'addr' && service.getValue(field, 'geocode', false) ? <Address onSubmit={events => onSubmitAddress(field, events)} /> : null}
                </Col>
              );
            })}

            {service.getValue(buttons, 'position', '') === 'right' && (
              <Col style={{ alignSelf: 'flex-end' }}>
                <ButtonWrap left={left} right={right} onEvents={onHandleSubmit} />
              </Col>
            )}
          </Row>
        </Form>
      </Col>
      {service.getValue(buttons, 'position', '') === 'bottom' && (
        <Col span={24} style={{ alignSelf: 'flex-end' }}>
          <ButtonWrap left={left} right={right} onEvents={onHandleSubmit} />
        </Col>
      )}

      <Modal forceRender destroyOnClose centered visible={visible} title={service.getValue(lang, 'ㅇㅇㅇ', 'ps_id찾기')} onCancel={onCloseModal} okButtonProps={{ style: { display: 'none' } }} cancelButtonProps={{ style: { display: 'none' } }} width="847px" height="300px">
        <PsidTable onSubmitPsId={onSubmitPsId} onCancel={onCloseModal}></PsidTable>
      </Modal>
    </Row>
  );
}

CommonForm.propTypes = {
  fields: PropTypes.arrayOf(() => {
    return {
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
      style: PropTypes.object,
      formLayout: PropTypes.shape({
        labelCol: PropTypes.object,
        wrapperCol: PropTypes.object
      }),
      rules: PropTypes.array,
      columns: PropTypes.number,
      props: PropTypes.object
    };
  }),
  formMode: PropTypes.oneOf(['read', 'create', 'update']),
  layout: PropTypes.string,
  colon: PropTypes.bool,
  hideRequiredMark: PropTypes.bool,
  labelAlign: PropTypes.oneOf(['left', 'right']),
  formLayout: PropTypes.shape({
    labelCol: PropTypes.object,
    wrapperCol: PropTypes.object
  }),
  buttons: PropTypes.shape({
    position: PropTypes.oneOf(['top', 'bottom', 'right']),
    left: PropTypes.array,
    right: PropTypes.array
  }),
  formName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  columns: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
  tooltips: PropTypes.object
};

CommonForm.defaultProps = {
  fields: [],
  formMode: 'create',
  layout: 'horizontal',
  colon: false,
  hideRequiredMark: false,
  labelAlign: 'right',
  formLayout: {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  },
  className: '',
  formName: false,
  buttons: {},
  columns: 1,
  style: {}
};

export default Form.create()(CommonForm);
