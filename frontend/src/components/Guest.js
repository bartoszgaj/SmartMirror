import React, {Component} from 'react';
import '../style/Guest.css'

class Guest extends Component {

    render() {
        return (
            <div className={"unauthorized"}>
                YOU ARE UNAUTHORIZED TO VIEW THIS CONTENT
            </div>
        );
    }
}

export default Guest;
