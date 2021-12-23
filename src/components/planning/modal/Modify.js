import React, { useState, useCallback, useMemo } from 'react';
import { Row, Col, Tag, Button, Icon } from 'antd';

import { CommonForm } from '@/components/commons';

import { service, locale } from '@/configs';

const lang = service.getValue(locale, 'languages', {});

function Modify(props) {
  const { message, checkedList, fields = [], type, description = null, handler, onEvents } = props;
  const [tags, setTags] = useState(checkedList.sort());

  const onRemoveTag = value => {
    const newTags = tags.filter(tag => tag !== value);
    setTags(newTags);
  };

  const makeTags = () => {
    return tags.map(tag => (
      <Tag key={tag} closable onClose={() => onRemoveTag(tag)}>
        {tag}
      </Tag>
    ));
  };

  const onSubmit = useCallback(
    events => {
      return onEvents({ method: `${type}`, payload: { ...events.payload } });
    },
    [onEvents, type]
  );

  const renderForm = useCallback(
    (fieldList = []) => {
      if (!service.getValue(fieldList, 'length', false)) {
        return null;
      }
      return (
        <Col>
          <CommonForm handler={handler} fields={fieldList} labelAlign="left" onSubmit={onSubmit} />
        </Col>
      );
    },
    [handler, onSubmit]
  );

  const getFields = useCallback(
    itemType => {
      if (itemType === 'file') {
        return fields.map(field => {
          return {
            ...field,
            extra: (
              <span className="text">
                <Icon type="download" /> {service.getValue(lang, 'LANG00077', 'no-text')} :{' '}
                <Button type="link" href="https://auvppdev-ap-southeast-2.s3-ap-southeast-2.amazonaws.com/Monthly_Target_Registration_Form.xlsx">
                  Monthly Target Registration Form.xlsx
                </Button>
              </span>
            )
          };
        });
      }
      return fields;
    },
    [fields]
  );

  const newFields = useMemo(() => getFields(type), [type, getFields]);

  return (
    <Row className="planning-modify">
      <Col>{message}</Col>
      <Col className="tag-wrapper">{makeTags()}</Col>

      <Col>{description}</Col>
      {renderForm(newFields)}
    </Row>
  );
}

export default Modify;
