import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router"
import { WebProvider } from "./context/WebContext"

import "./index.css"

import App from "./App"

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<WebProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</WebProvider>
	</React.StrictMode>
)
