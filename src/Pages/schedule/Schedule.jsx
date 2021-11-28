import React, { useContext, useEffect, useState } from "react";
import "../../styles/schedule/schedule.css";
import Navbar from "../../components/navbar/Navbar";
import Block from "../../components/block/Block";
import { Context } from "../../context/Context/Context";
import { Link } from "react-router-dom";

export default function Schedule() {
	const { classes } = useContext(Context);
	// there can be either ongoing class or upcoming class. We do not initialize both at the same time
	const [going, setGoing] = useState({});
	const [coming, setComing] = useState({});
	const today = new Date().getDay();

	// to get ongoing or upcoming classes every second
	useEffect(() => {
		const timer = window.setInterval(() => {
			const ongoing = classes.get_ongoing_class();
			const upcoming = classes.get_upcoming_class();
			if (ongoing.passed) {
				setGoing(ongoing);
				setComing({});
			} else if (upcoming.remaining) {
				setComing(upcoming);
				setGoing({});
			}
		}, 1000);
		return () => window.clearInterval(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [going, coming]);

	// return class blocks for specific day
	function render_blocks(arr) {
		let ans = [];
		for (let i = 0; i < arr.length; i++) {
			ans.push(row(arr[i]));
		}
		return ans;
	}

	// initialize Block object with given class
	function row(obj) {
		const start = obj.getStart();
		const end = obj.getEnd();
		return <Block data={[start, end]} key={obj.get_start_minutes()} />;
	}

	function formatRemaining(minutes) {
		if (minutes >= 60) {
			const hour = Math.floor(minutes / 60);
			const minute = minutes - hour * 60;
			if (minute === 0)
				if (hour > 1) return `${hour} hours`;
				else return `an ${hour} hour`;
			else {
				if (hour > 1 && minute > 1) return `${hour} hours ${minute} minutes`;
				else if (hour > 1 && minute === 1) return `${hour} hours ${minute} minute`;
				else if (hour === 1 && minute === 1) return `${hour} hour ${minute} minute`;
				else return `${hour} hour ${minute} minutes`;
			}
		} else {
			if (minutes === 1) return `${minutes} minute!`;
			else return `${minutes} minutes!`;
		}
	}

	return (
		<div className="schedule__container">
			<Navbar />
			<div className="main">
				<div className="header">
					<div className="title">
						<p>Class schedule</p>
					</div>
					<div className="add__btn">
						<Link to="/add">
							<button className="btn">Add Class Schedule</button>
						</Link>
					</div>
				</div>
				<div className="main__container">
					<div className="head">
						<p>Monday</p>
						<p>Tuesday</p>
						<p>Wednesday</p>
						<p>Thursday</p>
						<p>Friday</p>
						<p>Saturday</p>
						<p>Sunday</p>
					</div>
					<div className="blocks">
						<div className={today === 1 ? "weekday monday today" : "weekday monday"}>
							{render_blocks(classes.classes.Monday)}
						</div>
						<div className={today === 2 ? "weekday tuesday today" : "weekday tuesday"}>
							{render_blocks(classes.classes.Tuesday)}
						</div>
						<div className={today === 3 ? "weekday wednesday today" : "weekday wednesday"}>
							{render_blocks(classes.classes.Wednesday)}
						</div>
						<div className={today === 4 ? "weekday thursday today" : "weekday wednesday"}>
							{render_blocks(classes.classes.Thursday)}
						</div>
						<div className={today === 5 ? "weekday friday today" : "weekday friday"}>
							{render_blocks(classes.classes.Friday)}
						</div>
						<div className={today === 6 ? "weekday saturday today" : "weekday saturday"}>
							{render_blocks(classes.classes.Saturday)}
						</div>
						<div className={today === 0 ? "weekday sunday today" : "weekday saturday"}>
							{render_blocks(classes.classes.Sunday)}
						</div>
					</div>
				</div>
				{going.passed && (
					<div className="info ongoing">
						<div>
							<p>Your class is going on - {going.passed} minutes passed!</p>
						</div>
					</div>
				)}
				{coming.remaining && (
					<div className="info upcoming">
						<div>
							<p>There is an upcoming class in {formatRemaining(coming.remaining)}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
