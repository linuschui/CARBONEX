import { useContext } from "react"
import { Helmet } from "react-helmet"
import { WebContext } from "./context/WebContext"

import "./App.css"

import Home from "./pages/Home"
import Login from "./pages/Login"

function App() {
	const { token, authenticated, company } = useContext(WebContext)
	console.log(token)
	console.log(`Current Token : ${token}`)
	console.log(`Current Company ID : ${!company ? "No User" : company.id}`)
	console.log(`Current Company Name : ${!company ? "No User" : company.name}`)
	console.log(`Current Company Email : ${!company ? "No User" : company.email}`)
	console.log(`Current Authentication Status : ${authenticated}`)

	return (
		<div className="App">
			{token ? (
				<>
					<Helmet>
						<title>CARBONEX</title>
					</Helmet>
					<Home />
				</>
			) : (
				<>
					<Helmet>
						<title>CARBONEX // Login</title>
					</Helmet>
					<Login />
				</>
			)}
		</div>
	)
}

export default App
