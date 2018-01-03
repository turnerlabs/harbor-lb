import React, { Component } from 'react';

export default class ALB extends Component {

  render() {
    const lb = this.props.data;
    let visibility = 'internal';
    if (lb.public)
      visibility = 'public';
    const lbType = `${visibility} ${lb.type}`;
    const style = {
      'whiteSpace': 'pre-wrap'
    };

    return (
      <div>
        <br /><b>Name:</b>&nbsp;&nbsp;{lb.name}
        <br /><b>Type:</b>&nbsp;&nbsp;{lbType}
        <br /><b>State:</b>&nbsp;&nbsp;{lb.state}
        <br /><b>DNS:</b>&nbsp;&nbsp;{lb.dnsName}
        <br /><b>ARN:</b>&nbsp;&nbsp;{lb.arn}
        <p>Get attributes:</p>
        <pre style={style}>
          <code>
            aws elbv2 describe-load-balancer-attributes --load-balancer-arn {lb.arn}
          </code>
        </pre>
        <p>Get tags:</p>
        <pre style={style}>
          <code>
            aws elbv2 describe-tags --resource-arns {lb.arn}
          </code>
        </pre>
        <p>Set IdleTimeout:</p>
        <pre style={style}>
          <code>
            aws elbv2 modify-load-balancer-attributes --load-balancer-arn {lb.arn} --attributes Key=idle_timeout.timeout_seconds,Value=60
          </code>
        </pre>
      </div>
    )
  }
}