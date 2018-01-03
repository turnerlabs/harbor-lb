import React, { Component } from 'react';

export default class ELB extends Component {

  render() {
    const lb = this.props.data;
    let visibility = 'internal';
    if (lb.public)
      visibility = 'public';
    const lbType = `${visibility} ${lb.type}`;
    const style = {
      'whiteSpace': 'pre-wrap'
    };
    const lbAttributes = '"{\\"ConnectionSettings\\":{\\"IdleTimeout\\":60}}"';

    return (
      <div>
        <br /><b>Name:</b>&nbsp;&nbsp;{lb.name}
        <br /><b>Type:</b>&nbsp;&nbsp;{lbType}
        <br /><b>State:</b>&nbsp;&nbsp;{lb.state}
        <br /><b>DNS:</b>&nbsp;&nbsp;{lb.dnsName}
        <p>Get attributes:</p>
        <pre style={style}>
          <code>
            aws elb describe-load-balancer-attributes --load-balancer-name {lb.name}
          </code>
        </pre>
        <p>Get tags:</p>
        <pre style={style}>
          <code>
            aws elb describe-tags --load-balancer-name {lb.name}
          </code>
        </pre>
        <p>Set IdleTimeout:</p>
        <pre style={style}>
          <code>
            aws elb modify-load-balancer-attributes --load-balancer-name {lb.name} --load-balancer-attributes {lbAttributes}
          </code>
        </pre>
      </div>
    )
  }
}