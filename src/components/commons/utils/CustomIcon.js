import React from 'react';
import 'antd-mobile/lib/icon/style/index.css';

function CustomIcon({ type, className = '', size = 'md', ...restProps }) {
  return (
    <svg className={`am-icon am-icon-${type.default.id} am-icon-${size} ${className}`} {...restProps}>
      <use xlinkHref={`#${type.default.id}`} />
    </svg>
  );
}

export default CustomIcon;
