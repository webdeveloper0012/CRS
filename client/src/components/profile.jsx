import React, { Component } from 'react';
import { Row, Input, Button, Icon, Card, CardTitle} from 'react-materialize';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyname: ' ',
            since: ' ',
            empno   : ' ',
            phoneno: ' ',
            faxid: ' ',
            websiteurl: ' ',
            comptype: ' ',
            aboutcomp: ' ',
            compaddress: ' ',
            vision:' ',
            services: ' ',
            history:' ',
            file: null,
            filename:null

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.onSubmitCompantInfo = this.onSubmitCompantInfo.bind(this);
        this.onRemoveImage = this.onRemoveImage.bind(this);
        this.getCompanyInfo();
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleChangeFile(event) {
        this.setState({ file: event.target.files[0] });
    }

    getCompanyInfo() {
        fetch('/company/getCompanyInfo', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                companyid: this.props.stateLogin.hashId,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    let d = data[0];
                    this.setState({
                        companyname: d.companyname,
                        since: d.since,
                        empno: d.empno,
                        phoneno: d.phoneno,
                        faxid: d.faxid,
                        websiteurl: d.websiteurl,
                        comptype: d.comptype,
                        aboutcomp: d.aboutcomp,
                        compaddress: d.compaddress,
                        vision: d.vision,
                        services: d.services,
                        history: d.history,
                        filename: d.file

                    });
                }
                else {
                    this.props.history.push('/PageNotFound');
                }
            })
            .catch();
    }
    onSubmitCompantInfo() {
        this.updateCompanyInfo();
    }
    updateCompanyInfo() {
        let form = new FormData(this.refs.myForm);
        form.append('companyid', this.props.stateLogin.hashId);

        form.append('companyname', this.state.companyname);
        form.append('since', this.state.since);
        form.append('empno', this.state.empno);
        form.append('phoneno', this.state.phoneno);
        form.append('faxid', this.state.faxid);
        form.append('websiteurl', this.state.websiteurl);
        form.append('comptype', this.state.comptype);
        form.append('aboutcomp', this.state.aboutcomp);
        form.append('compaddress', this.state.compaddress);
        form.append('vision', this.state.vision);
        form.append('services', this.state.services);
        form.append('history', this.state.history);
        form.append('file', this.state.file);
        form.append('oldfile', this.state.filename);
        fetch('/company/updateCompanyInfo', {
            method: 'POST',
            body: form
        }).then(res => res.json())
            .then(data => {
                if (data.msg === "true") {
                    window.Materialize.toast("Data Added Successfully! ", 3000, 'green');
                    this.getCompanyInfo();
                }
                else {
                    window.Materialize.toast("Something went wrong please try again!", 3000, 'red');
                }
            })
    }
    onRemoveImage() {
        this.setState({
            filename:null
        });
    }


    render() {
        let img;
        let filename1 = "Select file";
        if (this.state.file !== null) {
            filename1 = this.state.file.name;
        }
        if (this.state.filename) {
            img = 'http://localhost:3001/images/'+ this.state.filename;
        }
        else {
            img = '../images/abc1.png';
        }
   
        return (
            <div className="con">
       
                <Row className="w80" >
                    <Card className='small'
                        header={<CardTitle image={img}>{this.state.companyname}</CardTitle>}>
                        {this.state.comptype}
                </Card>
                    <Input s={12} l={4} name="companyname" type="text" label="Company Name" value={this.state.companyname} onChange={this.handleChange}>
                        <Icon>group_work</Icon>
                    </Input>
                    <Input s={12} l={4} name="since" type="text" label="Since" value={this.state.since} onChange={this.handleChange}>
                        <Icon>date_range</Icon>
                    </Input>
                    <Input s={12} l={4} name="empno" type="text" label="Number of Employees" value={this.state.empno} onChange={this.handleChange}>
                        <Icon>looks_6</Icon>
                    </Input>

                    <Input s={12} l={4} name="phoneno" type="text" label="Phone Number" value={this.state.phoneno} onChange={this.handleChange}>
                        <Icon>local_phone</Icon>
                    </Input>
                    <Input s={12} l={4} name="faxid" type="text" label="FAX" value={this.state.faxid} onChange={this.handleChange}>
                        <Icon>mail</Icon>
                    </Input>
                    <Input s={12} l={4} name="websiteurl" type="text" label="Website" value={this.state.websiteurl} onChange={this.handleChange}>
                        <Icon>web</Icon>
                    </Input>

                    <Input s={12} type="text" name="comptype" label="Company Type" value={this.state.comptype} onChange={this.handleChange}>
                        <Icon>add_location</Icon>
                    </Input>

                    <Input s={12} type="text" name="compaddress" label="Company Office Location" value={this.state.compaddress} onChange={this.handleChange}>
                        <Icon>add_location</Icon>
                    </Input>

                    <Input s={12} type="textarea" name="aboutcomp" label="About Us" value ={this.state.aboutcomp} onChange={this.handleChange}>
                        <Icon>info</Icon>
                    </Input>

                    <Input s={12} type="textarea" name="vision" label="Description of the business including the mission and/or vision" value={this.state.vision} onChange={this.handleChange}>
                        <Icon>visibility</Icon>
                    </Input>

                    <Input s={12} type="textarea" name="services" label="Description of services" value ={this.state.services} onChange={this.handleChange}>
                        <Icon>verified_user</Icon>
                    </Input>

                    <Input s={12} type="textarea" name="history" label="Company History" value ={this.state.history} onChange={this.handleChange}>
                        <Icon>history</Icon>
                    </Input>

                    <div className="selectFileDiv">
                        <label className="file_input marIcon">
                            <i className="material-icons ">file_upload</i>
                            <Input id="file_input_file" className="none" type="file" onChange={this.handleChangeFile} />
                        </label>
                        <Input className="file_input_text" type="text" readOnly id="file_input_text" value={filename1} />
                    </div>

                    <Button waves='yellow' className="red" onClick={this.onSubmitCompantInfo}>Submit</Button>
                </Row>
            </div>
        );
    }
}

export default Profile;
