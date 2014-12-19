define([
	'goo/math/Matrix3x3',
	'goo/math/Vector3'
],
/** @lends */
function (
	Matrix3x3,
	Vector3
) {
	'use strict';

	function ScaleModifier() {
		this.name = 'ScaleModifier';
		this.type = 'Vertex';

		this.scale = new Vector3(1, 1, 1);
	}

	ScaleModifier.prototype.gui = [
		{
			key: 'scale',
			name: 'Scale',
			type: 'vec3'
		}
	];

	ScaleModifier.prototype.updateVertex = function(data) {
		data.position.mulVector(this.scale);
		data.normal.mulDirect(1/this.scale.x, 1/this.scale.y, 1/this.scale.z);
	};

	return ScaleModifier;
});