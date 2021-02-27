// React
import React, {Component} from 'react';
// Redux
import {connect, Provider} from 'react-redux'
import store from "./redux/store";
// Helpers
import classNames from "classnames";
// React vendor components
import Fullscreen from "react-full-screen";
// React components
import AutoPilot from "./components/AutoPilot";
import LightSpeed from "./components/LightSpeed";
import Camera from "./components/Camera";
import Instructions from "./components/Instructions";
// ThreeJS
import threeEntryPoint from "./threejs/threeEntryPoint"
import Stats from "stats.js"
import IconFullscreen from "./icons/maximize.svg";

export default class App extends Component {

	constructor(props)
	{
		super(props);

		this.state = {
			isFull: false,
			isMouseDown: false
		};
	}

	componentDidMount()
	{
		threeEntryPoint(this.threeRootElement);

		var stats = new Stats();
		stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
		document.body.appendChild(stats.dom);

		function animate()
		{
			stats.begin();
			// monitored code goes here
			stats.end();

			requestAnimationFrame(animate);

		}

		requestAnimationFrame(animate);
	}

	goFull = () => {
		this.setState({isFull: true});
	}

	isMouseDown(event, value)
	{
		this.setState(prevState => ({
			isMouseDown: value
		}));
	}

	render()
	{
		let canvasClasses = classNames({
			'canvas': true,
			'is-mouse-down': this.state.isMouseDown
		});

		return (
			<Provider store={store}>
				<div className="App">
					<div className="button-group-vertical">
						<button className="trans-button full-screen" onClick={this.goFull}>
							<img src={IconFullscreen} alt=""/>
						</button>
						<Camera number={'world'} icon={'earth'}/>
						<Camera number={'ufo'} icon={'ufo'}/>
						<Camera number={'balloon'} icon={'balloon'}/>
						<Camera number={'tree'} icon={'tree'}/>
					</div>
					<div className="button-group">
						<AutoPilot/>
						<LightSpeed/>
					</div>
					<div className="instructions">
						<Instructions />
					</div>
					<Fullscreen
						enabled={this.state.isFull}
						onChange={isFull => this.setState({isFull})}>
						<div className="full-screenable-node">
							<div className={canvasClasses}
							     onMouseDown={e => this.isMouseDown(e,true)}
							     onMouseUp={e => this.isMouseDown(e,false)}
							     ref={element => this.threeRootElement = element}/>
						</div>
					</Fullscreen>
				</div>
			</Provider>
		);
	}
}
