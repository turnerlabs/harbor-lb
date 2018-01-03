import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import AutoComplete from 'material-ui/AutoComplete';
import Spinner from './Spinner';
import EnvironmentSelector from './EnvironmentSelector';

//handles shipment search logic
export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      shipments: [],
      selected: '',
      environments: [],
    };
    this.onNewRequestHandler = this.onNewRequestHandler.bind(this);
  }


  componentDidMount() {
    //fetch all shipments from the backend
    const shipmentsUri = 'http://shipit.services.dmtio.net/v1/shipments';
    fetch(shipmentsUri)
      .then(response => response.json())
      .then(data => {
        this.setState({
          data: data,
          shipments: data.map(value => `${value.name}`),
          loading: false,
        })
      })
      .catch(e => {
        console.error('parsing failed', e)
      })
  }

  //Callback function that is fired when a list item is selected, or enter is pressed in the TextField
  onNewRequestHandler(selected) {
    //find selected shipment's environments
    const shipment = this.state.data.find(v => v.name === selected);
    this.setState({
      selected: selected,
      environments: shipment.environments,
    });
  }

  render() {
    const { loading, shipments } = this.state;

    let content =
      <div>
        <AutoComplete
          floatingLabelText="Shipment"
          dataSource={shipments}
          filter={AutoComplete.caseInsensitiveFilter}
          onNewRequest={this.onNewRequestHandler}
        />
        <EnvironmentSelector
          shipment={this.state.selected}
          data={this.state.environments}
        />
      </div>

    if (loading)
      content = <Spinner />

    return (
      <Card>
        <CardText>
          {content}
        </CardText>
      </Card>
    );
  }
}