import { combineReducers } from "redux";
import autoPilot from "./autoPilot";
import lightSpeed from "./lightSpeed";
import camera from "./camera";

export default combineReducers({ autoPilot, lightSpeed, camera });
