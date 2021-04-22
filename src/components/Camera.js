import React from "react";
import {connect} from "react-redux";
//import classNames from "classnames";
import {setCamera} from "../redux/actions";
import {getCamera} from "../redux/selectors";
import IconVideo from "../icons/video.svg";
import IconUfo from "../icons/ufo.svg";
import IconEarth from "../icons/earth.svg";
import IconHotAirBalloon from "../icons/hot-air-balloon.svg";
import IconTree from "../icons/tree.svg";

class Camera extends React.Component {
	getIcon(type = 'default'){
		let icons = {
		    'ufo': IconUfo,
		    'earth': IconEarth,
		    'balloon': IconHotAirBalloon,
		    'tree': IconTree,
			'default': IconVideo
		};

		return icons[type];
	}

	render()
	{
		return (
			<button onClick={() => this.props.setCamera(this.props.number)} className="trans-button">
				<img src={this.getIcon(this.props.icon)} alt=""/>
			</button>
		)
	}
}

const mapStateToProps = state =>{
	let activeCamera = getCamera(state);
	return {activeCamera}
};

export default connect(mapStateToProps, {setCamera})(Camera);