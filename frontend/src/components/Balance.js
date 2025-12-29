import BalanceCard from "../cards/BalanceCard"
import { faMoneyBill1, faCreditCard } from "@fortawesome/free-solid-svg-icons"

import "./Balance.css"

function Balance({ data }) {
    return (
        <div className="dashboard-balance-container">
            <BalanceCard title={"CARBON CREDITS"} value={`${data.carbon_balance}`} icon={faCreditCard} />
            <BalanceCard title={"CASH (SGD)"} value={`${data.cash_balance}`} icon={faMoneyBill1} />
        </div>
    )
}

export default Balance
