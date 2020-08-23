import React, { Component } from 'react';
import { Card, CardTitle } from 'react-materialize'



export class Home extends Component {
    render() {
        return (
            <div className="con">
                <Card className='small'
                    header={<CardTitle image="../images/HomeBanner.jpg">Home</CardTitle>}
                    actions={[<a key="dfd" href='/'>Click !!</a>]}>
                    I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.
                </Card>
            </div>
        );
    }
}

export default Home;
