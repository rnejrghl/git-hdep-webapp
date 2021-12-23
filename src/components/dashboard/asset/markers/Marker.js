import React from 'react';
import { CustomIcon } from '@/components/commons';

function Marker(props) {
  return (
    <div className="marker" style={{ width: 45, height: 60, margin: '-30px 0 0 -22.5px' }}>
      <CustomIcon type={require('@/assets/marker.svg')} style={{ width: 45, height: 60 }} className={`marker-${props.points[0].eqmtStatus}`} />
      <CustomIcon type={require('@/assets/pv.svg')} className="marker-label" />
    </div>
  );
}

export default Marker;
