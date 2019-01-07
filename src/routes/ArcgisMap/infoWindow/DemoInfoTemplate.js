import React, { PureComponent } from 'react';
import { List } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import TrueMap from './Template/TrueMap';
import DeviceInfo from './Template/DeviceInfo';
import SimpleInfo from './Template/SimpleInfo';
import WarnInfo from './Template/WarnInfo';

const mapStateToProps = ({ map }) => {
  const { infoWindow } = map;
  return {
    infoWindow,
  };
};
const DemoInfoTemplate = ({ infoWindow }) => {
  function* entries(obj) {
    for (const key of Object.keys(obj)) {
      yield [key, obj[key]];
    }
  }

  const { show, style, arrowDirection, isPanning, type, attributes } = infoWindow;
  if (attributes) {
    const attributesArray = [];
    for (const [key, value] of entries(attributes)) {
      attributesArray.push({ key, value });
    }
  }
  const getTemPlate = (type) => {
    switch (type) {
      case 'trueMap': return <TrueMap />;
      case 'deviceInfo': return <DeviceInfo />;
      case 'simpleInfo': return <SimpleInfo attributes={attributes} />;
      case 'warnInfo': return <WarnInfo />;
      default: return null;
    }
  };

  return (
    show ? (
      getTemPlate(type)
    ) : null
  );
};
export default connect(mapStateToProps)(DemoInfoTemplate);
