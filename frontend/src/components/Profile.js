import { useEffect, useState } from "react"
import Clock from "react-simple-clock"

import "./Profile.css"

function Profile({ companyName, onLoaded }) {

    const [date, setDate] = useState("")
    const [time, setTime] = useState("")

    useEffect(() => {        
        const updateDateTime = () => {
            const options = {
                timeZone: "Asia/Singapore",
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric", 
            };
            const singaporeDate = new Date().toLocaleString("en-SG", options).toUpperCase()
            setDate(singaporeDate)
        }

        const updateTime = () => {
            const options = {
                timeZone: "Asia/Singapore",
                hour: "numeric", 
                minute: "numeric", 
                second:"numeric", 
            }
            const singaporeTime = new Date().toLocaleString("en-SG", options).toUpperCase()
            setTime(singaporeTime);
        }
        const dateInterval = setInterval(updateDateTime, 1000)
        const timeInterval = setInterval(updateTime, 1000)

        // Initial Update
        updateDateTime()
        updateTime()

        return () => {
            clearInterval(dateInterval)
            clearInterval(timeInterval)
        }
    }, [onLoaded])

    return (
        <div className="dashboard-profile-container">
            <div className="dashboard-datetime-container">
                <p className="dashboard-time">{date}</p>
                <p className="dashboard-time">{time}</p>
                <p className="dashboard-user">{companyName}</p>
            </div>
            <div className="dashboard-clock-container">
                <Clock live={true} hourMarkFormat="number" mode="dark" className="dashboard-clock" />
            </div>
        </div>
    )
}

export default Profile
