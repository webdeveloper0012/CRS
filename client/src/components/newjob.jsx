import React, { Component } from 'react';
import { Row, Input, Button, Collection, CollectionItem,Table} from 'react-materialize';
class NewJob extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aboutstudent: ' ',

            responsibilities: [],
            responsibility: '',

            skills: [],
            skill: '',

            reqlist: [],
            title: '',
            description: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleResponsibilities = this.handleResponsibilities.bind(this);
        this.removeResponsibiliy = this.removeResponsibiliy.bind(this);
        this.handleSkills = this.handleSkills.bind(this);
        this.handleReqList = this.handleReqList.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.removeReqListItem = this.removeReqListItem.bind(this);
        this.submitHandle = this.submitHandle.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleResponsibilities() {  
        if (this.state.responsibility.replace(/\s/g, '').length ) {
            this.setState({
                responsibilities: [...this.state.responsibilities , { res: this.state.responsibility }],
                responsibility: ''
            });
        }
    }
    removeResponsibiliy(index) {
        var array = this.state.responsibilities;
        array.splice(index, 1);
        this.setState({ responsibilities: array });
    }
    submitHandle(e) {
        if (e.key === 'Enter') {
            this.handleResponsibilities();
            this.handleSkills();
            this.handleReqList();
        }
    }
    handleSkills() {
        if (this.state.skill) {
            this.setState({
                skills: [...this.state.skills, { skill: this.state.skill }],
                skill: ''
            });
        }
    }
    removeSkill(index) {
        var array = this.state.skills;
        array.splice(index, 1);
        this.setState({ skills: array });
    }

    handleReqList() {
        if (this.state.title && this.state.description) {
            this.setState({
                reqlist: [...this.state.reqlist, { title: this.state.title, description: this.state.description }],
                title: '',
                description: ''
            });
        }
    }
    removeReqListItem(index) {
        var array = this.state.reqlist;
        array.splice(index, 1);
        this.setState({ reqlist: array });
    }

    saveJob() {
        if (this.props.stateLogin.type === 'Company') {
            fetch('/company/addjob', {
                method: 'Post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    companyid: this.props.stateLogin.hashId,
                    about: this.state.aboutstudent,
                    responsibilities: this.state.responsibilities,
                    skills: this.state.skills,
                    reqlist: this.state.reqlist
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        if (data[0].resu === true) {
                            window.Materialize.toast("Job Successfully Created...", 3000, 'green');
                            this.setState({
                                skills: [],
                                responsibilities: [],
                                reqlist: [],
                                aboutstudent:' '
                            });
                        }
                        else {
                            window.Materialize.toast("Something went wrong please try again!", 3000, 'red');
                        }

                    }
                    else {
                        window.Materialize.toast("data length < 1", 3000, 'red')
                    }


                })
                .catch();
        }
    }

    render() {
        let collection;
        let skillcollection;
        let reqListCollection;
        if (this.state.responsibilities.length > 0) {
            collection = <Collection header='Responsibilities'>
                {this.state.responsibilities.map((input, index) =>
                    <CollectionItem key={index}>{input.res}
                        <i className="material-icons iconSkills md-18 right" onClick={() => this.removeResponsibiliy(index)}>delete</i>
                    </CollectionItem>
                )}
            </Collection>
        }
        if (this.state.skills.length > 0) {
            skillcollection = <Collection header='Skills'>
                {this.state.skills.map((skills, index) =>
                    <CollectionItem key={index}>{skills.skill}
                        <i className="material-icons iconSkills md-18 right" onClick={() => this.removeSkill(index)}>delete</i>
                    </CollectionItem>
                )}
            </Collection>
        }
        if (this.state.reqlist.length > 0) {
            reqListCollection = <Table responsive className="tblReq">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.reqlist.map((req, index) =>
                        <tr key={index}>
                            <td>{req.title}</td>
                            <td>{req.description}</td>
                            <td><i className="material-icons iconSkills md-18" onClick={() => this.removeReqListItem(index)}>delete</i></td>
                        </tr>
                    )}
                
                </tbody>
            </Table>
        }
        return (
            <div className="con">
                <br />
                <Row className="mainpagebox">
                    <h5 >Create New Job</h5>
                    <Input s={12} type="textarea" name="aboutstudent" value={this.state.aboutstudent} label="About you!" onChange={this.handleChange}>
                    </Input>
                    {collection}
                    <div className='inputNum1'>
                        <Input s={12} type="text" name="responsibility" label="Responsibility" value={this.state.responsibility} onChange={this.handleChange} onKeyPress={this.submitHandle}>
                        </Input>
                        <Button floating large waves='light' icon='add' onClick={() => this.handleResponsibilities()} className='green'></Button>
                    </div>
                    {skillcollection}
                    <div className='inputNum1'>
                        <Input s={12} type="text" name="skill" label="Skills" value={this.state.skill} onChange={this.handleChange} onKeyPress={this.submitHandle}>
                        </Input>
                        <Button floating large waves='light' icon='add' onClick={() => this.handleSkills()} className='green' ></Button>
                    </div>
                    {reqListCollection}
                    <div className='inputNum1'>
                        <Input s={4} type="text" name="title" label="Title" value={this.state.title} onChange={this.handleChange} onKeyPress={this.submitHandle}>
                        </Input>
                        <Input s={8} type="text" name="description" label="Description" value={this.state.description} onChange={this.handleChange} onKeyPress={this.submitHandle}>
                        </Input>
                        <Button floating large waves='light' icon='add' onClick={() => this.handleReqList()} className='green' ></Button>
                    </div>
                    <Button onClick={() => this.saveJob()} className='blue right' waves='light' >Save</Button>
                </Row>
                <br />
            </div>
        );
    }
}

export default NewJob;
