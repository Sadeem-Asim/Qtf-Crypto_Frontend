import ApexCharts from 'apexcharts'
import {useEffect} from 'react';

export default function PaidHistoryPieChart({data = {series: [0, 0], paid: 0, unPaid: 0}, closeOrders}) {

    console.log(data,"PaidHistoryPieChart");

    const labels = ['Paid', 'UnPaid'];
    const options = {
        series: data?.series,
        chart: {
            width: 380,
            type: 'pie',
        },
        fillColor: '#FEB019',
        labels: labels,
        colors: ['#2AB48F', '#E06161'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    useEffect(() => {
        const chart = new ApexCharts(document.querySelector("#pie_chart"), options);
        chart.render();

        return () => {
            chart.destroy();
        }

    }, [data])
    return <div className='pie-chart-main'>
        <div className='flex-text-between'>
            <h3 className='section-title'>Close Orders ({closeOrders})</h3>
            <a href='#' className='gray-anchor'>Details</a>
        </div>
        <div className='chart-flex flex-between-chart'>
            <div id="pie_chart" className='main-pie-chart'>

            </div>
            <div className='paid-labels mobile-none'>
                <div className='inner'>
                    <i className="fa-solid fa-circle red"></i>
                    <span>{labels[1]}</span>
                </div>
                <div className='inner'>
                    <i className="fa-solid fa-circle green"></i>
                    <span>{labels[0]}</span>
                </div>
            </div>
            <div className='paid-percent mobile-none'>
                <div className='inner'>
                    <span>{data?.unPaid}%</span>
                </div>
                <div className='inner'>
                    <span>{data?.paid}%</span>
                </div>
            </div>
        </div>
    </div>
}
