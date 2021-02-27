import React from "react";
import IconMouseLeft from "../icons/mouse-left-button.svg";
import classNames from "classnames";

export default class Instructions extends React.Component {
	constructor(props)
	{
		super(props);

		this.state = {
			mouseDown: false
		}
	}

	handleEvent = (event) => {
		if (event.type === "mousedown") {
			this.setState({mouseDown: true});
		} else {
			this.setState({mouseDown: false});
		}
	};

	componentDidMount = () => {
		window.addEventListener('mousedown', this.handleEvent, false);
		window.addEventListener('mouseup', this.handleEvent, false);
	};

	componentWillUnmount = () => {
		window.removeEventListener('mousedown', this.handleEvent);
		window.removeEventListener('mouseup', this.handleEvent);
	};

	render()
	{
		let instructionClasses = classNames({
			'instruction-feedback': true,
			'is-active': this.state.mouseDown === true
		});

		return (
			<div className="instructionGroup">
				<div>
					click + drag to rotate
					<div className={instructionClasses}>
						<img src={IconMouseLeft} alt=""/>
					</div>
				</div>
				<div>
					scroll to zoom in
				</div>
			</div>
		)
	}
}