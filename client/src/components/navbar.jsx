import React, {  Component } from 'react';
import {  NavLink } from 'react-router-dom'
import { Navbar, Button } from 'react-materialize';



class NavBar extends Component {
    //constructor(props) {
    //    super(props);
    //}

    onLogout() {
        this.props.onClickLogout();
    }
    render() {
        let register;
        let settings;
        let login;
        let profile;
        let studentlist;
        let studentinfo;
        let imag;
        let companylist;
        let skills;
        let createjob;
        if (this.props.name.login) {
            if (this.props.name.type === "Company") {
                studentlist = <li><NavLink activeStyle={{ color: 'red' }} to='/studentlist'>Student List</NavLink></li>
                profile = <li><NavLink activeStyle={{ color: 'red' }} to={"/profile"}>Profile</NavLink></li>
                createjob = <li><NavLink activeStyle={{ color: 'red' }} to={"/createjob"}>New Job</NavLink></li>

            }
            if (this.props.name.type === "Student") {
                studentinfo = <li><NavLink activeStyle={{ color: 'red' }} to='/myinfo'>Education</NavLink></li>
                //imag = <li className=""><img src={`http://localhost:3001/images/${this.props.name.image_url}`} alt="sdsd" className="imglogo" /></li>;
                companylist = <li><NavLink activeStyle={{ color: 'red' }} to='/companylist'>Companies</NavLink></li>
                skills = <li><NavLink activeStyle={{ color: 'red' }} to='/skills'>Skills</NavLink></li>
                profile = <li><NavLink activeStyle={{ color: 'red' }} to={"/student/" + this.props.name.hashId}>Profile</NavLink></li>

            }
            settings = <Button floating fab='horizontal' icon='settings' className='red' large style={{ bottom: '45px', right: '24px' }}>
                <Button floating icon='lock' className='red' onClick={() => this.onLogout()} />
                <Button floating icon='format_quote' className='yellow darken-1' />
                <Button floating icon='publish' className='green' />
                <Button floating icon='attach_file' className='blue' />
            </Button>
        }
        else {
            register = <li><NavLink activeStyle={{ color: 'red' }} to='/register'>Register</NavLink></li>
            login = <li><NavLink activeStyle={{ color: 'red' }} to='/login'>Login</NavLink></li>
        }
        return (
            <div className="">
                
                <Navbar className="navMys" left>
                    {imag}
                    <li><NavLink activeStyle={{ color: 'red' }} to='/home'>Home</NavLink></li>
                    {profile}
                    {skills}
                    {studentlist}
                    {createjob}
                    {studentinfo}
                    {companylist}
                    {register}
                    {login}
                    <li><NavLink to='/home'>{React.version}</NavLink></li>

                </Navbar>
                {settings}
            </div>
        );
    }
}

export default NavBar;
