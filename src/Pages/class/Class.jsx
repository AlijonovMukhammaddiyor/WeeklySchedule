import React, { useState, useEffect, useContext } from "react";
import "../../styles/class/class.css";
import Navbar from "../../components/navbar/Navbar";
import { IoMdArrowDropdown } from "react-icons/io";
import { Context } from "../../context/Context/Context";
import { ClassTime } from "../../components/time/Time";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

export default function Class() {
	const [time, setTime] = useState({ hour: "00", minute: 0, mdm: "AM" });
	const [days, setDays] = useState([]);
	const [drop, setDrop] = useState(false);
	const history = useNavigate();

	const { classes, dispatch } = useContext(Context);

	// to close the drop down of minutes if clicked outside
	useEffect(() => {
		window.addEventListener("click", (e) => {
			const name = e.target.className;
			if (typeof name === "string" && !name.includes("minute_") && !name.includes("drop_"))
				setDrop(false);
		});
	}, []);

	const weekdays = ClassTime.days;

	// handle hour input
	function handleInput(e) {
		const value = e.target.value;
		// do not accept input whose length is more than 2
		if (value.length <= 2) {
			const val = parseInt(value);
			// is valid integer
			if (!isNaN(val)) {
				if (val <= 12) {
					// do not accept 12 for hour when mdm is AM because there is no 12.20 AM or 12.00 AM or 12.40 AM
					if (time.mdm === "AM" && val === 12) {
					} else {
						setTime({ ...time, hour: val });
					}
				} else {
				}
			} else {
				setTime({ ...time, hour: "" });
			}
		}
	}

	// to handle drop down of minutes
	function handleDropdown(e) {
		setDrop(!drop);
		let c = e.target.className;
		// set minutes according to which is clicked
		if (typeof c === "string") {
			if (c.includes("minute_00")) {
				setTime({ ...time, minute: 0 });
			} else if (c.includes("minute_20")) {
				setTime({ ...time, minute: 20 });
			} else if (c.includes("minute_40")) {
				setTime({ ...time, minute: 40 });
			}
		} else {
			setTime({ ...time, minute: 0 });
		}
	}

	// to handle mdm
	function handleMdm(e) {
		if (e.target.className === "am") {
			setTime({ ...time, mdm: "AM" });
			// if hour was 12 and we changed mdm to AM, hour should be changed to 0 because there is no 12.00 or 12.20 AM
			if (time.hour === 12) setTime({ ...time, hour: 0, mdm: "AM" });
		} else if (e.target.className === "pm") {
			setTime({ ...time, mdm: "PM" });
		}
	}

	function handleDays(e) {
		const day = e.target.classList[1];
		if (days.includes(day)) {
			setDays(days.filter((e) => e !== day));
		} else {
			setDays([...days, day]);
		}
	}

	// handle final save button
	function handleSubmit(e) {
		// in case user did not change default hour, we have to change it to integer 0
		if (time.hour === "00") {
			setTime({ ...time, hour: 0 });
		}
		let temp = [];
		// then make new ClassTime objects and push them in the array
		days.forEach((day, index) => {
			temp.push(new ClassTime(time.hour, time.minute, day, time.mdm));
		});

		//add_slots return true if successful
		let success = classes.add_slots(temp);
		if (success) {
			dispatch({ type: "ADD", payload: classes });
			if (temp.length > 0)
				// show success
				swal("Success!", "Courses added!", "success").then(() => {
					history(-1);
				});
			else history(-1);
		} else {
			// show error
			swal("Error!", "Courses overlap with others!", "error");
		}
	}

	return (
		<div className="class__container">
			<Navbar />
			<div className="main">
				<div className="title_class">
					<p>Add class schedule</p>
				</div>

				<div className="main__container_class">
					<div className="start__time">
						<div className="start__title">
							<p>Start time</p>
						</div>
						<div className="actual__time">
							<input
								type="text"
								onWheel={(e) => e.target.blur()}
								onChange={handleInput}
								value={time.hour}
							/>
							<p>:</p>
							<div className="time_minute">
								<div className={drop ? "minute_dropdown drop" : "minute_dropdown"}>
									<div className="minute minute_00 chosen_min" onClick={handleDropdown}>
										{time.minute === 0 ? "00" : time.minute}
										<IoMdArrowDropdown className={drop ? "drop__icon idrop" : "drop__icon"} />
									</div>
									<div className="minute minute_20" onClick={handleDropdown}>
										<p>20</p>
									</div>
									<div className="minute minute_40" onClick={handleDropdown}>
										<p>40</p>
									</div>
								</div>
							</div>
						</div>
						<div className="mdm">
							<div className={time.mdm === "AM" ? "am chosen_mdm" : "am"} onClick={handleMdm}>
								AM
							</div>
							<div className={time.mdm === "PM" ? "pm chosen_mdm" : "pm"} onClick={handleMdm}>
								PM
							</div>
						</div>
					</div>
					<div className="repeatOn">
						<div className="repeat__title">Repeat on</div>
						<div className="days">
							{weekdays.map((day, idx) => {
								return (
									<div
										className={days.includes(day) ? "day " + day + " chosen_day" : "day " + day}
										key={idx}
										onClick={handleDays}
									>
										{day}
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<div className="save__btn">
					<button className="save" onClick={handleSubmit}>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
