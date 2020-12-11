import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import Chart from "react-apexcharts";
function ChartComponent(props) {
    const [vaccineStock, setVaccineStock] = useState(null)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let data = {
        label: ["Stock status"],
        datasets: [],
    };
    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    }
    // labels
    const dataChart = {

        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 350
            },
            colors: [
                function colored({ value, dataPointIndex }) {
                    console.log(dataPointIndex)
                    if (dataChart.series[dataPointIndex].data > 10) {
                        return "#56D79899"
                    } else if (dataChart.series[dataPointIndex].data >5 && dataChart.series[dataPointIndex].data < 10) {
                        return "#EEFF26B3"
                    } else if (dataChart.series[dataPointIndex].data < 5) {
                        return "#FA05119E"
                    }
                }
            ],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    // endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                categories: ['This Month'],
            },
            yaxis: {
                title: {
                    text: 'Quantity'
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            }
        },
    };
    let config = null;
    if (!props.requestOrgunitId && !props.date) {
        config = {
            method: 'post',
            url: 'http://localhost:8765/api/stock',
            headers: {
                "auth": localStorage.getItem("vmisJwt"),
            },
        };
    } else if (props.requestOrgunitId && !props.date) {
        config = {
            method: 'post',
            url: 'http://localhost:8765/api/stock',
            data: { orgunit: props.requestOrgunitId },
            headers: {
                "auth": localStorage.getItem("vmisJwt"),
            },
        };
    }
    else if (props.date && !props.requestOrgunitId) {
        config = {
            method: 'post',
            url: 'http://localhost:8765/api/stock/',
            data: { date: props.date },
            headers: {
                "auth": localStorage.getItem("vmisJwt"),
            },
        };
        if (props.date.length < 3 && props.date === "6") {
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth();
            let i = 0;
            let lastSixMonths = []
            let unSortedMonths = []
            do {
                if (month < 0) {
                    month = 11;
                    year--;
                }
                month--;
                unSortedMonths.push(months[month])
                i++;
            } while (i < 6);
            for (let j = unSortedMonths.length - 1; j >= 0; j--) {
                lastSixMonths.push(unSortedMonths[j])
            }
            data = {
                labels: lastSixMonths,
                label: ["Stock status"],
                datasets: [],

            };
        }
        else if (props.date === "12") {
            data = {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                label: ["Stock status"],
                datasets: [],
            };
        }

    }
    else if (props.date && props.requestOrgunitId) {
        config = {
            method: 'post',
            url: 'http://localhost:8765/api/stock/',
            data: { orgunit: props.requestOrgunitId, date: props.date },
            headers: {
                "auth": localStorage.getItem("vmisJwt"),
            },
        };
    }
    useEffect(() => {
        axios(config).then(res => {
            setVaccineStock(res.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [props.requestOrgunitId, props.date])
    let [quantities, vaccineNames, colors, borderColors] = [[], [], [], []]
    // if (config) {
    //     if (config.data) {
    //         if (config.data.hasOwnProperty("date") && config.data.date.length < 3) {
    //             for (let month in months) {
    //                 if (vaccineStock[month]) {
    //                     for (let i in vaccineStock[month]) {
    //                         vaccineNames.push(vaccineStock[month][i].vaccineName)
    //                         quantities.push(vaccineStock[month][i].quantity)
    //                         colors.push(vaccineStock[month][i].color)
    //                         borderColors.push(vaccineStock[month][i].borderColor)
    //                     }
    //                     data.datasets.push({
    //                         label: vaccineNames,
    //                         data: quantities,
    //                         backgroundColor: colors,
    //                         borderColor: borderColors,
    //                         borderWidth: 1
    //                     })

    //                     quantities = [];
    //                     vaccineNames = [];
    //                     colors = [];
    //                     borderColors = [];
    //                 } else {
    //                     quantities.push(null)
    //                     vaccineNames.push(null)
    //                     colors.push(null)
    //                     borderColors.push(null)
    //                 }
    //             }
    //             console.log(data);
    //         }
    //     }
    // }
    for (const i in vaccineStock) {
        if (vaccineStock.hasOwnProperty(i)) {
            const element = vaccineStock[i];
            data.datasets.push({
                label: [element.vaccineName],
                data: [element.quantity],
                backgroundColor: element.color,
                borderColor: element.borderColor,
                borderWidth: 1
            })
            dataChart.series.push({
                name: element.vaccineName,
                data: [element.quantity]
            })
        }
    }

    return (
        <div className='container'>
            {/* <Bar data={data} title='Stock status' options={options} /> */}
            <Chart options={dataChart.options} series={dataChart.series} type="bar" />
            <hr />
            <hr />
            <div className="container text-center font-weight-bold">
                <div className='text-center'>
                    <div className='row'>
                        {vaccineStock ? Object.keys(vaccineStock).map((key, index) => (
                            <Card className="mx-3" key={index}>
                                <Card.Header className={`bg-${vaccineStock[key].headerColor} text-center text-light`}>{vaccineStock[key].vaccineName} </Card.Header>
                                <Card.Body>
                                    {vaccineStock[key].quantity}
                                </Card.Body>
                            </Card>
                        )) : ""}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChartComponent