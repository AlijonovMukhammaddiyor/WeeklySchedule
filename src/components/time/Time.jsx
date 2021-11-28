export class ClassTime {
	static days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	static max_minutes_week = 10080; //minutes in a week
	static max_minutes_day = 1440; // minutes in a day
	// gets the start time of the class
	constructor(hour, minute, day, mdm) {
		this.start = {
			hour,
			minute,
			day,
			mdm,
			minutes: 0,
		};
		this.start.minutes = this.convert_to_minutes(this.start);
		this.end = this.add(0, 40);
	}

	/// convert to minutes passed since start of the week so that we can have unique minutes
	convert_to_minutes(time) {
		const index = ClassTime.days.indexOf(time.day);
		let hour = time.hour;
		if (time.hour !== 12 && time.mdm === "PM") {
			hour += 12;
		}
		return hour * 60 + time.minute + index * 24 * 60;
	}

	getStart() {
		return this.start;
	}

	getEnd() {
		return this.end;
	}

	get_start_minutes() {
		return this.start.minutes;
	}

	get_end_minutes() {
		return this.convert_to_minutes(this.end);
	}

	get_class_interval() {
		return [this.start.minutes, this.convert_to_minutes(this.end)];
	}

	// add time and return time on format hour:minute AM or PM  day:"Monday" ...
	add(hour, minute) {
		const add_minutes = hour * 60 + minute;
		const new_minutes = (this.start.minutes + add_minutes) % ClassTime.max_minutes_week;
		return this.convert_to_format(new_minutes);
	}

	// convert minutes to ClassTime format
	convert_to_format(minutes) {
		const day_index = Math.floor(minutes / ClassTime.max_minutes_day);
		minutes -= day_index * ClassTime.max_minutes_day;
		let hour = Math.floor(minutes / 60);
		const minute = minutes - hour * 60;
		let mdm;
		if (hour >= 12) {
			mdm = "PM";
			if (hour > 12) {
				hour -= 12;
			}
		} else {
			mdm = "AM";
		}
		return {
			hour,
			minute,
			mdm,
			day: ClassTime.days[day_index],
		};
	}

	static time_difference(obj1, obj2) {
		return obj1.get_start_minutes() - obj2.get_start_minutes();
	}

	// If class time is not on Sunday midnight, it is enough to compare difference start times
	// otherwise we have to deal with two cases
	//      1) one is totally on Sunday and  another is partially on Sunday -> 11.00 - 11.40 <=> 11.20 - 00.00
	//      2) one is partially on Sunday and another is totally on Monday -> 11.40 - 00.20 <=> 00.00 - 00.40
	does_overlap(time) {
		const time_interval = time.get_class_interval();
		const cur_interval = this.get_class_interval();

		if (time_interval[0] - cur_interval[0] === time_interval[1] - cur_interval[1]) {
			// classtime is not on Sunday midnight
			return Math.abs(time_interval[0] - cur_interval[0]) < 40;
		} else {
			//case 1 where both starts on Sunday
			if (Math.abs(time_interval[0] - cur_interval[0]) < 40) return true;
			// case 2 check difference between end time
			else {
				return Math.abs(time_interval[1] - cur_interval[1]) < 40;
			}
		}
	}
}
