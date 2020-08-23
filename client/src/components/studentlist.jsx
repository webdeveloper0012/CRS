import React, { Component } from 'react';
import { Table, Button, Modal, Collapsible, CollapsibleItem, Row, Input, Icon, Pagination} from 'react-materialize';

class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentlist: [],
            education: [],

            modelopen: false,

            name: '',
            cnicno: '',
            cellno: '',
            degreename: '',
            institutename: '',
            activePage: 1,
            studentCount:''
        };
        this.handleChange = this.handleChange.bind(this);
        this.getDatabyFilter = this.getDatabyFilter.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.nextPath = this.nextPath.bind(this);  
    } 

    componentWillMount() {
        this.getAllStudents();
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value }, () => {
            this.getDatabyFilter(1);
        });
    }

    getAllStudents() {
        fetch('/user/getAllStudent', {
            method: 'Get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    studentlist: data.resu,
                    studentCount: data.count,
                    activePage:1
                });


            })
            .catch();
    }
    viewStudent(studentID) {
        this.setState({
            modelopen: !this.state.modelopen
        });
        //window.Materialize.toast("Student Id " + studentID, 3000, 'red');
        this.getUserEducation(studentID);
    }
    getUserEducation(stuId) {
        fetch('/user/getUserEducation', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userid: stuId,
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

    getDatabyFilter(activePage) {
        fetch('/user/getFilterStudent', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                cnicno: this.state.cnicno,
                cellno: this.state.cellno,
                degreename: this.state.degreename,
                institutename: this.state.institutename,
                activepage: activePage
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    this.getDatabyFilterCount();
                    this.setState({
                        studentlist: data,
                        activePage: activePage
                    });
                }
                else {
                    window.Materialize.toast("No Student Available!", 3000, 'red');
                }


            })
            .catch();
    }

    getDatabyFilterCount() {
        fetch('/user/getFilterStudentCount', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                cnicno: this.state.cnicno,
                cellno: this.state.cellno,
                degreename: this.state.degreename,
                institutename: this.state.institutename,

            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    this.setState({
                        studentCount: data[0].totalCount
                    });
                }
                else {
                    window.Materialize.toast("No count Available!", 3000, 'red');
                }


            })
            .catch();
    }

    onmodelclose() {
        this.setState({
            modelopen: false
        });
    }

    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber }, () => {
            this.getDatabyFilter(pageNumber);
        });
    }

    nextPath(path) {
        this.props.history.push(path);
    }

    render() {
        return (
            <div className="con ">
                <Collapsible accordion defaultActiveKey={1}>
                    <CollapsibleItem header='' icon='sort'>
                        <Row className="w80" >
                            <Input s={12} l={4} name="name" type="text" label="search by name" value={this.state.name} onChange={this.handleChange}>  
                                <Icon>account_circle</Icon>
                            </Input>
                            <Input s={12} l={4} name="cnicno" type="text" label="search by cinc" value={this.state.cnicno} onChange={this.handleChange}>
                                <Icon>fingerprint</Icon>
                            </Input>
                            <Input s={12} l={4} name="cellno" type="text" label="search by phone" value={this.state.cellno} onChange={this.handleChange}>
                                <Icon>phone</Icon>
                            </Input>

                            <Input s={12} l={6} name="degreename" type="text" label="search by degree" value={this.state.degreename} onChange={this.handleChange}>
                                <Icon>cast_for_education</Icon>
                            </Input>
                            <Input s={12} l={6} name="institutename" type="text" label="search by institute" value={this.state.institutename} onChange={this.handleChange}>
                                <Icon>forum</Icon>
                            </Input>


                            <Button waves='light' className="green" onClick={()=> this.getDatabyFilter(1)}>Search<Icon right>search</Icon></Button>
                        </Row>
                </CollapsibleItem>
                </Collapsible>
                <Pagination items={ Math.ceil(this.state.studentCount / 10) } activePage={this.state.activePage} maxButtons={10} onSelect={this.handlePageChange} />
                <Table hoverable responsive striped bordered centered >
                    <thead>
                        <tr>
                         
                            <th>Name</th>
                            <th>Last Name</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.studentlist.map(student => (
                            <tr className="clsStudentListTr" key={student._id}>
                             
                                <td>{student.first_n}</td>
                                <td>{student.last_n}</td>
                                <td>{student.username}</td>
                                <td>{student.email}</td>
                                <td>
                                    <Modal trigger={<img src={`http://localhost:3001/images/${student.img_url}`} alt={student.img_url} className="stuImg" />}>
                                        <img src={`http://localhost:3001/images/${student.img_url}`} alt={student.img_url} className="" width="100%" height="auto" />
                                    </Modal>
                                </td>
                                <td><Button waves='yellow' className="red" onClick={() => this.nextPath('/student/' + student._id)}>View</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination items={Math.ceil(this.state.studentCount / 10)} activePage={this.state.activePage} maxButtons={10} onSelect={this.handlePageChange} />
                <p>Showing {this.state.activePage * 10 - 9} to {this.state.activePage * 10} of {this.state.studentCount} entries</p>
                <Modal
                    open={this.state.modelopen}
                    actions={
                        <div>
                            <Button waves="light" className="red darken-2" onClick={() => this.onmodelclose()}>close</Button>
                        </div>
                    }>

                    <Row>
                        <Table hoverable responsive striped bordered centered>
                            <thead>
                                <tr>
                                    <th>Degree</th>
                                    <th>Institute</th>
                                    <th>Session</th>
                                    <th>Total Marks / Cgpa</th>
                                    <th>Obt. Marks / Cgpa</th>
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
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default StudentList;
