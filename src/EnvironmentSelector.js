import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import Spinner from './Spinner';
import ELB from './ELB';
import ALB from './ALB';

//handles environment selection logic
//including fetching environment data from backend
//and passing to Environment component to render
export default class Environment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedEnvironment: '',
      data: [],
      notFound: false,
    };
    this.handleActive = this.handleActive.bind(this);
  }

  handleActive(tab) {
    //todo: fetch lb status for this shipment/env
    const env = tab.props['data-environment'];
    const shipment = this.props.shipment;

    this.setState({
      loading: true,
      selectedEnvironment: env,
    });

    //fetch load balancer status from the backend
    const uri = `http://harbor-trigger.services.dmtio.net/v2/loadbalancer/status/${shipment}/${env}/ec2`;
    fetch(uri)
      .then(response => {
        console.log(response.status)
        if (response.status !== 200) {
          this.setState({
            notFound: true,
          });
          return;
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          data: data,
          loading: false,
          notFound: false,
        });
      })
      .catch(e => {
        console.error('parsing failed', e);
        this.setState({
          notFound: true,
        });
      });
  }

  render() {
    let style = {
      visibility: 'hidden'
    };

    if (this.props.data.length > 0)
      style.visibility = 'visible';

    let content = <Spinner />
    if (this.state.notFound || !this.state.data) {
      content = <p>not found</p>
    }
    else if (!this.state.loading) {
      const lb = this.state.data;
      console.log(lb.type);
      if (lb.type === 'elb')
        content = <ELB data={lb} />
      if (lb.type === 'alb' || lb.type === 'alb-ingress')
        content = <ALB data={lb} />
    }

    return (
      <Tabs
        initialSelectedIndex={-1}
        style={style}
      >
        {this.props.data.map(env => (
          <Tab
            key={env}
            label={env}
            data-environment={env}
            onActive={this.handleActive}
          >
            <div>
              {content}
            </div>
          </Tab>
        ))}
      </Tabs>
    );
  }

}