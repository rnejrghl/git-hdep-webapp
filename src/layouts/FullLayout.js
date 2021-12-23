import React from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import UAParser from 'ua-parser-js';
import styled from 'styled-components';

import { Spinner } from '@/components/commons';
import { HeaderComponent, DrawerComponent, Footer } from '@/layouts';

// Header와 Footer를 갖고 있는 layout입니다. HOC
const { Content } = Layout;

// ua-parser
const parser = new UAParser();

// styled component
const StyledContent = styled(Content)`
  position: relative;
  background-color: #e8e8ee;
  min-height: ${styleProps => `calc(100vh - ${styleProps['data-roll'] ? '56' : '91'}px)`};
  height: ${styleProps => (styleProps['data-roll'] ? `calc(100vh - 56px)` : 'auto')};
`;

const mapStateToProps = ({ common }) => ({
  isLoading: common.isLoading
});

function UseFullLayout(WrappedComponent) {
  return connect(
    mapStateToProps,
    null
  )(
    class extends React.Component {
      constructor(props) {
        super(props);
        this.onHandleDrawer = this.onHandleDrawer.bind(this);
        this.state = {
          visible: false,
          isMobile: parser.getDevice().type
        };
      }

      onHandleDrawer() {
        this.setState(prevState => {
          return { visible: !prevState.visible };
        });
      }

      render() {
        return (
          <Layout className={this.state.isMobile ? 'app mobileApp' : 'app webApp'}>
            <HeaderComponent onHandleDrawer={this.onHandleDrawer} visible={this.state.visible} isMobile={this.state.isMobile} />
            <StyledContent data-roll={this.state.isMobile}>
              {/* WrappedComponent는 반드시 Layout으로 wrapping되어야 하며, Layout.Content를 포함해야한다 */}
              <DrawerComponent onClose={this.onHandleDrawer} visible={this.state.visible} isMobile={this.state.isMobile} />
              <WrappedComponent {...this.props} />
            </StyledContent>

            {this.props.isLoading ? <Spinner tip="Loading" size="large" /> : null}
            {this.state.isMobile ? null : <Footer />}
          </Layout>
        );
      }
    }
  );
}

export default UseFullLayout;
