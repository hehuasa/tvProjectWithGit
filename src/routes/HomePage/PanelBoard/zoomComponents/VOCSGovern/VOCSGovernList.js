import React, { PureComponent } from 'react';
import { connect } from 'dva';
import VOCSGovernListOneLevel from './VOCSGovernListOneLevel';
import VOCSGovernListTwoLevel from './VOCSGovernListTwoLevel';

class VOCSGovernListContent extends PureComponent {
  components = (key) => {
    switch (key) {
      case 'two': return <VOCSGovernListTwoLevel vocs={this.props.vocs} dispatch={this.props.dispatch} />;
      case 'one': return <VOCSGovernListOneLevel vocs={this.props.vocs} dispatch={this.props.dispatch} />;
      default: return <VOCSGovernListOneLevel vocs={this.props.vocs} dispatch={this.props.dispatch} />;
    }
  };

  render() {
    return (
      <div>
        {
          this.components(this.props.vocs.toggleTable)
        }
      </div>
    );
  }
}

// const getSelctData = (EntranceGuard) => {
//   if (EntranceGuard.toggleTable === 'three' && EntranceGuard.list.length > 0) {
//     const newList = [];
//     for (const item of EntranceGuard.list.entries()) {
//       newList.push(item[1]);
//       newList[item[0]].key = item[0];
//     }
//     EntranceGuard.list = newList;
//     return EntranceGuard;
//   }
//   return EntranceGuard;
// };

const mapStateToProps = (state) => {
  return {
    // EntranceGuard: getSelctData(state.EntranceGuard),
    vocs: state.vocs,
  };
};

const VOCSGovernList = connect(
  mapStateToProps,
)(VOCSGovernListContent);

export default VOCSGovernList;

