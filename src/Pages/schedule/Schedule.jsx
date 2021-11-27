import React, { useState, useEffect } from "react";
import "../../styles/schedule/schedule.css";
import Navbar from "../../components/navbar/Navbar";
import Block from "../../components/block/Block";

export default function Schedule() {
	// class = {start: time, end: time, day: day}
	const [classes, setClasses] = useState([]);

	return (
		<div className="schedule__container">
			<Navbar />
			<div className="main">
				<div className="header">
					<div className="title">
						<p>Class schedule</p>
					</div>
					<div className="add__btn">
						<button className="btn">Add Class Schedule</button>
					</div>
				</div>
				<div className="main__container">
					<table>
						<thead>
							<th>Monday</th>
							<th>Tuesday</th>
							<th>Wednesday</th>
							<th>Thursday</th>
							<th>Friday</th>
							<th>Saturday</th>
							<th>Sunday</th>
						</thead>
						<tbody>
							<tr>
								<td>
									<Block start={"sdds"} />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
