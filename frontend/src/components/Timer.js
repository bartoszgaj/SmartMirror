import React, {Component} from 'react';
import Clock from "react-live-clock";
import 'dayjs/locale/pl'
import dayjs from "dayjs";

class Timer extends Component {
    render() {
        dayjs.locale("pl");

        return (
            <div>
                <Clock format={'HH:mm:ss'} ticking={true} timezone={'Europe/Warsaw'} />
                <div className={"date"}>{dayjs(new Date().getTime()).format("D MMMM YYYY")}</div>
            </div>
        );
    }
}

export default Timer