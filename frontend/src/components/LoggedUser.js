import React, {Component} from 'react';
import Calendar from 'react-calendar';
import ReactWeather from 'react-open-weather';


class LoggedUser extends Component {
    state = {
        date: new Date(),
    }

    onChange = date => this.setState({ date })

    render() {
        return (
            <div>
                <Calendar
                    onChange={this.onChange}
                    value={this.state.date}
                />
                <ReactWeather
                    forecast="today"
                    apikey="874e39d58833e1679ca12bf5a4fbf35e"
                    type="city"
                    city="Munich"/>
            </div>
        );
    }
}

export default LoggedUser;
