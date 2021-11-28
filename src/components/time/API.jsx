import { ClassTime } from "./Time";

export class API {
	static days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	constructor(classes) {
		this.classes = classes.classes || {
			Monday: [],
			Tuesday: [],
			Wednesday: [],
			Thursday: [],
			Friday: [],
			Saturday: [],
			Sunday: [],
		};
		this.upcoming = classes.upcoming || {};
		this.ongoing = classes.ongoing || {};
		this.convert_to_object();
	}

	// when adding a class we have to check if it overlaps with any other class
	// Since classes can start in one day and end in next day like 11.40 PM - 00.20 AM
	// we have to check it with classes of three days - previous day, current day, next day

	convert_to_object() {
		for (const key in this.classes) {
			if (this.classes[key].length > 0) {
				for (let i = 0; i < this.classes[key].length; i++) {
					const temp = this.classes[key][i];
					this.classes[key][i] = new ClassTime(
						temp.start.hour,
						temp.start.minute,
						temp.start.day,
						temp.start.mdm
					);
				}
			}
		}
	}

	add_slots(objs) {
		for (let i = 0; i < objs.length; i++) if (this.does_overlap(objs[i])) return false;

		// now we have to insert new class in sorder order
		for (let j = 0; j < objs.length; j++) {
			const obj_day = objs[j].getStart().day;
			let i = 0;
			let inserted = false;
			for (i = 0; i < this.classes[obj_day].length; i++) {
				// if obj comes before any other class in the day, insert it before that class
				if (ClassTime.time_difference(objs[j], this.classes[obj_day][i]) < 0) {
					this.classes[obj_day].splice(i, 0, objs[j]);
					inserted = true;
					break;
				}
			}
			// else if it is later than all classes in the same day
			if (!inserted) this.classes[obj_day].push(objs[j]);
		}
		return true;
	}

	remove_slot(obj) {
		const obj_day = obj.day;
		const obj_minutes = obj.minutes;
		let i = 0;
		for (i = 0; i < this.classes[obj_day].length; i++) {
			// check if time diff is zero which means the same class because every class has unique start_minutes
			if (obj_minutes === this.classes[obj_day][i].get_start_minutes()) {
				this.classes[obj_day].splice(i, 1);
				return true;
			}
		}
		return false;
	}

	// checks if given obj ClassTime overlaps with any other class
	does_overlap(obj) {
		const obj_start_day = obj.getStart().day;
		const obj_end_day = obj.getEnd().day;
		// if class starts and ends in the same day we have to check only with previous day and current day classes
		// because there can be cases like start -> 11:40 PM end -> 00:20 AM
		const flag = obj_start_day === obj_end_day;
		const prev_day = API.days[(API.days.indexOf(obj_start_day) - 1 + 7) % 7];
		const next_day = API.days[(API.days.indexOf(obj_start_day) + 1) % 7];
		for (let i = 0; i < this.classes[prev_day].length; i++) {
			if (obj.does_overlap(this.classes[prev_day][i])) return true;
		}

		for (let i = 0; i < this.classes[obj_start_day].length; i++) {
			if (obj.does_overlap(this.classes[obj_start_day][i])) return true;
		}
		if (!flag)
			// check with next day classes if class does not start and end in the same day
			for (let i = 0; i < this.classes[next_day].length; i++) {
				if (obj.does_overlap(this.classes[next_day][i])) return true;
			}

		return false;
	}

	get_upcoming_class() {
		this.get_class();
		return this.upcoming;
	}

	get_ongoing_class() {
		this.get_class();
		return this.ongoing;
	}

	// this is general function to initalize either ongoing or upcoming classes
	get_class() {
		const date = new Date();
		const day = API.days[(date.getDay() - 1 + 7) % 7];
		let hour = date.getHours();
		const mdm = hour >= 12 ? "PM" : "AM";
		if (hour > 12) hour -= 12;
		const minute = date.getMinutes();

		const currentTime = new ClassTime(hour, minute, day, mdm);

		let min_remaining = 180;
		let min_index = -1;

		for (let i = 0; i < this.classes[day].length; i++) {
			const diff = ClassTime.time_difference(this.classes[day][i], currentTime);
			if (diff > 0 && diff < min_remaining) {
				min_index = i;
				min_remaining = diff;
			} else if (diff <= 0 && diff >= -40) {
				this.ongoing = { [day]: this.classes[day][i], passed: diff * -1 };
				this.upcoming = {};
				min_index = -1;
				break;
			}
		}
		if (min_index > -1) {
			this.ongoing = {};
			this.upcoming = {
				[day]: this.classes[day][min_index],
				remaining: min_remaining,
			};
		} else if (!this.ongoing.passed) {
			this.upcoming = {};
			this.ongoing = {};
		}
	}

	// to get schedule as JSON
	get_latest_schedule() {
		return this.classes;
	}
}
