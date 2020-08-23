import React, { Component } from 'react';
import { Row, Input, Button } from 'react-materialize';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        this.props.onClick(this.state.email, this.state.password);
        event.preventDefault();
    }
    render() {
        return (
            <div className="con logincon">
                <br />
                <Row className="formwlogin">
                    <form onSubmit={this.handleSubmit}>
                        <Input type="email" name="email" label="Email" s={12} value={this.state.email} onChange={this.handleChange} />
                        <Input type="password" name="password" label="Password" s={12} value={this.state.password} onChange={this.handleChange} />
                        <Button waves='yellow' type="submit" className="red"> Login </Button>
                    </form>
                </Row>
            </div>
        );
    }
}

export default Login;
