import { Component } from "react";

class ErrorBoundary extends Component {
	state = {
		error: false
	}

	// static getDerivedStateFromError(error) { //метод для обновления state
	// 	return {error: true};
	// }

	componentDidCatch(error, errorInfo) {
		console.log(error, errorInfo);
		this.setState({
			error: true
		})
	}

	render() {
		if (this.state.error) {
			return <h2>Oops! Something went wrong :(</h2>
		}
		
		return this.props.children;
	}
}

export default ErrorBoundary;