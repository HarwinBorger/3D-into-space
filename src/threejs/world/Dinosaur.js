import {Objects} from "../Globals";

export default class Dinosaur {
	constructor()
	{
		this.object = Objects.dinosaur.clone();
		this.object.scale.set(0.5,0.5,0.5);
		this.object.position.y = 19.5;
	}
}