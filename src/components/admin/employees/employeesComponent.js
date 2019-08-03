import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  addEmployeeAction,
  fetchEmployeesAction,
  deleteEmployeesAction
} from '../../../actions/admin';
import { getCookie } from '../../../utils/cookies';
import './employees.scss';
import EmployeeForm from '../../common/forms/employeeForm/employeeForm';
import EmployeeTable from '../../common/tables/employeeTable/employeeTable';
import EditEmployeeProfile from './edit/editEmployeeProfileComponent';

class Employees extends Component {
  state = {
    tools: [],
    users: [],
    loading: false,
    error: null,
    id: '',
  }

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidMount() {
    this.props.dispatch(fetchEmployeesAction({
      admin: {
        userID: getCookie('userID'),
        role: getCookie('role')
      }
    }));
  }

  static getDerivedStateFromProps(nextProps, prevProps) {
    if (nextProps.deleteEmployee.hasOwnProperty('payload') && nextProps.deleteEmployee.payload.length > 0) {
      if (nextProps.fetch.payload.length > 0) {
        nextProps.fetch.payload[0].users = [];
      }
      nextProps.add.payload = [];
      nextProps.update.payload = [];
      return {
        users: nextProps.deleteEmployee.payload,
        loading: nextProps.deleteEmployee.loading,
        error: null,
      }
    } else if (nextProps.update.payload.length > 0) {
      if (nextProps.fetch.payload.length > 0) {
        nextProps.fetch.payload[0].users = [];
      }
      nextProps.add.payload = [];
      nextProps.deleteEmployee.payload = [];
      return {
        users: nextProps.update.payload,
      }
    } else if (nextProps.add.hasOwnProperty('payload') && nextProps.add.payload.length > 0) {
      if (nextProps.fetch.payload.length > 0 && nextProps.fetch.payload[0].users.length > 0) {
        nextProps.fetch.payload[0].users = [];
      }
      nextProps.update.payload = [];
      nextProps.deleteEmployee.payload = [];
      return {
        loading: false,
        error: null,
        users: nextProps.add.payload,
      }
    } else if (nextProps.fetch.hasOwnProperty('payload') && nextProps.fetch.payload.length > 0 && nextProps.fetch.payload[0].users.length > 0) {
      nextProps.add.payload = [];
      nextProps.update.payload = [];
      nextProps.deleteEmployee.payload = [];
      return {
        loading: false,
        error: null,
        users: nextProps.fetch.payload[0].users,
      }
    } else {
      return {
        loading: false,
        error: null,
        users: [],
      }
    }
  }

  insertNewEmployee(event) {
    event.preventDefault();
    this.props.update.payload = [];
    this.props.deleteEmployee.payload = [];
    if (this.props.fetch.payload.length > 0 && this.props.fetch.payload[0].users.length > 0) {
      this.props.fetch.payload[0].users = [];
    }

    this.props.dispatch(addEmployeeAction({
      data: {
        name: event.target.name.value,
        email: event.target.email.value,
        username: event.target.username.value,
        password: event.target.password.value,
        profession: event.target.profession.value,
        role: event.target.role.value.toLowerCase()
      },
      admin: {
        userID: getCookie('userID'),
        role: getCookie('role')
      }
    }));

    event.target.name.value = '';
    event.target.email.value = '';
    event.target.username.value = '';
    event.target.password.value = '';
    event.target.profession.value = '';
    event.target.role.value = 'Select a role administrator or employee';
  }

  deleteEmployee(employeeID) {
    this.props.dispatch(deleteEmployeesAction({
        employeeID: employeeID,
        admin: {
          userID: getCookie('userID'),
          role: getCookie('role')
        }
      }));
  }

  editEmployee(employeeID) {
    this.setState({
      id: employeeID
    });
    this.context.router.history.push(`/admin/employees/profile/edit/${employeeID}`);
  }

  render() {
    if (this.state.loading) {
      return <div className='loading'>Loading...</div>
    }

    return (
      <div className='container new-container'>
        <EmployeeForm 
          insertNewEmployee={this.insertNewEmployee.bind(this)}
        />
        <EmployeeTable users={this.state.users} deleteEmployee={this.deleteEmployee.bind(this)} editEmployee={this.editEmployee.bind(this)} />
        <Route path={`${this.props.match.path}/profile/edit/${this.state.id}`} component={EditEmployeeProfile} />
      </div>
    );
  }
}

const mapStateToProps = state => (state);

export default connect(mapStateToProps)(Employees);
