import locale from './locale';
import service from './service';

const lang = service.getValue(locale, 'languages', {});

const detailData = {
  temp1: '123.45 kWp',
  temp2: '한화큐셀DKFJODKF',
  temp3: '12',
  temp4: '123.45 kWh',
  temp5: 'LG DKFJODKF',
  temp6: 12,
  temp7: 'AUS',
  temp8: 'LG DKFJODKF'
};

const detailKPIData = new Array(5).fill({}).map((_, idx) => {
  return {
    key: idx,
    day: '2020/12/12',
    kwh: {
      prev: 434.11,
      goal: 485.55,
      perform: 100.1
    },
    ppa: {
      prev: 528.59,
      goal: 773.02,
      perform: 729.92
    },
    export: {
      prev: 637.24,
      perform: 925.81
    },
    pr: {
      prev: 165.91,
      goal: 230.77,
      perform: 190.54
    },
    irr: {
      prev: 253.95,
      perform: 292.17
    }
  };
});

const notificationData = new Array(10).fill({}).map((_, idx) => {
  return {
    key: idx,
    notiDt: '2020/12/01 12:34',
    status: idx === 0 ? service.getValue(lang, 'LANG00004', 'no-text') : service.getValue(lang, 'LANG00005', 'no-text'),
    content: 'Network Error',
    unlockDt: '2020/12/01 12:34'
  };
});

export { detailData, detailKPIData, notificationData };
