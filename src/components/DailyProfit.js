import {memo, useEffect} from 'react';
import ApexCharts from 'apexcharts'
import {generateRangeChartData} from "utils";

const DailyProfit = ({days, data = []}) => {


    const options = {
        series: [{
            name: 'Profit',
            data: generateRangeChartData(days, data[days])
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                colors: {
                    ranges: [{
                        from: 0,
                        to: 100,
                        color: '#2AB48F'
                    }, {
                        from: -100,
                        to: 0,
                        color: '#E06161'
                    }]
                },
                columnWidth: '80%',
            }
        },
        dataLabels: {
            enabled: false,
        },
        yaxis: {
            min: 0,
        },
        tooltip: {
            theme: 'dark',
        }
    };

    useEffect(() => {
        const chart = new ApexCharts(document.querySelector("#daily_profit"), options);
        chart.render().then()
        return () => chart.destroy();
    }, [days, data]);
    return <div className='pie-chart-main'>

        <div className='chart-flex'>
            <div id="daily_profit" style={{width: '100%'}} className='main-pie-chart'>
            </div>
        </div>
    </div>
}

export default memo(DailyProfit)