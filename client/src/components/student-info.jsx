import React, { Component } from 'react';
import { Row, Input, Button, Table, Modal, Icon } from 'react-materialize';
import Swal from 'sweetalert2'
class StudentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: ' ',
            cnicno: ' ',
            cellno: ' ',
            fathername: ' ',
            fathercnicno: ' ',
            fathercellno: ' ',
            profession:' ',
            dob: ' ',
            address: ' ',
            aboutme: " ",

            degreename: '',
            institute: '',
            session: '',
            totalmarks: '',
            obtainedmarks: '',
            education: [],

            degreenameu: '',
            instituteu: '',
            sessionu: '',
            totalmarksu: '',
            obtainedmarksu: '',
            editId:'',

            modelopen: false

        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmitPersonalInfomation = this.onSubmitPersonalInfomation.bind(this);
        this.onSaveEducation = this.onSaveEducation.bind(this);
        this.onUpdateEducation = this.onUpdateEducation.bind(this);
        this.onUpdateClick = this.onUpdateClick.bind(this);
        this.onmodelclose = this.onmodelclose.bind(this);
    }

    componentWillMount() {
        this.getUserInfo();
        this.getUserEducation();
    }

    handleChange(event) {
         
        this.setState({ [event.target.name]: event.target.value });
    }

    getUserInfo() {
        fetch('/user/getUserInfo', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userid: this.props.stateLogin.hashId,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        let user = data[0];
                        this.setState({
                            aboutme: user.aboutme,
                            address:user.address,
                            cellno: user.cellno,
                            cnicno: user.cnicno,
                            dob: user.dob,
                            fathercellno: user.fathercellno,
                            fathercnicno: user.fathercnicno,
                            profession: user.profession,
                            fathername: user.fathername,
                            fullname: user.name,
                            
                        })
                    }
                    else {
                        window.Materialize.toast("data length < 1", 3000, 'red')
                    }


                })
                .catch();
    }

    onSubmitPersonalInfomation() {
        if (this.state.fullname && this.state.cnicno && this.state.cellno) {
            fetch('/user/updateUserInfo', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userid: this.props.stateLogin.hashId,
                    name: this.state.fullname,
                    cnicno: this.state.cnicno,
                    cellno: this.state.cellno,
                    fathername: this.state.fathername,
                    fathercnicno: this.state.fathercnicno,
                    fathercellno: this.state.fathercellno,
                    profession: this.state.profession,
                    dob: this.state.dob,
                    address: this.state.address,
                    aboutme: this.state.aboutme,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        if (data[0].resu === true) {
                            window.Materialize.toast("valid! ", 3000, 'green');
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
            window.Materialize.toast("Please fill all fields", 3000, 'red');
        }
    }

    onSaveEducation() {
        if (this.state.degreename && this.state.obtainedmarks && this.state.session) {
            fetch('/user/addUserEducation', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userid: this.props.stateLogin.hashId,
                    degreename: this.state.degreename,
                    session: this.state.session,
                    institute: this.state.institute,
                    totalmarks: this.state.totalmarks,
                    obtainedmarks: this.state.obtainedmarks,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        if (data[0].resu === true) {
                            window.Materialize.toast("Data Added Successfully!!", 3000, 'green');
                            this.setState({
                                degreename: '',
                                session: '',
                                institute: '',
                                totalmarks: '',
                                obtainedmarks: ''
                            });
                            this.getUserEducation();
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
            window.Materialize.toast("Please fill all fields", 3000, 'red');
        }
    }

    getUserEducation() {
        fetch('/user/getUserEducation', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userid: this.props.stateLogin.hashId,
            })
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    education: data
                })
            })
            .catch();
    }

    onUpdateEducation(id) {
        if (this.state.degreenameu && this.state.obtainedmarksu && this.state.sessionu) {
            fetch('/user/updateUserEducation', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eduid: id,
                    degreename: this.state.degreenameu,
                    session: this.state.sessionu,
                    institute: this.state.instituteu,
                    totalmarks: this.state.totalmarksu,
                    obtainedmarks: this.state.obtainedmarksu,
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        if (data[0].resu === true) {
                            window.Materialize.toast("Data Updated Successfully!!", 3000, 'green');
                            this.getUserEducation();
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
            window.Materialize.toast("Please fill all fields", 3000, 'red');
        }
    }

    onUpdateClick(edu) {
            this.setState({
                degreenameu: edu.degreename,
                instituteu: edu.institute,
                sessionu: edu.session,
                totalmarksu: edu.totalmarks,
                obtainedmarksu: edu.obtainedmarks,
                editId: edu._id,
                modelopen: !this.state.modelopen
            });
    }

    onDeleteEducation(id) {
        Swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                if (id) {
                    fetch('/user/deleteUserEducation', {
                        method: 'Post',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            eduid: id,
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.length > 0) {
                                if (data[0].resu === true) {
                                    window.Materialize.toast("Data Deleted Successfully!!", 3000, 'green');
                                    this.getUserEducation();
                                    this.setState({
                                        modelopen: false
                                    });
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
                    window.Materialize.toast("Please select item to Delete", 3000, 'red');
                }
            }
        })

    }

    onmodelclose() {
        this.setState({
            modelopen: false
        });
    }

    render() {
        return (
            <div className="con">
                <h3>Personal Information</h3>
                <Row className="w80" >
                    <Input s={12} l={4} name="fullname" type="text" label="Name" value={this.state.fullname} onChange={this.handleChange}>
                        <Icon>account_circle</Icon>
                    </Input>
                    <Input s={12} l={4} name="cnicno" type="text" label="CNIC NO" value={this.state.cnicno} onChange={this.handleChange}>
                        <Icon>fingerprint</Icon>
                    </Input>
                    <Input s={12} l={4} name="cellno" type="text" label="Cell#" value={this.state.cellno} onChange={this.handleChange}>
                        <Icon>phone</Icon>
                    </Input>
                    
                    <Input s={12} l={4} name="fathername" type="text" label="Fatrher Name" value={this.state.fathername} onChange={this.handleChange}>
                        <Icon>how_to_reg</Icon>
                    </Input>
                    <Input s={12} l={4} name="fathercnicno" type="text" label="Father CNIC NO" value={this.state.fathercnicno} onChange={this.handleChange}>
                        <Icon>fingerprint</Icon>
                    </Input>
                    <Input s={12} l={4} name="fathercellno" type="text" label="Cell#" value={this.state.fathercellno} onChange={this.handleChange}>
                        <Icon>phone</Icon>
                    </Input>

                    <Input s={12} type="text" name="profession" label="Profession field" value={this.state.profession} onChange={this.handleChange} placeholder="">
                        <Icon>add_location</Icon>
                    </Input>
                    
                    <Input s={12} l={12} type="date" name="dob" label="Date of Birth" value={this.state.dob} onChange={this.handleChange} placeholder="" >
                        <Icon>calendar_today</Icon>
                    </Input>    
                    

                    <Input s={12} type="text" name="address" label="Full and Permanent Address" value={this.state.address} onChange={this.handleChange}>
                        <Icon>add_location</Icon>
                    </Input>

                    <Input s={12} type="textarea" name="aboutme" label="About Me!" value={this.state.aboutme} onChange={this.handleChange}>
                        <Icon>info</Icon>
                    </Input>
                    <Button waves='yellow' className="red" onClick={this.onSubmitPersonalInfomation}>Submit</Button>
                </Row>
               

                
                <h3>Education Infomation</h3>
                <Modal
               
                    fixedFooter
                    trigger={<Button>Add New</Button>}>
                    <Row className="">
                        <div className="modelHeader">Add Education</div>
                        <Input l={6} s={12} name="degreename" type="text" label="Degree Name" value={this.state.degreename} onChange={this.handleChange} />
                        <Input l={6} s={12} name="institute" type="text" label="Institute" value={this.state.institute} onChange={this.handleChange} />
                        <Input s={12} type="text" name="session" label="Session"  value={this.state.session} onChange={this.handleChange} />
                        <Input s={12} type="text" name="totalmarks" label="Total Marks / CGPA"  value={this.state.totalmarks} onChange={this.handleChange} />
                        <Input s={12} type="text" name="obtainedmarks" label="Obtained Marks / CGPA" value={this.state.obtainedmarks} onChange={this.handleChange} />
                        <Button waves='yellow' className="red" onClick={this.onSaveEducation}>Save</Button>
                    </Row>
                </Modal>

                <Table hoverable responsive striped bordered centered>
                    <thead>
                        <tr>
                            <th>Degree</th>
                            <th>Institute</th>
                            <th>Session</th>
                            <th>Total Marks / Cgpa</th>
                            <th>Obt. Marks / Cgpa</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.education.map(edu => (
                            <tr key={edu._id}>
                                <td>{edu.degreename}</td>
                                <td>{edu.institute}</td>
                                <td>{edu.session}</td>
                                <td>{edu.totalmarks}</td>
                                <td>{edu.obtainedmarks}</td>
                                <td >
                                    <Button waves='yellow' className="red" onClick={() => this.onUpdateClick(edu)}>Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Modal
                    open={this.state.modelopen}
                    actions={
                        <div>
                            <Button waves="light" className="red darken-2" onClick={() => this.onmodelclose()}>close</Button>
                        </div>
                    }>

                    <Row>
                        <div className="modelHeader">Update</div>
                        <Input l={6} s={12} name="degreenameu" type="text" label="Degree Name" value={this.state.degreenameu} onChange={this.handleChange} placeholder="" />
                        <Input l={6} s={12} name="instituteu" type="text" label="Institute" value={this.state.instituteu} onChange={this.handleChange} placeholder=""  />
                        <Input s={12} type="text" name="sessionu" label="Session" value={this.state.sessionu} onChange={this.handleChange} placeholder=""  />
                        <Input s={12} type="text" name="totalmarksu" label="Total Marks / CGPA" value={this.state.totalmarksu} onChange={this.handleChange} placeholder=""  />
                        <Input s={12} type="text" name="obtainedmarksu" label="Obtained Marks / CGPA" value={this.state.obtainedmarksu} onChange={this.handleChange} placeholder=""  />
                        <Button waves='yellow' className="green" onClick={() => this.onUpdateEducation(this.state.editId)}>Update</Button>
                        <Button waves='yellow' className="red" onClick={() => this.onDeleteEducation(this.state.editId)}>Delete</Button>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default StudentInfo;
