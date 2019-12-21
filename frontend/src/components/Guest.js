import React, {Component} from 'react';



class Guest extends Component {
    state = {
        date: new Date(),
    }

    onChange = date => this.setState({ date })

    render() {
        return (
            <div>
                SPADÓWKA
            </div>
        );
    }
}

export default Guest;
