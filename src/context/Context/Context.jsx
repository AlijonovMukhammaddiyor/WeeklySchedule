import { createContext, useReducer, useEffect } from "react";
import Reducer from "../Reducer/Reducer";

const INITIAL_STATE = {
	classes: JSON.parse(localStorage.getItem("classes")) || [],
	error: false,
};

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

	useEffect(() => {
		localStorage.setItem("classes", JSON.stringify(state.classes));
	}, [state.classes]);

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
