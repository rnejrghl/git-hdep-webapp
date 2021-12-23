import React, { forwardRef, useState, useCallback } from 'react';
import Geocode from 'react-geocode';

import { Input, Button, Modal, List } from 'antd';
import { googleApi } from '../../../../package.json';
import { locale, service } from '@/configs';

const lang = service.getValue(locale, 'languages', {});
const { Search } = Input;

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(googleApi.geocoding);

// set response language. Defaults to english.
Geocode.setLanguage(locale.ant.locale);

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion(locale.ant.locale);

const Address = forwardRef((props, ref) => {
  const { onSubmit } = props;
  const [visible, setvisible] = useState(false);
  const [results, setResults] = useState([]);

  const onOpenModal = useCallback(() => {
    setvisible(true);
  }, [setvisible]);

  const onCloseModal = useCallback(() => {
    setvisible(false);
  }, [setvisible]);

  const onSelect = useCallback(
    item => {
      onSubmit({
        events: 'address',
        payload: {
          addr: service.getValue(item, 'formatted_address', ''),
          ...service.getValue(item, 'geometry.location', {})
        }
      });
      setvisible(false);
    },
    [onSubmit]
  );

  const onSearch = useCallback(address => {
    Geocode.fromAddress(address).then(
      response => {
        if (response.status === 'OK') {
          setResults(service.getValue(response, 'results', []));
        } else {
          setResults([]);
        }
      },
      () => {
        setResults([]);
      }
    );
  }, []);

  return (
    <span ref={ref} type="flex" justify="space-between" align="middle" className="address-wrapper">
      <Button onClick={onOpenModal} type="primary" style={{ width: 60, minWidth: 60, textAlign: 'center', padding: 0 }}>
        Search
      </Button>

      <Modal forceRender centered destroyOnClose width="30%" maskClosable={false} visible={visible} title={service.getValue(lang, 'LANG00086', 'no-text')} onCancel={onCloseModal} wrapClassName="address-modal-wrapper" okButtonProps={{ style: { display: 'none' } }}>
        <div>
          <Search onSearch={onSearch} enterButton="Search" />
          <List
            bordered
            itemLayout="horizontal"
            dataSource={results}
            locale={{ emptyText: 'No Search Results' }}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button type="primary" onClick={() => onSelect(item)} size="small">
                    {service.getValue(lang, 'LANG00054', 'no-text')}
                  </Button>
                ]}
              >
                {service.getValue(item, 'formatted_address', '')}
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </span>
  );
});
export default Address;
