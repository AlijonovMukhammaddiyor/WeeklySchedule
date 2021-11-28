import { createContext, useReducer, useEffect } from "react";
import Reducer from "../Reducer/Reducer";
import { API } from "../../components/time/API";

const INITIAL_STATE = {
	// {day:{start:{hour:, minute:}, end:{hour:, minute:}}}
	classes: JSON.parse(localStorage.getItem("classes"))
		? new API(JSON.parse(localStorage.getItem("classes")))
		: new API({}),
	error: false,
};

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

	useEffect(() => {
		localStorage.setItem("classes", JSON.stringify(state.classes));
	});

	return (
		<Context.Provider
			value={{
				classes: state.classes,
				error: state.error,
				dispatch,
			}}
		>
			{children}
		</Context.Provider>
	);
};
