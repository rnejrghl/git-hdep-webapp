import React from 'react';
import { Statistic } from 'antd';
import styled from 'styled-components';
import { Summary as CommonSummary } from '@/components/commons';

import { service } from '@/configs';
import { values } from '../configs';

const StyledStatistic = styled(Statistic)`
  .ant-statistic-title {
    color: ${styleProps => styleProps.theme.white};
    font-size: 1.25rem;
  }
  .ant-statistic-content {
    &-value {
      color: ${styleProps => styleProps.color};
    }
  }
`;

const StyledSpan = styled.span`
  display: inline-block;
  font-size: 60px;
  line-height: 66px;
  flex: 1 1 auto;
  font-family: 'FontBold';
  text-align: center;
`;

const StyledSpanValue = styled(StyledSpan)`
  background: #202124;
  margin-right: ${styleProps => styleProps.right}px;
`;

const StyledWrap = styled.div`
  border-radius: 5px;
  background: ${styleProps => styleProps.theme.black};
  height: 78px;
  padding: 4px;
  margin-top: 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const makeData = dataSource => {
  return values.summaryValue.reduce((result, item) => {
    const newItem = {};
    newItem['children'] = (
      <StyledStatistic
        title={item.title}
        value={service.getValue(dataSource, `${item.dataIndex}`, 0)}
        formatter={() => {
          const value = service.getValue(dataSource, `${item.dataIndex}`, 0);
          const precision = `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return (
            <StyledWrap className="value-wrap">
              {precision.split('').map((val, inx) => {
                if (val === ',') {
                  return (
                    <StyledSpan className="precision" key={inx}>
                      {val}
                    </StyledSpan>
                  );
                }
                return (
                  <StyledSpanValue className="value" key={inx} right={precision.split('').length - 1 === inx ? 0 : 4}>
                    {val}
                  </StyledSpanValue>
                );
              })}
            </StyledWrap>
          );
        }}
        {...item}
      />
    );
    result.push(newItem);
    return result;
  }, []);
};

function Summary({ dataSource }) {
  return dataSource ? <CommonSummary data={makeData(dataSource)} /> : null;
}

export default Summary;
