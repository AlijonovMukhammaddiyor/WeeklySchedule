import React from "react";
import "../../styles/class/class.css";
import Navbar from "../../components/navbar/Navbar";

export default function Class() {
	return (
		<div className="class__container">
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
