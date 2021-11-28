import React from "react";
import Schedule from "../Pages/schedule/Schedule";
import "../styles/app/app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Class from "../Pages/class/Class";

export default function App() {
	return (
		<div className="app__container">
			<Router>
				<Routes>
					<Route exact path="/" element={<Schedule />}></Route>
					<Route exact path="/add" element={<Class />}></Route>
				</Routes>
			</Router>
		</div>
	);
}
