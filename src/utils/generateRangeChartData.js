import _ from "lodash"

const generateRangeChartData = (days = 30, data = []) => {
    return data.map((record, index) => {
        const data = _.round(record?.profit, 3) || 0;
        const date = record?.startDate;

        return {x: [date], y: [data]}
    })
    /*return Array(days).fill(0).map((_day, index) => {
        const y = _.round(data[index]?.profit, 3) || 0
        const date = data[index]?.startDate;

        console.log(data, '########');

        return {x: [date], y: [y]}

    });*/
};

export default generateRangeChartData