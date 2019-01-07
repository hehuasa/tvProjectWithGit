import React, { PureComponent } from 'react';
import SearchBox from './SearchBox';
import styles from './index.less';

export default class Search extends PureComponent {
  render() {
    const { stopPropagation } = this.props;
    return (
      stopPropagation ? null : (
          <SearchBox />
      ));
  }
}