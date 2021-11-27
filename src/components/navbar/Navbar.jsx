import React from "react";
import "../../styles/navbar/navbar.css";
import logo from "../../assets/Logo.svg";

export default function Navbar() {
	return (
		<div className="navbar__container">
			<div className="nav__logo">
				<img id="logo" src={logo} alt="" />
			</div>
		</div>
	);
}
