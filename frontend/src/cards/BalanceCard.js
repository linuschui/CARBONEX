import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "./BalanceCard.css"

function BalanceCard({ title, value, icon }) {
  return (
    <div className="balance-card-container">
        <div className="balance-card">
            <div className="balance-card-left-container">
                <FontAwesomeIcon className="card-icon" icon={icon} />
            </div>
            <div className="balance-card-right-container">
                <div className="balance-card-value">
                    <p>{value}</p>
                </div>
                <div className="balance-card-title">
                    <p>{title}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BalanceCard
