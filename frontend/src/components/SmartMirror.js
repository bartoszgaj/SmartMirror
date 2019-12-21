import React, {Component} from 'react';
import LoggedUser from "./LoggedUser";
import Guest from "./Guest";



class SmartMirror extends Component {
    state = {
        user: false
    };

    onChange = user => this.setState({ user })

    render() {
        if (true) {
            return <LoggedUser/>
        }else
         {
            return <Guest/>
        }
    }
}

export default SmartMirror;
