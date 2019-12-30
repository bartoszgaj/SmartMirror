import React, {Component} from 'react';
import { Container } from "@material-ui/core";
import Weather from "./Weather";
import Calendar from "react-calendar";
import '../style/LoggedUser.css';
import Timer from "./Timer";
import Label from "./Label";
import Box from "@material-ui/core/Box";


class LoggedUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: "Kraków",
            currentWeather: {},
            forecast: [],
        };
    }

    componentDidMount() {
        this.setState({error: ""});
        this.getWeather(this.state.city);
    }

    handleResponse(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Error: Location " + response.statusText);
        }
    }

    getWeather(city) {
        fetch(
            `${process.env.REACT_APP_API_URL}/weather/?q=${city}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
        )
            .then(res => this.handleResponse(res))
            .then(weather => {
                if (Object.entries(weather).length) {
                    return this.mapDataToWeatherInterface(weather);
                }
            })
            .then(mappedData => this.getForecast(this.state.city, mappedData))
            .catch(error => {
                console.error(
                    `Error fetching current weather for ${this.state.city}: `,
                    error
                );
            });
    }

    getForecast(city, mappedData) {
        fetch(
            `${process.env.REACT_APP_API_URL}/forecast/?q=${city}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
        )
            .then(res => this.handleResponse(res))
            .then(result => {
                if (Object.entries(result).length) {
                    const forecast = [];
                    for (let i = 0; i < result.list.length; i += 8) {
                        forecast.push(this.mapDataToWeatherInterface(result.list[i + 4]));
                    }
                    this.setState({
                        currentWeather: mappedData,
                        forecast: forecast
                    });
                }
            })
            .catch(error => {
                console.error(
                    `Error fetching forecast for ${this.state.city}: `,
                    error
                );
                return [];
            });
    }

    mapDataToWeatherInterface = data => {
        const mapped = {
            city: data.name,
            country: data.sys.country,
            date: data.dt * 1000,
            humidity: data.main.humidity,
            icon_id: data.weather[0].id,
            temperature: data.main.temp,
            description: data.weather[0].description,
            wind_speed: Math.round(data.wind.speed * 3.6), // convert from m/s to km/h
            condition: data.cod
        };

        // Add extra properties for the five day forecast: dt_txt, icon, min, max
        if (data.dt_txt) {
            mapped.dt_txt = data.dt_txt;
        }

        if (data.weather[0].icon) {
            mapped.icon = data.weather[0].icon;
        }

        if (data.main.temp_min && data.main.temp_max) {
            mapped.max = data.main.temp_max;
            mapped.min = data.main.temp_min;
        }

        // remove undefined fields
        Object.keys(mapped).forEach(
            key => mapped[key] === undefined && delete data[key]
        );

        return mapped;
    };

    render() {
        const {currentWeather, forecast} = this.state;

        if (Object.keys(currentWeather).length || Object.keys(forecast).length) {
            return (
                <div>
                    <div className={"datetime"}>
                    <Timer/>
                    <Label/>
                    </div>

                    <div className={"calendar"}>
                    <Calendar/>
                    </div>
                    <div className={"weather"}>
                        <Weather
                            currentWeather={currentWeather}
                            forecast={forecast}
                        />
                    </div>
                </div>
            );
        } else {
            return null

        }
    }
}


export default LoggedUser;
