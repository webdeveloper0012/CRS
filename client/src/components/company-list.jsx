import React, { Component } from 'react';
import { Table, Button, Collapsible, CollapsibleItem } from 'react-materialize';

class CompanyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companylist: []
        };
    }

    componentWillMount() {
        this.getAllCompanies();
    }
    getAllCompanies() {
        fetch('/user/getAllCompany', {
            method: 'Get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    this.setState({
                        companylist: data
                    });
                }
                else {
                    window.Materialize.toast("No Student Available!", 3000, 'red');
                }
            })
            .catch();
    }
    viewCompany(companyID) {
        window.Materialize.toast("company Id " + companyID, 3000, 'red');
    }

    render() {
        return (
            <div className="con ">
                <Collapsible accordion defaultActiveKey={1}>
                    <CollapsibleItem header='' icon='sort'>
                        Lorem ipsum dolor sit amet.
                </CollapsibleItem>
                </Collapsible>
                <Table hoverable responsive striped bordered centered >
                    <thead>
                        <tr>
                           
                            <th>Name</th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.companylist.map(company => (
                            <tr key={company._id}>
                               
                                <td>{company.first_n}</td>
                                <td>{company.username}</td>
                                <td>{company.email}</td>
                                <td><Button waves='yellow' className="red" onClick={() => this.viewCompany(company._id)}>View</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default CompanyList;
