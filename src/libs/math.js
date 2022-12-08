
Math.lerp = function (value1, value2, amount) { return value1 + (value2 - value1) * amount; };

// Обратная линейная интерполяция - возвращает значение 0..1
// Удобно использовать в сочетании с линейной, когда нужно менять один параметр в зависимости от другого. Например:
// let heroSpeed = Math.lerp( 150, 360, Math.unlerp( this.MIN_GAME_SPEED, this.MAX_GAME_SPEED, this.currentGameSpeed ) )
Math.unlerp = function (value1, value2, amount) { return (amount - value1) / (value2 - value1); };

// Квадратичная интерполяция. Возвращает значение между "a" и "c" с учётом веса "b", в зависимости от "x" (0..1)
// Т.е. график функции выглядит, как кривая безье первого порядка, в которой кривизна определяется "b"
// Удобно использовать для управляемого движения объекта по "параболической" кривой
Math.qarp = function (a, b, c, x) { return Math.lerp(Math.lerp(a, b, x), Math.lerp(b, c, x), x); };
Math.cubic = function (a, b, c, d, x) { return Math.lerp(Math.qarp(a, b, c, x), Math.qarp(b, c, d, x), x); };
Math.clamp = function(x, b, c) { return Math.max(b, Math.min(c, x)); };

// возвращает угол в радианах в пределах Math.PI * 2,
// т.е. например, если а = Math.PI * 2 + 0.523599 (360 + 30 град.), то Math.clampAngle(Math.PI * 2 + 0.523599) вернёт 0.52359 (30 град.)
Math.clampAngle = (a) => {
	a %= Math.PI * 2;
	if (a < 0) a += Math.PI * 2;
	return a;
};

Math.angleRotate = (start, end, step) => {
	let ss = Math.sin(start);
	let cs = Math.cos(start);
	let se = Math.sin(end);
	let ce = Math.cos(end);

	if (Math.acos(ss * se + cs * ce) > step) {
		if ((cs * se - ss * ce) > 0) {
			return Math.clampAngle(start + step);
		} else {
			return Math.clampAngle(start - step);
		}
	}

	return Math.clampAngle(end);
};

Math.rotateTowardAngle = (ang, target, step) => {
	let newangle = Math.angleRotate(ang, target, step);

	if (isNaN(newangle)) return ang;

	return newangle;
};

Math.angleDiff = (a1, a2) => {
	if (a1 === a2) return 0;

	let s1 = Math.sin(a1);
	let c1 = Math.cos(a1);
	let s2 = Math.sin(a2);
	let c2 = Math.cos(a2);
	let n = s1 * s2 + c1 * c2;

	if (n >= 1) return 0;
	if (n <= -1) return Math.PI;

	return Math.acos(n);
};

Math.PI45 = Math.PI / 4;
Math.PI60 = Math.PI / 3;
Math.PI90 = Math.PI / 2;
Math.PI360 = Math.PI * 2;
