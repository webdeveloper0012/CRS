import React, { Component } from 'react';
import './App.css';
import Home from './components/home';
import NavBar from './components/navbar';
import SignUp from './components/signup';
import Login from './components/login';
import Profile from './components/profile';
import StudentList from './components/studentlist';
import CompanyList from './components/company-list';
import StudentInfo from './components/student-info';
import NotFound from './components/404notfound';
import Student from './components/student';
import NewJob from './components/newjob';


import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import Skills from './components/skills';


class App extends Component {
    constructor() {
        super();
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.getLogin = this.getLogin.bind(this);
    }

    state = {
        login: '',
        type: '',
        hashId: '',
        image_url:''

    }
    componentWillMount() {
        this.ckeckLogin();

    }
    ckeckLogin() {
        let user = sessionStorage.getItem("user");
        if (user != null && user === "true") {
            this.setState(
                {
                    login: true,
                    type: sessionStorage.getItem("type"),
                    hashId: sessionStorage.getItem("hashId"),
                    image_url: sessionStorage.getItem("imgurl")
                });
        }
        else {
            this.setState(
                {
                    login: false,
                    type: '',
                    hashId:''
                });
        }
    }
    logout() {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("type");
        sessionStorage.removeItem("hashId");
        sessionStorage.removeItem("imgurl");
        this.setState(
            {
                login: false,
                type: '',
                hashId: ''
            });
    }
    login(email, pass) {
        if (email && pass) {
            this.getLogin(email, pass);
        }
        else {
            window.Materialize.toast("Please enter email and password", 3000,'red')
        }
    }
    getLogin(email, password) {
        fetch('/user/getLogin', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'email=' + email +
                '&password=' + password
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    if (data[0].confi_status === "true") {
                        sessionStorage.setItem("user", "true");
                        sessionStorage.setItem("type", data[0].role);
                        sessionStorage.setItem("hashId", data[0]._id);
                        sessionStorage.setItem("imgurl", data[0].img_url);
                        this.setState({
                            login: true,
                            type: data[0].role,
                            hashId: data[0]._id,
                            image_url: data[0].img_url
                        });
                    }
                    else {
                        window.Materialize.toast("Please Confirm your account!", 3000,'orange')
                    }
                }
                else {
                    window.Materialize.toast("Please Enter Valid Email and Password!", 3000,'red')
                }
  

            })
            .catch();
    }
    render() {
      return (
          <Router>
              <div>
                  <Route path="" render={(props) => <NavBar {...props} name={this.state} onClickLogout={this.logout} />} />
                  <Route path="/" exact strict component={Home} />
                  <Route path="/home" component={Home} />
                  <Route path="/PageNotFound" component={NotFound} />
                  <Route path="/register" render={() => (
                      this.state.login ? (<Redirect to="/home" />) : (<SignUp />)
                  )} />
                  <Route path="/profile" render={(props) => (
                      this.state.login ? (<Profile {...props} stateLogin={this.state} />) : (<Redirect to="/login" />)
                  )} />
                  <Route path="/login" render={(props) => (
                      this.state.login ? (<Redirect to="/home" />) : (<Login {...props} onClick={this.login} />)
                  )} />
                  <Route path="/studentlist" render={(props) => (
                      this.state.login ? (this.state.type === "Company" ? (<StudentList {...props} />) : (<NotFound />)) : (<Redirect to="/home" />)
                  )} />
                  <Route path="/companylist" render={() => (
                      this.state.login ? (this.state.type === "Student" ? (<CompanyList />) : (<NotFound />)) : (<Redirect to="/home" />)
                  )} />
                  <Route path="/myinfo" render={(props) => (
                      this.state.login ? (this.state.type === "Student" ? (<StudentInfo {...props} stateLogin={this.state}/>) : (<NotFound />)) : (<Redirect to="/home" />)
                  )} />
                  <Route
                      path="/student/:studentid"
                      render={(props) => (
                          this.state.login ? (<Student {...props} stateLogin={this.state} /> ) : (<Redirect to="/login" />)
                      )}
                  />
                  <Route path="/skills" render={(props) => (
                      this.state.login ? (this.state.type === "Student" ? (<Skills {...props} stateLogin={this.state} />) : (<NotFound />)) : (<Redirect to="/home" />)
                  )} />
                  <Route path="/createjob" render={(props) => (
                      this.state.login ? (this.state.type === "Company" ? (<NewJob {...props} stateLogin={this.state} />) : (<NotFound />)) : (<Redirect to="/home" />)
                  )} />
              </div>
          </Router>
    );
  }
}


export default App;
