import axios from "axios";
let apiKey = "";

const API = {
    coordenadasCiudad: async (ciudad, estado) => {
        try {
            const respuesta = await axios.get(
                `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${estado}&limit=1&appid=${apiKey}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return respuesta;
        } catch (error) {
            return error;
        }
    },

    climaActual: async (latitud, longitud) => {
        try {
            const respuesta = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${apiKey}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return respuesta;
        } catch (error) {
            return error;
        }
    },

    clima5Dias: async (latitud, longitud) => {
        try {
            const respuesta = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${latitud}&lon=${longitud}&appid=${apiKey}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return respuesta;
        } catch (error) {
            return error;
        }
    },
};

export default API;
