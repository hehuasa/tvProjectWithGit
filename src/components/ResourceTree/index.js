import React, {PureComponent} from 'react';
import Trees from './Trees';
import ResourceSelect from './ResourceSelect';

export default class ResourceTree extends PureComponent{
  render(){
    return (
      <div style={{marginTop:20}}>
        <ResourceSelect />
        <Trees />
      </div>
    )
  }
}

