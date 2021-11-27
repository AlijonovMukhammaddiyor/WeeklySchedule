import React from "react";
import { IoClose } from "react-icons/io5";
import "../../styles/block/block.css";

export default function Block(props) {
	return (
		<div className="block__container">
			<IoClose className="close__icon" />
			<p>{props.start} - </p>
			<p>{props.end}</p>
		</div>
	);
}
