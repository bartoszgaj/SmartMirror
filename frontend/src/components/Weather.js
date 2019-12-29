import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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


import dayjs from "dayjs";
import * as weatherIcons from "./icons";
import * as recommendations from "./recommendations";

const useStyles = makeStyles(theme => ({
    root: {
        flexiGrow: 1,
        color: "white"
    },
    appBar: {
        background: "transparent",
        boxShadow: "none"
    },
    appLogo: {
        width: "160px"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: "white"
    },
    layout: {
        marginTop: "20px",
        background: "black"
    },
    card: {
        background: "black",
        minWidth: 600,
        minHeight: 600,
        color: "white"
    },
    wi: {
        color: "white",
    },
    atmospheric: {
        fontSize: "28px",
        padding: "5px",
        color: "white",
    },
    recommendation: {
        fontFamily: "Montserrat, sans-serif",
        padding: "20px 0px 10px 0px",
        fontSize: "26px",
        textAlign: "center",
        color: "white"
    },
    buttons: {
        color: "white"
    },
    list: {
        width: 400,
        color: "white",
    },
    fullList: {
        width: "auto",
        color: "white",

    },
    aboutImg: {
        padding: "30px 150px 0px 150px",
        width: "100px",
        color: "white"
    },
    aboutText: {
        fontFamily: "Montserrat",
        padding: "30px",
        color: "white"
    },
    container: {
        display: "flex",
        flexWrap: "wrap",
        color: "white"
    },
    search: {
        marginTop: "100px"
    },
    error: {
        color: "red",
        padding: "10px"
    }
}));

const AppLayout = props => {
    const classes = useStyles();

    return (
        <div className={classes.layout}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <WeatherCard
                        currentWeather={props.currentWeather}
                        forecast={props.forecast}
                        icon={props.icon}
                        recommendation={props.recommendation}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

const WeatherCardSubheader = props => {
    const date = dayjs().isValid(props.currentWeather.date)
        ? props.currentWeather.date
        : "";
    const description = props.currentWeather.description
        ? props.currentWeather.description
        : "";

    return (
        <span color={"white"}>
            {dayjs(date).format("dddd")}, {dayjs(date).format("h:mm")}{" "}
            {dayjs(date).format("A")},{" "}
            {description.replace(/\w\S*/g, txt => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })}
        </span>
    );
};

const Forecast = props => {
    const classes = useStyles();
    const prefix = "wi wi-";
    const result = props.forecast.map((item, index) => {
        const icon = prefix + weatherIcons.default[item.icon_id].icon;
        return (
            <ListItem key={index} className="forecastItem">
                <ListItemText
                    className="week-day"
                    primary={dayjs(item.dt_txt).format("dddd")}
                    style={{ flex: "1 1 0%", textAlign: "left",         color: "white"}}
                ></ListItemText>
                <IconButton disabled={true} aria-label="forecast icon">
          <span
              className={`${classes.wi} ${icon}`}
              style={{ fontSize: "24px" }}
          ></span>
                </IconButton>
                <span className="temp" style={{ flex: "1 1 0%", textAlign: "right" }}>
          <Typography variant="body2" component="span" color="white">
            {Math.round(item.min)}&deg; /{" "}
          </Typography>
          <Typography variant="body2" component="span" color="white">
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
    const classes = useStyles();
    const humidity = "wi wi-humidity";
    const strongWind = "wi wi-strong-wind";

    return (
        <Card className={classes.card}>
            <CardHeader
                title={props.currentWeather.city + ", " + props.currentWeather.country}
                subheader={
                    <WeatherCardSubheader currentWeather={props.currentWeather}/>
                }
            />
            <CardContent>
                <CardMedia
                    className={`${props.icon} ${classes.wi}`}
                    src={props.icon}
                    style={{ fontSize: "128px", float: "right" }}
                />
                <Typography
                    variant="h2"
                    className="big-temp"
                    color="textPrimary"
                    component="h2"
                    style={{ fontFamily: "Montserrat", paddingTop: "30px",         color: "white"}}
                >
                    {Math.round(props.currentWeather.temperature)}&deg;C
                </Typography>
                <Typography
                    variant="subtitle2"
                    className="atmospheric-conditions"
                    color="white"
                    gutterBottom
                    style={{ paddingTop: "40px" ,        color: "white"}}
                >
          <span
              className={`${strongWind} ${classes.wi} ${classes.atmospheric}`}
          ></span>
                    {props.currentWeather.wind_speed} km/h Winds{" "}
                    <span
                        className={`${humidity} ${classes.wi} ${classes.atmospheric}`}
                    ></span>
                    {props.currentWeather.humidity}% Humidity
                </Typography>
                <Typography
                    className={`${classes.recommendation} recommendation`}
                    color="white"
                    gutterBottom
                >
                    {props.recommendation}
                </Typography>
                <Divider variant="middle" />
                <Forecast forecast={props.forecast} />
            </CardContent>
        </Card>
    );
};

class Weather extends React.Component {
    render() {
        const { currentWeather, forecast } = this.props;
        const prefix = "wi wi-";
        const icon =
            prefix + weatherIcons.default[this.props.currentWeather.icon_id].icon;
        const recommendation =
            recommendations.default[this.props.currentWeather.icon_id].recommendation;

        return (
            <div>
                <AppLayout
                    currentWeather={currentWeather}
                    forecast={forecast}
                    icon={icon}
                    recommendation={recommendation}
                />
            </div>
        );
    }
}

export default Weather;
