import React, {Component} from 'react';
import LoggedUser from "./LoggedUser";



class SmartMirror extends Component {
    ws = new WebSocket('ws://localhost:8080/ws');

    state = {
        recognitions: {names: []},
    };

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('connected')
        };

        this.ws.onmessage = evt => {
            // listen to data sent from the websocket server
            const message = JSON.parse(evt.data)
            this.setState({recognitions: message})
        };

        this.ws.onclose = () => {
            console.log('disconnected')
        }
    }

    render() {
        if (this.state.recognitions.names.length > 0) {
            if (this.state.recognitions.names.filter(function (el) {
                return el !== "Unknown"
            }).length > 0) {
                return <LoggedUser/>
            } else {
                return <LoggedUser/>
            }
        } else {
            return  <LoggedUser/>;
        }
    }
}

export default SmartMirror;
