const timeFormat = {
  FULLDATE: 'YYYY-MM-DD',
  FULLTIME: 'HH:mm:ss',
  TIME_MIN: 'HH:mm',
  TIME_HOUR: 'HH',
  YEAR: 'YYYY',
  MONTH: 'MM',
  YEARDASHMONTH: 'YYYY-MM',
  YEARMONTH: 'YYYYMM',
  YEARMONTHDAY: 'YYYYMMDD',
  FULLDATEDOT: 'YYYY.MM.DD'
};

timeFormat.FULLDATETIME = `${timeFormat.FULLDATE} ${timeFormat.FULLTIME}`;
timeFormat.HALFDATETIME = `${timeFormat.FULLDATE} ${timeFormat.TIME_MIN}`;

export { timeFormat };
