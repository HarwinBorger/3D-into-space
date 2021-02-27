import React from "react";
import { connect } from "react-redux";
import { toggleLightSpeed} from "../redux/actions";

const LightSpeed = ({ toggleLightSpeed }) => (
	<div onClick={() => toggleLightSpeed(true)} id="lightSpeed" className="button">LightSpeed</div>
);

// export default Todo;
export default connect(
	null,
	{ toggleLightSpeed}
)(LightSpeed);