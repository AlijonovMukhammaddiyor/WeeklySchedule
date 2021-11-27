const Reducer = (state, action) => {
	switch (action.type) {
		case "ADD":
			return {
				classes: action.payload,
				error: false,
			};
		case "REMOVE":
			return {
				classes: action.payload,
				error: false,
			};
		case "ERROR":
			return {
				classes: null,
				error: true,
			};
		default:
			return state;
	}
};

export default Reducer;
