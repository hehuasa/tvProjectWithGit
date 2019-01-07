import React, { PureComponent } from 'react';
import { connect } from 'dva';
import EntranceGuardListOneLevel from './EntranceGuardListOneLevel';
// import EntranceGuardListTwoLevel from './EntranceGuardListTwoLevel';
import EntranceGuardListThreeLevel from './EntranceGuardListThreeLevel';
import { mapConstants } from '../../../../../services/mapConstant';

const { mainMap, mapView } = mapConstants;

class EntranceGuardListContent extends PureComponent {
  components = (key) => {
    switch (key) {
      case 'two': return <EntranceGuardListThreeLevel entranceGuard={this.props.entranceGuard} dispatch={this.props.dispatch} mainMap={mainMap} mapView={mapView} />;
      case 'one': return <EntranceGuardListOneLevel entranceGuard={this.props.entranceGuard} dispatch={this.props.dispatch} mainMap={mainMap} mapView={mapView} />;
      default: return <EntranceGuardListOneLevel entranceGuard={this.props.entranceGuard} dispatch={this.props.dispatch} mainMap={mainMap} mapView={mapView} />;
    }
  };

  render() {
    return (
      <div>
        {
          this.components(this.props.entranceGuard.toggleTable)
        }
      </div>
    );
  }
}

const getSelctData = (entranceGuard) => {
  if (entranceGuard.list) {
    for (const item of entranceGuard.list) {
      item.key = `${entranceGuard.areaOrDoor}&${Math.random()}`;
    }
  }
  return entranceGuard;
};

const mapStateToProps = (state) => {
  return {
    entranceGuard: getSelctData(state.entranceGuard),
  };
};

const EntranceGuardList = connect(
  mapStateToProps,
)(EntranceGuardListContent);

export default EntranceGuardList;
