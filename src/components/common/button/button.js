import React, { Component, Fragment } from 'react';
import './button.scss';

class Button extends Component {
  constructor(props) {
    super(props);
  }

  onHandleEvents(employeeID) {
    this.props.onHandleEvent(employeeID);
  }

  render() {
    const { classList, employee, label } = this.props;
    if (employee === undefined) {
      let employee = this.props.employee;
      return (
        <Fragment>
          <button className={classList}>{label}</button>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <button className={classList} onClick={this.onHandleEvents.bind(this, employee._id)}>{label}</button>
      </Fragment>
    );
  }
}

export default Button;