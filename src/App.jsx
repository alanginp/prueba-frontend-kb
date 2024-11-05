import React, { useState, useEffect, useRef } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "/node_modules/primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "./App.css";
import callClima from "./api/clima";

// DATA -----------------------------
import { estadosMx } from "./data/estadosMx";
import { ciudadesMx } from "./data/ciudadesMx";
import { tiposClimasMx } from "./data/tiposClimasMx";

// COMPONETES -----------------------------
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { TabView, TabPanel } from "primereact/tabview";
import { Chart } from "primereact/chart";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

// ICONS -----------------------------
import { IconField } from "primereact/iconfield";
import { WiStrongWind } from "react-icons/wi";
import { WiHumidity } from "react-icons/wi";
import { WiThermometer } from "react-icons/wi";

function App() {
    //Valores Inputs ---------------------
    const [estados, setEstados] = useState(estadosMx);
    const [ciudades, setCiudades] = useState(ciudadesMx);
    const [valorEstado, setValorEstado] = useState(null);
    const [valorCiudad, setValorCiudad] = useState(null);
    const [valorCiudadSelect, setValorCiudadSelect] = useState(null);
    const [loadingButtonClima, setLoadingButtonClima] = useState(false);
    //Valores Favoritos
    const [verFavoritoB, setverFavoritoB] = useState(false);
    const [infoClima, setInfoClima] = useState(false);
    const [valorFavoritosSelect, setValorFavoritosSelect] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [tieneFavoritos, setTieneFavoritos] = useState(false);
    const [ciudadFav, setCiudadFav] = useState(null);
    const [estadoFav, setEstadoFav] = useState(null);
    const [nombreCiudadFavoritos, setNombreCiudadFavoritos] = useState(false);

    //Data Clima ---------------------
    const [tiposClimas, setTiposClimas] = useState(tiposClimasMx);
    const [dataClimaActual, setDataClimaActual] = useState([]);
    const [dataClima, setDataClima] = useState([]);
    const [isDataClima, setIsDataClima] = useState(false);
    const [dataClimaDias, setDataClimaDias] = useState([]);
    const [dataClimaFechas, setDataClimaFechas] = useState([]);
    const [dataClimaDiasTemp, setDataClimaDiasTemp] = useState([]);
    const [dataClimaDiasTempMin, setDataClimaDiasTempMin] = useState([]);
    const [dataClimaDiasTempMax, setDataClimaDiasTempMax] = useState([]);
    const [dataClimaDiasSensTerm, setDataClimaDiasSensTerm] = useState([]);
    const [dataClimaDiasHumedad, setDataClimaDiasHumedad] = useState([]);
    const [dataClimaDiasViento, setDataClimaDiasViento] = useState([]);

    //Valores Clima Actual ---------------------
    const [tipoClima, setTipoClima] = useState("");
    const [tempActual, setTempActual] = useState(null);
    const [tempActMin, setTempActMin] = useState(null);
    const [tempActMax, setTempActMax] = useState(null);
    const [termicaActual, setTermicaActual] = useState(null);
    const [humedadActual, setHumedadActual] = useState(null);
    const [vientoActual, setVientoActual] = useState(null);
    const [iconClima, setIconClima] = useState(null);

    // DATA Graficas ---------------------
    // Data Grafica Temperatura
    const [chartDataTemp, setChartDataTemp] = useState({});
    const [chartOptionsTemp, setChartOptionsTemp] = useState({});
    // Data Grafica Sensación Termica
    const [chartDataSensTerm, setChartDataSensTerm] = useState({});
    const [chartOptionsSensTerm, setChartOptionsSensTerm] = useState({});
    // Data Grafica Humedad
    const [chartDataHume, setChartDataHume] = useState({});
    const [chartOptionsHume, setChartOptionsHume] = useState({});
    // Data Grafica Viento
    const [chartDataVien, setChartDataVien] = useState({});
    const [chartOptionsVien, setChartOptionsVien] = useState({});

    // Dialogs   ---------------------
    // Mensajes
    const [agregadoFavoritos, setAgregadoFavoritos] = useState(false);
    const [cdExistenteFavoritos, setCdExistenteFavoritos] = useState(false);
    const [borrarFavoritos, setBorrarFavoritos] = useState(false);
    // Errores
    const [error401, setError401] = useState(false); //ERROR EN API KEY
    const [error404, setError404] = useState(false); //NO HAY CIUDAD O ESTADO CON LOS PARAMETROS SELECCIOANDOS
    const [error429, setError429] = useState(false); //SE SUPERARON ALS PETICIONES PERMITIDAS
    const [errorData, setErrorData] = useState(false); //EL API NO REGRESO DATA

    useEffect(() => {
        setverFavoritoB(false);
        setValorFavoritosSelect(null);
        setValorCiudadSelect(null);
        setIsDataClima(false);
        setValorEstado("");
    }, []);

    useEffect(() => {
        const savedFavoritos = JSON.parse(localStorage.getItem("favoritos"));
        if (savedFavoritos) {
            setFavoritos(savedFavoritos);
            setTieneFavoritos(savedFavoritos.length > 0);
        }
    }, []);

    useEffect(() => {
        setValorCiudadSelect(null);
        setverFavoritoB(false);
        setInfoClima(false);
        setIsDataClima(false);
        if (valorEstado !== null) {
            setValorCiudad(ciudades[0][valorEstado.nombre]);
        }
    }, [valorEstado]);

    useEffect(() => {
        if (valorCiudadSelect !== null) {
            setverFavoritoB(true);
            setIsDataClima(false);
        }
    }, [valorCiudadSelect]);

    useEffect(() => {
        if (valorFavoritosSelect !== null) {
            setIsDataClima(false);
        }
    }, [valorFavoritosSelect]);

    useEffect(() => {
        if (dataClima != "") {
            creaGraficaTemp();
            creaGraficaHume();
            creaGraficaSensTerm();
            creaGraficaVien();
            setIsDataClima(true);
        }
    }, [dataClima]);

    const estadoSeleccionado = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.nombre}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const estadoOpcion = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.nombre}</div>
            </div>
        );
    };

    const ciudadesSelect = (valorCiudadSelect, props) => {
        if (valorCiudadSelect) {
            return (
                <div className="flex align-items-center">
                    <div>{valorCiudadSelect}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const ciudadesOpcion = (valorCiudadSelect) => {
        return (
            <div className="flex align-items-center">
                <div>{valorCiudadSelect}</div>
            </div>
        );
    };

    const favoritosSelect = (favoritos, props) => {
        if (favoritos) {
            return (
                <div className="flex align-items-center">
                    <div className="flex align-items-center">
                        <div>{favoritos}</div>
                    </div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const favoritosOpcion = (favoritos) => {
        return (
            <div className="flex align-items-center">
                <div className="flex align-items-center">
                    <div>{favoritos}</div>
                </div>
            </div>
        );
    };

    const agregarFavoritos = () => {
        const entrada = `${valorCiudadSelect}, ${valorEstado.nombre}`;
        if (favoritos.includes(entrada)) {
            setCdExistenteFavoritos(true);
        } else {
            const nuevosFavoritos = [...favoritos, entrada];
            setFavoritos(nuevosFavoritos);
            setTieneFavoritos(nuevosFavoritos.length > 0);
            localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
            setAgregadoFavoritos(true);
            setValorFavoritosSelect(null);
        }
    };

    const footerNuevoFav = (
        <div>
            <Button
                label="Aceptar"
                onClick={() => setAgregadoFavoritos(false)}
            />
        </div>
    );

    const footerNoFav = (
        <div>
            <Button
                label="Aceptar"
                onClick={() => setCdExistenteFavoritos(false)}
            />
        </div>
    );

    const eliminarFavoritoDialog = (valorFavoritosSelect) => {
        if (valorFavoritosSelect != null) {
            setBorrarFavoritos(true);
        } else {
            msgsFav.current.clear();
            errorFav();
        }
    };

    const eliminarFavorito = (valorFavoritosSelect) => {
        if (valorFavoritosSelect != null) {
            const nuevosFavoritos = favoritos.filter(
                (favorito) => favorito !== valorFavoritosSelect
            );
            setFavoritos(nuevosFavoritos);
            setTieneFavoritos(nuevosFavoritos.length > 0);
            localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
            setBorrarFavoritos(false);
            setIsDataClima(false);
            setValorFavoritosSelect(null);
        } else {
            msgsFav.current.clear();
            errorFav();
        }
    };

    const footereliminarFav = (
        <div>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setBorrarFavoritos(false)}
                className="p-button-text"
                autoFocus
            />
            <Button
                label="Si"
                icon="pi pi-check"
                onClick={() => eliminarFavorito(valorFavoritosSelect)}
                severity="danger"
            />
        </div>
    );

    const msgs = useRef(null);
    const errorEstado = () => {
        msgs.current.show([
            {
                severity: "error",
                summary: "Error",
                detail: "Por favor selecciona un Estado.",
                sticky: true,
                closable: false,
            },
        ]);
        setTimeout(() => {
            msgs.current.clear();
            setLoadingButtonClima(false);
        }, 2000);
    };
    const errorCiudad = () => {
        msgs.current.show([
            {
                severity: "error",
                summary: "Error",
                detail: "Por favor selecciona una Ciudad.",
                sticky: true,
                closable: false,
            },
        ]);
        setTimeout(() => {
            msgs.current.clear();
            setLoadingButtonClima(false);
        }, 2000);
    };

    const msgsFav = useRef(null);

    const errorFav = () => {
        msgsFav.current.show([
            {
                severity: "error",
                summary: "Error",
                detail: "Por favor selecciona una Ciudad de tus Favoritos.",
                sticky: true,
                closable: false,
            },
        ]);
        setTimeout(() => {
            msgsFav.current.clear();
            setLoadingButtonClima(false);
        }, 2000);
    };

    const verClima = async () => {
        setLoadingButtonClima(true);
        if (valorEstado != "") {
            if (valorCiudadSelect != null) {
                setNombreCiudadFavoritos(false);
                const verGeoCiudad = await callClima.coordenadasCiudad(
                    valorCiudadSelect,
                    valorEstado.nombre
                );
                if (verGeoCiudad.status === 401) {
                    setError401(true);
                    setLoadingButtonClima(false);
                } else if (verGeoCiudad.status === 404) {
                    setError404(true);
                    setLoadingButtonClima(false);
                } else if (verGeoCiudad.status === 429) {
                    setError429(true);
                    setLoadingButtonClima(false);
                } else {
                    if (verGeoCiudad.data.length === 0) {
                        setErrorData(true);
                        setLoadingButtonClima(false);
                    } else {
                        let latitud = verGeoCiudad.data[0].lat;
                        let longitud = verGeoCiudad.data[0].lon;
                        verClimaActual(latitud, longitud);
                    }
                }
            } else {
                msgs.current.clear();
                errorCiudad();
            }
        } else {
            msgs.current.clear();
            errorEstado();
        }
    };

    const verClimaActual = async (latitud, longitud) => {
        const verClimaCdActual = await callClima.climaActual(latitud, longitud);
        if (verClimaCdActual.status === 401) {
            setError401(true);
            setLoadingButtonClima(false);
        } else if (verClimaCdActual.status === 404) {
            setError404(true);
            setLoadingButtonClima(false);
        } else if (verClimaCdActual.status === 429) {
            setError429(true);
            setLoadingButtonClima(false);
        } else if (verClimaCdActual.status === 200) {
            setDataClimaActual(verClimaCdActual.data);

            // Temperatura el día de Hoy ------------------
            let tem = verClimaCdActual.data.main.temp - 273.15;
            let temMin = verClimaCdActual.data.main.temp_min - 273.15;
            let temMax = verClimaCdActual.data.main.temp_max - 273.15;
            let sTermica = verClimaCdActual.data.main.feels_like - 273.15;
            let humedad = verClimaCdActual.data.main.humidity;
            let viento = verClimaCdActual.data.wind.speed * 1.609;
            let iconClima = `https://openweathermap.org/img/wn/${verClimaCdActual.data.weather[0].icon}.png`;

            setTipoClima(verClimaCdActual.data.weather[0].description);
            setTempActual(tem.toFixed(0));
            setTermicaActual(sTermica.toFixed(0));
            setHumedadActual(humedad);
            setVientoActual(viento.toFixed(0));
            setIconClima(iconClima);
            setTempActMin(temMin.toFixed(0));
            setTempActMax(temMax.toFixed(0));
            setLoadingButtonClima(false);
            verClimaCincoDias(latitud, longitud);
        }
    };

    const verClimaCincoDias = async (latitud, longitud) => {
        const verClimaCd = await callClima.clima5Dias(latitud, longitud);
        if (verClimaCd.status === 401) {
            setError401(true);
            setLoadingButtonClima(false);
        } else if (verClimaCd.status === 404) {
            setError404(true);
            setLoadingButtonClima(false);
        } else if (verClimaCd.status === 429) {
            setError429(true);
            setLoadingButtonClima(false);
        } else if (verClimaCd.status === 200) {
            setDataClima(verClimaCd.data.list);

            const climaPorDia = {};
            verClimaCd.data.list.forEach((entrada) => {
                const dateTime = entrada.dt_txt;
                const [date, time] = dateTime.split(" ");

                if (time === "12:00:00" && !climaPorDia[date]) {
                    climaPorDia[date] = {
                        temperatura: entrada.main.temp,
                        temperaturaMin: entrada.main.temp_min,
                        temperaturaMax: entrada.main.temp_max,
                        sensacionTerm: entrada.main.feels_like,
                        humedad: entrada.main.humidity,
                        climaIcon: entrada.weather[0].icon,
                        viento: entrada.wind.speed,
                        tipoClima: entrada.weather[0].description,
                    };
                }
            });
            const climaDataChart = Object.entries(climaPorDia)
                .slice(0, 5)
                .map(([date, weather]) => ({
                    date,
                    ...weather,
                }));

            // Fecha ultimos 5 dias ------------------
            let temperaturaFechas = climaDataChart
                .slice(0)
                .map((obj) => obj.date);
            setDataClimaFechas(temperaturaFechas);
            // Temperatura Minima 5 dias ------------------
            let temperaturaMinDays = climaDataChart
                .slice(0)
                .map((obj) => Math.floor(obj.temperaturaMin - 273.15));
            setDataClimaDiasTempMin(temperaturaMinDays);
            // Temperatura Maxima 5 dias ------------------
            let temperaturaMaxDays = climaDataChart
                .slice(0)
                .map((obj) => Math.ceil(obj.temperaturaMax - 273.15));
            setDataClimaDiasTempMax(temperaturaMaxDays);
            // Humedad 5 dias ------------------
            let humedadDays = climaDataChart.slice(0).map((obj) => obj.humedad);
            setDataClimaDiasHumedad(humedadDays);
            // Sensacion Termica 5 dias ------------------
            let sensTermDays = climaDataChart
                .slice(0)
                .map((obj) => Math.ceil(obj.sensacionTerm - 273.15));
            setDataClimaDiasSensTerm(sensTermDays);
            // Viento 5 dias ------------------
            let vientoDays = climaDataChart.slice(0).map((obj) => obj.viento);
            setDataClimaDiasViento(vientoDays);
            setLoadingButtonClima(false);
        }
    };

    const verClimaFav = async () => {
        setLoadingButtonClima(true);
        if (valorFavoritosSelect != null) {
            const [ciudadSeparada, estadoSeparado] =
                valorFavoritosSelect.split(", ");
            let nameCiudadFav = ciudadSeparada;
            let nameEstadoFav = estadoSeparado;
            setCiudadFav(nameCiudadFav);
            setEstadoFav(nameEstadoFav);
            setNombreCiudadFavoritos(true);
            const verGeoCiudad = await callClima.coordenadasCiudad(
                nameCiudadFav,
                nameEstadoFav
            );
            if (verGeoCiudad.status === 401) {
                setError401(true);
                setLoadingButtonClima(false);
            } else if (verGeoCiudad.status === 404) {
                setError404(true);
                setLoadingButtonClima(false);
            } else if (verGeoCiudad.status === 429) {
                setError429(true);
                setLoadingButtonClima(false);
            } else {
                if (verGeoCiudad.data.length === 0) {
                    setErrorData(true);
                    setLoadingButtonClima(false);
                } else {
                    let latitud = verGeoCiudad.data[0].lat;
                    let longitud = verGeoCiudad.data[0].lon;
                    verClimaActual(latitud, longitud);
                }
            }
        } else {
            msgsFav.current.clear();
            errorFav();
        }
    };

    const creaGraficaTemp = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
            "--text-color-secondary"
        );
        const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border");
        const data = {
            labels: dataClimaFechas,
            datasets: [
                {
                    label: "Temperatura Minima",
                    data: dataClimaDiasTempMin,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue("--blue-500"),
                    tension: 0.4,
                },
                {
                    label: "Temperatura Máxima",
                    data: dataClimaDiasTempMax,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue("--red-500"),
                    tension: 0.4,
                },
            ],
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                    beginAtZero: true,
                },
            },
        };

        setChartDataTemp(data);
        setChartOptionsTemp(options);
    };

    const creaGraficaSensTerm = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
            "--text-color-secondary"
        );
        const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border");
        const data = {
            labels: dataClimaFechas,
            datasets: [
                {
                    label: "Sensación Térmica",
                    data: dataClimaDiasSensTerm,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue("--purple-500"),
                    tension: 0.4,
                },
            ],
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                    beginAtZero: true,
                },
            },
        };

        setChartDataSensTerm(data);
        setChartOptionsSensTerm(options);
    };

    const creaGraficaHume = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
            "--text-color-secondary"
        );
        const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border");
        const data = {
            labels: dataClimaFechas,
            datasets: [
                {
                    label: "Humedad",
                    data: dataClimaDiasHumedad,
                    fill: false,
                    borderColor:
                        documentStyle.getPropertyValue("--primary-500"),
                    tension: 0.4,
                },
            ],
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                    beginAtZero: true,
                },
            },
        };

        setChartDataHume(data);
        setChartOptionsHume(options);
    };

    const creaGraficaVien = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
            "--text-color-secondary"
        );
        const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border");
        const data = {
            labels: dataClimaFechas,
            datasets: [
                {
                    label: "Velocidad del Viento",
                    data: dataClimaDiasViento,
                    fill: false,
                    borderColor:
                        documentStyle.getPropertyValue("--bluegray-500"),
                    tension: 0.4,
                },
            ],
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                    beginAtZero: true,
                },
            },
        };

        setChartDataVien(data);
        setChartOptionsVien(options);
    };

    return (
        <>
            <div className="card">
                <div className="col-12">
                    <div className="flex align-items-center  w-full">
                        <p className="text-3xl">
                            Prueba Técnica FrontEnd Developer Kapital Bank -
                            Alan G. Nava Parra
                        </p>
                    </div>
                    <div className=" p-1 border-round-sm  ">
                        <div className="grid">
                            <div className="col-12 md:col-8 lg:col-8 xl:col-8">
                                <div className="card mb-0">
                                    <div className="col-12 font-bold">
                                        <label>
                                            Selecciona un Estado y una Ciudad:
                                        </label>
                                    </div>
                                    <div className="formgrid grid">
                                        <div className="field col">
                                            <Dropdown
                                                value={valorEstado}
                                                onChange={(e) =>
                                                    setValorEstado(e.value)
                                                }
                                                options={estados}
                                                optionLabel="nombre"
                                                placeholder="Selecciona un estado"
                                                filter
                                                valueTemplate={
                                                    estadoSeleccionado
                                                }
                                                itemTemplate={estadoOpcion}
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="field col">
                                            <Dropdown
                                                value={valorCiudadSelect}
                                                onChange={(e) =>
                                                    setValorCiudadSelect(
                                                        e.value
                                                    )
                                                }
                                                options={valorCiudad}
                                                optionLabel="ciudadMunicipio"
                                                placeholder="Selecciona una Ciudad"
                                                filter
                                                valueTemplate={ciudadesSelect}
                                                itemTemplate={ciudadesOpcion}
                                                className="w-full"
                                            />
                                        </div>

                                        {verFavoritoB ? (
                                            <div className="field col-1">
                                                <Button
                                                    icon="pi pi-heart"
                                                    aria-label="Favorite"
                                                    tooltip="Agregar a Favoritos"
                                                    tooltipOptions={{
                                                        position: "top",
                                                    }}
                                                    onClick={agregarFavoritos}
                                                />
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        <div className="flex justify-content-center align-items-center w-full col-12">
                                            <Button
                                                label="Ver Clima"
                                                icon="pi pi-sun"
                                                loading={loadingButtonClima}
                                                onClick={verClima}
                                            />
                                        </div>
                                        <div className="w-full col-12">
                                            <Messages ref={msgs} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-4 lg:col-4 xl:col-4">
                                <div
                                    className="card mb-0"
                                    style={{
                                        minHeight: "183px",
                                    }}
                                >
                                    <div className="col-12 font-bold">
                                        <label>Ciudades Favoritas:</label>
                                    </div>
                                    {tieneFavoritos ? (
                                        <>
                                            <div className="formgrid grid">
                                                <div className="field col">
                                                    <Dropdown
                                                        value={
                                                            valorFavoritosSelect
                                                        }
                                                        onChange={(e) =>
                                                            setValorFavoritosSelect(
                                                                e.value
                                                            )
                                                        }
                                                        options={favoritos}
                                                        optionLabel="nombre"
                                                        placeholder="Selecciona una ciudad"
                                                        filter
                                                        valueTemplate={
                                                            favoritosSelect
                                                        }
                                                        itemTemplate={
                                                            favoritosOpcion
                                                        }
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="flex justify-content-center align-items-center w-full col-12 gap-3">
                                                    <Button
                                                        label="Ver Clima"
                                                        icon="pi pi-heart"
                                                        loading={
                                                            loadingButtonClima
                                                        }
                                                        onClick={verClimaFav}
                                                    />
                                                    <ConfirmDialog />
                                                    <Button
                                                        icon="pi pi-trash"
                                                        aria-label="Eliminar"
                                                        tooltip="Eliminar de Favoritos"
                                                        tooltipOptions={{
                                                            position: "top",
                                                        }}
                                                        severity="danger"
                                                        onClick={() =>
                                                            eliminarFavoritoDialog(
                                                                valorFavoritosSelect
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="w-full col-12">
                                                    <Messages ref={msgsFav} />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        "Aún no has agregado una ciudad"
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isDataClima ? (
                    <>
                        <div className="grid">
                            <div className="col-12">
                                <Divider align="center">
                                    <div className="inline-flex align-items-center">
                                        <i
                                            className="pi pi-map-marker mr-2"
                                            style={{ fontSize: "1.2rem" }}
                                        ></i>
                                        <p className="text-xl">
                                            El Clima de hoy en&nbsp;
                                            {nombreCiudadFavoritos ? (
                                                <b>
                                                    {ciudadFav},&nbsp;
                                                    {estadoFav}
                                                </b>
                                            ) : (
                                                <b>
                                                    {valorCiudadSelect}
                                                    ,&nbsp;
                                                    {valorEstado.nombre}
                                                </b>
                                            )}
                                        </p>
                                    </div>
                                </Divider>
                            </div>
                        </div>
                        <div className="grid flex justify-content-center align-items-center">
                            <div className="col-12 md:col-5 lg:col-5 xl:col-5">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-bold text-2xl mb-3">
                                                Temperatura
                                            </span>
                                            <div className="text-900 font-medium text-xl">
                                                {tempActual} ºC
                                            </div>
                                            <span>
                                                {tiposClimas[0][tipoClima]}
                                            </span>
                                        </div>
                                        <div
                                            className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                            style={{
                                                width: "4rem",
                                                height: "4rem",
                                            }}
                                        >
                                            <img
                                                src={iconClima}
                                                style={{ width: "45px" }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-blue-500">
                                        Min {tempActMin} ºC
                                    </span>
                                    &nbsp;-&nbsp;
                                    <span className="text-red-500 font-medium">
                                        Max {tempActMax} ºC
                                    </span>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="grid">
                            <div className="col-12 md:col-4 lg:col-4 xl:col-4">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between ">
                                        <div>
                                            <span className="block text-500 font-bold text-xl mb-3">
                                                Sensación Térmica
                                            </span>
                                            <div className="text-900 font-medium text-xl">
                                                {termicaActual} ºC
                                            </div>
                                        </div>

                                        <div
                                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                                            style={{
                                                width: "3rem",
                                                height: "3rem",
                                            }}
                                        >
                                            <WiThermometer
                                                className="pi pi-shopping-cart text-purple-600"
                                                style={{ fontSize: "28px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-4 lg:col-4 xl:col-4">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between ">
                                        <div>
                                            <span className="block text-500 font-bold text-xl mb-3">
                                                Humedad
                                            </span>
                                            <div className="text-900 font-medium text-xl">
                                                {humedadActual} %
                                            </div>
                                        </div>

                                        <div
                                            className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                                            style={{
                                                width: "3rem",
                                                height: "3rem",
                                            }}
                                        >
                                            <WiHumidity
                                                className="pi pi-shopping-cart text-cyan-500"
                                                style={{ fontSize: "28px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-4 lg:col-4 xl:col-4">
                                <div className="card mb-0">
                                    <div className="flex justify-content-between ">
                                        <div>
                                            <span className="block text-500 font-bold text-xl mb-3">
                                                Velocidad del Viento
                                            </span>
                                            <div className="text-900 font-medium text-xl">
                                                {vientoActual} km/h
                                            </div>
                                        </div>
                                        <div
                                            className="flex align-items-center justify-content-center bg-bluegray-100 border-round"
                                            style={{
                                                width: "3rem",
                                                height: "3rem",
                                            }}
                                        >
                                            <WiStrongWind
                                                className="pi pi-shopping-cart text-bluegray-500"
                                                style={{ fontSize: "28px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="grid">
                            <div className="col-12">
                                <div className="text-center p-1 border-round-sm  font-bold ">
                                    <Panel header="El clima a 5 días">
                                        <TabView>
                                            <TabPanel header="Temperatura">
                                                <Chart
                                                    type="line"
                                                    data={chartDataTemp}
                                                    options={chartOptionsTemp}
                                                />
                                                <span className="block text-primary-500 font-medium mb-3">
                                                    <br />
                                                    <b>
                                                        Valores en Grados
                                                        Centigrados | ºC
                                                    </b>
                                                </span>
                                            </TabPanel>
                                            <TabPanel header="Sensación Térmica">
                                                <Chart
                                                    type="line"
                                                    data={chartDataSensTerm}
                                                    options={
                                                        chartOptionsSensTerm
                                                    }
                                                />
                                                <span className="block text-primary-500 font-medium mb-3">
                                                    <br />
                                                    <b>
                                                        Valores en Grados
                                                        Centigrados | ºC
                                                    </b>
                                                </span>
                                            </TabPanel>
                                            <TabPanel header="Humedad">
                                                <Chart
                                                    type="line"
                                                    data={chartDataHume}
                                                    options={chartOptionsHume}
                                                />
                                                <span className="block text-primary-500 font-medium mb-3">
                                                    <br />
                                                    <b>
                                                        Valores en Porcentaje |
                                                        %
                                                    </b>
                                                </span>
                                            </TabPanel>
                                            <TabPanel header="Velocidad del Viento">
                                                <Chart
                                                    type="line"
                                                    data={chartDataVien}
                                                    options={chartOptionsVien}
                                                />
                                                <span className="block text-primary-500 font-medium mb-3">
                                                    <br />
                                                    <b>
                                                        Valores en Kilometros
                                                        por Hora | Km/h
                                                    </b>
                                                </span>
                                            </TabPanel>
                                        </TabView>
                                    </Panel>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    ""
                )}
            </div>
            <Dialog
                header="Error 401"
                visible={error401}
                style={{ width: "50vw" }}
                onHide={() => {
                    if (!error401) return;
                    setError401(false);
                }}
            >
                <p className="m-0">
                    Por el momento no podemos realziar tu solicitud, intentalo
                    más tarde.
                    <br />
                    <b>Gracias</b>
                </p>
            </Dialog>
            <Dialog
                header="Error 404"
                visible={error404}
                style={{ width: "50vw" }}
                onHide={() => {
                    if (!error404) return;
                    setError404(false);
                }}
            >
                <p className="m-0">
                    Por el momento no podemos realziar tu solicitud, intentalo
                    más tarde.
                    <br />
                    <b>Gracias</b>
                </p>
            </Dialog>
            <Dialog
                header="Error 429"
                visible={error429}
                style={{ width: "50vw" }}
                onHide={() => {
                    if (!error429) return;
                    setError429(false);
                }}
            >
                <p className="m-0">
                    Por el momento no podemos realziar tu solicitud, intentalo
                    más tarde.
                    <br />
                    <b>Gracias</b>
                </p>
            </Dialog>
            <Dialog
                header="Error en la petición"
                visible={errorData}
                style={{ width: "50vw" }}
                onHide={() => {
                    if (!errorData) return;
                    setErrorData(false);
                }}
            >
                <p className="m-0">
                    Por el momento no podemos realziar tu solicitud, intentalo
                    más tarde.
                    <br />
                    <b>Gracias</b>
                </p>
            </Dialog>

            <Dialog
                header="Agregada a favoritos"
                visible={agregadoFavoritos}
                style={{ width: "30vw" }}
                onHide={() => {
                    if (!agregadoFavoritos) return;
                    setAgregadoFavoritos(false);
                }}
                footer={footerNuevoFav}
            >
                <p className="m-0">
                    Agregaste correctamente a tus favoritos la ciudad de:&nbsp;
                    <b>{valorCiudadSelect}</b>
                </p>
            </Dialog>

            <Dialog
                header="Ciudad repetida"
                visible={cdExistenteFavoritos}
                style={{ width: "30vw" }}
                onHide={() => {
                    if (!cdExistenteFavoritos) return;
                    setCdExistenteFavoritos(false);
                }}
                footer={footerNoFav}
            >
                <p className="m-0">
                    <b>{valorCiudadSelect}</b> ya esta en tus favoritos
                </p>
            </Dialog>
            <Dialog
                header="Eliminar de favoritos"
                visible={borrarFavoritos}
                style={{ width: "30vw" }}
                onHide={() => {
                    if (!borrarFavoritos) return;
                    setBorrarFavoritos(false);
                }}
                footer={footereliminarFav}
            >
                <p className="m-0">
                    Estas a punto de eliminar <b>{valorFavoritosSelect}</b> de
                    tus favoritos
                    <br />
                    <br />
                    <b>¿Esta acción no se podrá deshacer estas seguro?</b>
                </p>
            </Dialog>
        </>
    );
}

export default App;
