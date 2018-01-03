import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import ShipmentSearch from './ShipmentSearch';

export default class View extends Component {

  render() {
    return (
      <div>
        <AppBar title="Harbor Load Balancer" />
        <ShipmentSearch />
      </div>
    );
  }

}