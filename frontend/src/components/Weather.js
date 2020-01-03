import React from "react";
import 'dayjs/locale/pl'

import {
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@material-ui/core";
import '../style/Weather.css'


import dayjs from "dayjs";
import * as weatherIcons from "./icons";


const AppLayout = props => {

    return (
        <div className="layout">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <WeatherCard
                        currentWeather={props.currentWeather}
                        forecast={props.forecast}
                        icon={props.icon}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

const Forecast = props => {
    const prefix = "wi wi-";
    const result = props.forecast.map((item, index) => {
        const icon = prefix + weatherIcons.default[item.icon_id].icon;
        return (
            <ListItem key={index} className="forecastItem">
                <ListItemText
                    className="week-day"
                    primary={dayjs(item.dt_txt).format("dddd")}
                    style={{flex: "1 1 0%", textAlign: "left", color: "white"}}
                ></ListItemText>
                <IconButton disabled={true} aria-label="forecast icon">
          <span
              className={`wi ${icon}`}
              style={{fontSize: "24px"}}
          ></span>
                </IconButton>
                <span className="temp" style={{flex: "1 1 0%", textAlign: "right"}}>
          <Typography variant="body2" component="span">
            {Math.round(item.min)}&deg; /{" "}
          </Typography>
          <Typography variant="body2" component="span">
            {Math.round(item.max)}&deg;
          </Typography>
        </span>
            </ListItem>
        );
    });

    return (
        <List component="nav" aria-label="forecast data">
            {result}
        </List>
    );
};

const WeatherCard = props => {
    const humidity = "wi wi-humidity";
    const strongWind = "wi wi-strong-wind";

    return (
        <Card className="card">
            <CardHeader
                title={props.currentWeather.city + ", " + props.currentWeather.country}
            />
            <CardContent>
                <CardMedia
                    className={`${props.icon} wi`}
                    src={props.icon}
                    style={{fontSize: "128px", float: "right"}}
                />
                <Typography
                    variant="h2"
                    className="big-temp"
                    color="textPrimary"
                    component="h2"
                    style={{fontFamily: "Montserrat", paddingTop: "30px", color: "white"}}
                >
                    {Math.round(props.currentWeather.temperature)}&deg;C
                </Typography>
                <Typography
                    variant="subtitle2"
                    className="atmospheric-conditions"
                    gutterBottom
                    style={{paddingTop: "40px", color: "white"}}
                >
          <span
              className={`${strongWind} wi atmospheric`}
          ></span>
                    {props.currentWeather.wind_speed} km/h Wiatr{" "}
                    <span
                        className={`${humidity} wi atmospheric`}
                    ></span>
                    {props.currentWeather.humidity}% Wilgotność
                </Typography>
                <Divider variant="middle"/>
                <Forecast forecast={props.forecast}/>
            </CardContent>
        </Card>
    );
};

class Weather extends React.Component {
    render() {
        const {currentWeather, forecast} = this.props;
        const prefix = "wi wi-";
        const icon =
            prefix + weatherIcons.default[this.props.currentWeather.icon_id].icon;

        return (
            <div>
                <AppLayout
                    currentWeather={currentWeather}
                    forecast={forecast}
                    icon={icon}
                />
            </div>
        );
    }
}

export default Weather;
