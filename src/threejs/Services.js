export function getRandomRange(min, max)
{
	return Math.random() * (max - min) + min;
}

//
//export function getRandomNumber(min, max)
//{
//	return Math.random() * (max - min) + min;
//}

export function getRandomInt(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive
}

//
//function getRandomIntInclusive(min, max)
//{
//	min = Math.ceil(min);
//	max = Math.floor(max);
//	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
//}

/**
 * loop
 * @param n
 * @returns {Function}
 * @source https://stackoverflow.com/questions/30452263/is-there-a-mechanism-to-loop-x-times-in-es6-ecmascript-6-without-mutable-varia
 */
export const loop = n => f => {
	let iter = i => {
		if (i === n) {
			return
		}
		f(i);
		iter(i + 1)
	};
	return iter(0)
};


export function manipulateIcosahedron(geometry, min, max)
{
	geometry.vertices.forEach(function (point) {
		point.x += getRandomRange(min, max);
		point.y += getRandomRange(min, max);
		point.z += getRandomRange(min, max);
	});

	return geometry;
}