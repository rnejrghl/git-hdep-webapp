import React, { Component } from 'react';
import { Input, Modal, Form } from 'antd';

import { Fetcher, service, locale } from '@/configs';
import { Spinner } from '@/components/commons';
import { api } from '../configs';

const { Search } = Input;
const lang = service.getValue(locale, 'languages', {});

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.onSearch = this.onSearch.bind(this);
  }

  onError = () => {
    return Modal.error({
      title: service.getValue(lang, 'LANG00296', 'no-text'),
      content: service.getValue(lang, 'LANG00030', 'no-text'),
      onOk: () => {
        this.props.form.resetFields();
        this.searchInput.focus();
      }
    });
  };

  onSearch = value => {
    if (!value) {
      if (this.props.map.getZoom() !== 5) {
        this.props.map.setZoom(5);
        this.props.map.setCenter({ lat: -25.274398, lng: 133.775136 });
      }
      return null;
    }

    const obj = api.getSearchSite({ userName: value });
    this.setState(
      {
        loading: true
      },
      () => {
        return Fetcher.get(obj.url, obj.params).then(result => {
          this.setState({
            loading: false
          });
          if (service.getValue(result, 'success', false)) {
            const site = service.getValue(result, 'data.operationsList.0', null);
            if (site) {
              this.props.map.setCenter({ lat: Number(site.latd), lng: Number(site.lgtd) });
              this.props.map.setZoom(17);
              return this.props.onSearched(site);
            }
            return this.onError();
          }
          return this.onError();
        });
      }
    );
    return null;
  };

  render() {
    const { loading } = this.state;
    return (
      <>
        <Form className="dashboard-assets-search" colon={false} labelCol={{ span: 0 }}>
          <Form.Item>
            {this.props.form.getFieldDecorator(
              'userName',
              {}
            )(
              <Search
                ref={ref => {
                  this.searchInput = ref;
                }}
                onSearch={this.onSearch}
                loading={loading}
                placeholder="Search"
              />
            )}
          </Form.Item>
        </Form>
        {loading && <Spinner tip="searching" style={{ zIndex: 1 }} size="large" />}
      </>
    );
  }
}

export default Form.create()(SearchBox);
