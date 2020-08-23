import React, { Component } from 'react';
import { Row, Input, Button} from 'react-materialize';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            username:'',
            email: '',
            password: '',
            type: 'Company',
            file: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    handleChange(event) {
            this.setState({ [event.target.name]: event.target.value });
    }
    handleChangeFile(event) {
        this.setState({ file: event.target.files[0] });
    }

    uploadImage() {
        let form = new FormData(this.refs.myForm);
        form.append('myImage', this.state.file);
        form.append('firstname', this.state.firstname);
        form.append('lastname', this.state.lastname);
        form.append('password', this.state.password);
        form.append('email', this.state.email);
        form.append('username', this.state.username);
        form.append('type', this.state.type);
        fetch('/user/addNewUser', {
            method: 'POST',
            body: form
        }).then(res => res.json())
            .then(data => {
                if (data.msg === "true") {
                    window.Materialize.toast("Data Added Successfully! ", 3000, 'green');
                    this.setState({
                        firstname: '',
                        lastname: '',
                        username: '',
                        email: '',
                        password: '',
                        file: null
                    });
                }
                else {
                    window.Materialize.toast("Something went wrong please try again!", 3000, 'red');
                }
            })
    }
    submitForm(event) {
        if (this.state.firstname && this.state.email && this.state.password) {
            this.uploadImage();
                //fetch('/user/addUser', {
                //    method: 'Post',
                //    headers: {
                //        'Accept': 'application/json',
                //        'Content-Type': 'application/json'
                //    },
                //    body: JSON.stringify({
                //        firstname: this.state.firstname,
                //        lastname: this.state.lastname,
                //        username: this.state.username,
                //        email: this.state.email,
                //        password: this.state.password,
                //        type: this.state.type,
                //    })
                //})
                //    .then(res => res.json())
                //    .then(data => {
                //        if (data.length > 0) {
                            
                //            if (data[0].success === 1) {
                //                window.Materialize.toast("valid! " + data[0].idm, 3000, 'green');
                //                if (this.state.type === "Student") {
                //                    this.uploadImage(data[0].idm);
                //                }
                //            }
                //            else { window.Materialize.toast("err!", 3000, 'red')}
                            
                //        }
                //        else {
                //            window.Materialize.toast("data length < 1", 3000, 'red')
                //        }


                //    })
                //    .catch();
            }
        else {
            window.Materialize.toast("Please fill all fields", 3000, 'red');
        }
    }


    render() {
        let filename = "Select file";
        if (this.state.file !== null) {
            filename = this.state.file.name;
        }
        let next;
        if (this.state.type !== '') {
            if (this.state.type !== 'Company') {
                next = <Row className="formw60" >
                    <p>{this.state.type}</p>
                    <Input s={6} name="firstname" type="text" label="First Name" value={this.state.firstname} onChange={this.handleChange} />
                    <Input s={6} name="lastname" type="text" label="Last Name" value={this.state.lastname} onChange={this.handleChange} />
                    <Input type="text" name="username" label="Username" s={12} value={this.state.username} onChange={this.handleChange} />
                    <Input type="email" name="email" label="Email" s={12} value={this.state.email} onChange={this.handleChange} />
                    <Input type="password" name="password" label="Password" value={this.state.password} s={12} onChange={this.handleChange} />

                    <label className="file_input">
                        <i className="material-icons">file_upload</i>
                        <Input id="file_input_file" className="none" type="file" onChange={this.handleChangeFile} />
                    </label>
                    <div id="file_input_text_div">
                        <input className="file_input_text" type="text" readOnly id="file_input_text" value={filename} />
                        <label className="mdl-textfield__label" htmlFor="file_input_text"></label>
                    </div>
                    <Button waves='yellow' className="file_input red mt-10" onClick={this.submitForm}>Submit</Button>
                </Row>
            }
            else {
                next = <Row className="formw60" >
                    <p>{this.state.type}  </p>
                    <Input s={12} type="text" name="firstname" label="Company Name" value={this.state.firstname} onChange={this.handleChange} />
                    <Input type="text" name="username" label="Company Username" s={12} value={this.state.username} onChange={this.handleChange} />
                    <Input type="email" name="email" label="Company Email" s={12} value={this.state.email} onChange={this.handleChange} />
                    <Input type="password" name="password" label="Password" s={12} value={this.state.password} onChange={this.handleChange} />
                        <Button waves='yellow' className="red" onClick={this.submitForm}>Submit</Button>
                </Row>
            }
        }
        else {

        }
        return (
           
            <div className="con">
                <br />
                <Row className="formw60">
                    <Input className="" s={12} label="Type" type='select' value={this.state.type} name="type" onChange={this.handleChange} >
                        <option className="dropdown-content" value='Company'>Company</option>
                        <option className="dropdown-content" value='Student'>Student</option>
                    </Input>
                </Row>
                <br />
                {next}
            </div>
        );
    }
}

export default SignUp;
