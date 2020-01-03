import React, {Component} from 'react';

class Label extends Component {

    render() {
        return (
        <div>
            Witaj {this.props.users}!
        </div>
        );
    }
}

export default Label