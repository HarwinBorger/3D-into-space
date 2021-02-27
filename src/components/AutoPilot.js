import React from "react";
import {connect} from "react-redux";
import classNames from "classnames";
import {toggleAutoPilot} from "../redux/actions";
import {getAutoPilotState} from "../redux/selectors";

class AutoPilot extends React.Component {
	constructor(props)
	{
		super(props);
	}

	render()
	{
		let buttonClasses = classNames({
			'button': true,
			'is-hidden': this.props.autoPilot.status === false
		});

		return (
			<div onClick={() => this.props.toggleAutoPilot(false)} id="autoPilot" className={buttonClasses}>Stop
				Autopilot</div>
		)
	}
}

const mapStateToProps = state =>{
	let autoPilot = getAutoPilotState(state);
	return {autoPilot}
};

export default connect(mapStateToProps, {toggleAutoPilot})(AutoPilot);