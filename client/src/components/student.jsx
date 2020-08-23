import React, { Component } from 'react';
import { Col, Card, Table, Chip } from 'react-materialize';

class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentid: this.props.match.params.studentid,
            user: [],
            userinfo: {},
            userEducation: [],
            userSkills:[]
        };

    }
    componentDidMount() {
        this.getDatabyFilter();

    }
    getDatabyFilter() {
        fetch('/user/getStudentById', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stuID: this.state.studentid,
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    this.setState({
                        user: data[0],
                        userinfo: data[0].UserInfo[0],
                        userEducation: data[0].UserEducation,
                        userSkills:data[0].UserSkill
                    });
                }
                else {
                    this.props.history.push('/PageNotFound');
                }
            })
            .catch();
    }

    render() {
        let userInfo = this.state.userinfo;
        let userEdu = this.state.userEducation;
        let userSkills = this.state.userSkills;
        let userImage;
        let userProfession;
        var userInfoDetail;
        let userPersonalInfo;
        let userEducation;
        let userSkill;
        if (userInfo) {
            userInfoDetail = <div className="studentName">{userInfo.name}</div>;
        }
        if (this.state.user.first_n && userInfo) {
            userImage = <img src={`http://localhost:3001/images/${this.state.user.img_url}`} alt={this.state.user.img_url} className="studentDPimg" />;
            userProfession = <p className="skillSingle">{ userInfo.profession }</p>

            userPersonalInfo = <Table className="w90">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>{this.state.user.first_n.slice(0,1).toUpperCase() + this.state.user.first_n.slice(1, this.state.user.first_n.length)}</td>
                        <th>Cnic No</th>
                        <td>{userInfo.cnicno}</td>
                    </tr><tr>
                        <th>Contact No</th>
                        <td>{userInfo.cellno}</td>
                        <th>Email</th>
                        <td>{this.state.user.email}</td>
                    </tr><tr>
                        <th>Father Name</th>
                        <td>{this.state.user.last_n.slice(0, 1).toUpperCase() + this.state.user.last_n.slice(1, this.state.user.last_n.length)}</td>
                        <th>Father Cnic</th>
                        <td>{userInfo.fathercnicno}</td>
                    </tr><tr>
                        <th>Father Contact No</th>
                        <td>{userInfo.fathercellno}</td>
                        <th>DOB</th>
                        <td>{userInfo.dob}</td>
                    </tr><tr>
                        <th>Address</th>
                        <td>{userInfo.address}</td>
                    </tr><tr>
                        <th>About me!</th>
                        <td>{userInfo.aboutme}</td>
                    </tr>
                </tbody>
            </Table>;
        }
        if (userEdu) {
            userEducation = <Table responsive striped bordered centered className="w90">
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
                    {userEdu.map(edu => (
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
        }
        if (userSkills) {
            userSkill = <div className="w90">
                {userSkills.map(skill => (
                    <div key={skill._id}>
                        <Chip close={false} >
                            <div className="chipIcon">{skill.skillname.slice(0, 1).toUpperCase()}</div>
                            {skill.skillname}
                        </Chip>
                    </div>
                ))}
            </div>
        }
        return (
            <div className="con">
                <Col m={12} s={12}>
                    <Card className='white-grey w80'  /*actions={[<a key={1} href='#'>This is a link</a>]}*/>
                        <div className="studentDP">
                            {userImage}
                            {userInfoDetail}
                            <div className="lineBreaker"></div>
                        </div>
                        {userProfession}
                        <p className="desireWorkP w90">
                            Desire to work in a reputed organization where I can enhance my knowledge and mental skills by working with all my capacities.
                            Desire to work in a reputed organization where I can enhance my knowledge and mental skills by working.
                            Desire to work in a reputed organization where I can enhance my knowledge and mental skills by working with all my capacities.
                        </p>
                        <h5>Personal Information</h5>
                        {userPersonalInfo}
                        <h5>Education</h5>
                        {userEducation}
                        <h5>Skills</h5>
                        {userSkill}
                    </Card>
                </Col>
            </div>
        );
    }
}

export default Student;
