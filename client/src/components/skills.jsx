import React, { Component } from 'react';
import { Row, Col, Chip, Input, Button } from 'react-materialize';
import Swal from 'sweetalert2'

class Skills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skillname: '',
            skills: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmitSkill = this.onSubmitSkill.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    deleteSkill(id, index) {
        Swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.value) {
                    fetch('/user/deleteUserSkill', {
                        method: 'Post',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            skillid: id,
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.length > 0) {
                                if (data[0].resu === true) {
                                    window.Materialize.toast("Skill removed successfully!", 4000, 'green');
                                    var array = this.state.skills;
                                    array.splice(index, 1);
                                    this.setState({ skill: array });
                                }
                                else {
                                    window.Materialize.toast("err!", 3000, 'red');
                                }
                            }
                            else {
                                window.Materialize.toast("data length < 1", 3000, 'red')
                            }
                        })
                        .catch();
            }
        })

    }

    componentWillMount() {
        this.getMySkills();
    }

    getMySkills() {
            fetch('/user/getSkill', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userid: this.props.stateLogin.hashId
                })
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({
                        skills: data
                    })
                })
                .catch();
    }

    onSubmitSkill(event) {
        event.preventDefault();
        if (this.state.skillname) {
            fetch('/user/addSkill', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userid: this.props.stateLogin.hashId,
                    skillname: this.state.skillname,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        if (data[0].resu === true) {
                            window.Materialize.toast("valid! ", 3000, 'green');
                            this.setState({
                                skillname: ''
                            });
                            this.getMySkills();
                        }
                        else {
                            window.Materialize.toast("err!", 3000, 'red');
                        }

                    }
                    else {
                        window.Materialize.toast("data length < 1", 3000, 'red')
                    }


                })
                .catch();
        }
        else {
            window.Materialize.toast("Please add skill name", 3000, 'red');
        }
    }

    render() {
        return (
            <div className="con">
                <br />
                <Row className="formw60">
                    <h5 className="headingform">Add Skills</h5>
                    <form onSubmit={this.onSubmitSkill}>
                        <Input type="text" name="skillname" label="Skill" s={12} value={this.state.skillname} onChange={this.handleChange} />
                        <Button waves='light' type="submit" className="red"> Save </Button>
                    </form>

                </Row>
                <br />
                <Row>
                    <Col s={12}>
                        {this.state.skills.map((skill,index) => (
                            <Chip close={false}  key={skill._id}>
                                <div className="chipIcon">{skill.skillname.slice(0, 1).toUpperCase()}</div>
                                {skill.skillname}
                                <i className="material-icons iconSkills md-18" onClick={() => this.deleteSkill(skill._id, index)}>close</i>
                            </Chip>
                        ))}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Skills;
