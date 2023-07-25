import {imageURL} from "../hooks"
import {PieChart, PortfolioTab} from "../components"
import {PROFIT_LOSS_DAYS} from "../constants";
import _ from "lodash";
import {useState} from "react";
import {useSelector} from "react-redux";
import {useQuery} from "react-query";
import {apis} from "../services";
import {showToastError} from "../utils";

function ProfitLoss() {
    const {balance} = useSelector(store => store.binance);

    const {isLoading, data} = useQuery("profit/loss", apis.getProfitLoss,{
        onError: error => showToastError(error)
    });

    const result = _.get(data,'data', {})

    const [chartDate, setChartDate] = useState(PROFIT_LOSS_DAYS.DAILY);

    console.log({chartDate});

    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                {/*<div className="head-main">
                    <div className="head-section">
                        <div className="balance-section">
                            <span>Total Balance</span>
                            <div className="coin-detail">
                                <img src={imageURL('binance.png')} alt="Binance"/>
                                <h3>{balance}</h3>
                            </div>
                        </div>
                        <div>
                             <button className="custom-btn secondary-btn">+ Add New User</button>
                        </div>
                    </div>
                </div>*/}
                <PortfolioTab/>
                <div className="mt-5">

                    <div>
                        <div className="chart-filter">
                            <ul className="ul custom-scroll">
                                {_.values(PROFIT_LOSS_DAYS).map(
                                    (days, index) =>
                                        <li key={index}>
                                            <a href={'#!'}
                                               className={days === chartDate ? 'active' : ''}
                                               onClick={() =>setChartDate(days)}
                                            >{days}</a>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                        <PieChart data={result?.[chartDate]}/>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ProfitLoss