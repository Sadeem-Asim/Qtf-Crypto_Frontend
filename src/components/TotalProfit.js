import ApexCharts from 'apexcharts'
import {useEffect} from 'react';
import {generateRangeChartData} from "utils";

export default function TotalProfit({days, data = []}) {

    const options = {
        series: [{
            name: "Profit",
            data: generateRangeChartData(days, data[days]),
        }],
        yaxis: {
            min: 0,
            max: (max) => max * 5
        },
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 1
            },
        },
        tooltip: {
            theme: 'dark',
        }
    };


    useEffect(() => {
        const chart = new ApexCharts(document.querySelector("#total_profit"), options);
        chart.render();
        return () => chart.destroy();
    }, [days, data])
    return <div className='pie-chart-main'>

        <div className='chart-flex'>
            <div id="total_profit" style={{width: '100%'}} className='main-pie-chart'>
            </div>
        </div>
    </div>
}