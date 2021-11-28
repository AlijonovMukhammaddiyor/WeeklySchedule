import React, { useContext } from "react";
import { IoClose } from "react-icons/io5";
import "../../styles/block/block.css";
import swal from "sweetalert";
import { Context } from "../../context/Context/Context";

export default function Block(props) {
	const start = props.data[0];
	const end = props.data[1];

	const { classes, dispatch } = useContext(Context);

	// handle remove class function
	function handleRemove() {
		swal({
			title: "Do you want to remove the class?",
			buttons: true,
			icon: "info",
		}).then((willDelete) => {
			if (willDelete) {
				swal("Class has been removed!", {
					icon: "success",
				}).then(() => {
					classes.remove_slot({ day: start.day, minutes: start.minutes });
					dispatch({ type: "REMOVE", payload: classes });
				});
			}
		});
	}

	return (
		<div className="block__container">
			<IoClose className="close__icon" onClick={handleRemove} />
			<p>
				{start.hour === 0 ? "00" : start.hour}:
				{start.minute < 10 ? "0" + start.minute : start.minute} {start.mdm} -{" "}
			</p>
			<p>
				{end.hour === 0 ? "00" : end.hour}:{end.minute < 10 ? "0" + end.minute : end.minute}{" "}
				{end.mdm}
			</p>
		</div>
	);
}
