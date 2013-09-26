define(['goo/animation/clip/TransformChannel', 'goo/animation/clip/JointData'],
/** @lends */
function (TransformChannel, JointData) {
	"use strict";

	/**
	 * @class Transform animation channel, specifically geared towards describing the motion of skeleton joints.
	 * @param {string} jointName our joint name.
	 * @param {number} jointIndex our joint index
	 * @param {number[]} times our time offset values.
	 * @param {number[]} rotations the rotations to set on this channel at each time offset.
	 * @param {number[]} translations the translations to set on this channel at each time offset.
	 * @param {number[]} scales the scales to set on this channel at each time offset.
	 */
	function JointChannel (jointName, jointIndex, translationX, translationY, translationZ, rotationX, rotationY, rotationZ, rotationW, scaleX, scaleY, scaleZ, blendType) {
		TransformChannel.call(this, JointChannel.JOINT_CHANNEL_NAME + jointIndex, translationX, translationY, translationZ, rotationX, rotationY, rotationZ, rotationW, scaleX, scaleY, scaleZ, blendType);
		console.log('...', jointIndex);
		this._jointName = jointName; //REVIEW: unused POST-REVIEW: can be used for debuggins purposes. Joint has a name even though index is used for id:ing
		this._jointIndex = jointIndex;
	}

	JointChannel.prototype = Object.create(TransformChannel.prototype);

	/**
	 * @type {string}
	 * @readonly
	 * @default
	 */
	JointChannel.JOINT_CHANNEL_NAME = '_jnt';

	/**
	 * Creates a data item for this type of channel
	 * @returns {JointData}
	 */
	JointChannel.prototype.createStateDataObject = function () {
		return new JointData();
	};

	/**
	 * Applies the channels animation state to supplied data item
	 * @param {number} sampleIndex
	 * @param {number} progressPercent
	 * @param {JointData} value The data item to apply animation to
	 */
	JointChannel.prototype.setCurrentSample = function (sampleIndex, progressPercent, jointData, time) {
		TransformChannel.prototype.setCurrentSample.call(this, sampleIndex, progressPercent, jointData, time);
		jointData._jointIndex = this._jointIndex;
	};

	/**
	 * Apply a specific index of this channel to a {@link TransformData} object.
	 * @param {number} index the index to grab.
	 * @param {JointData} [store] the TransformData to store in. If null, a new one is created.
	 * @return {JointData} our resulting TransformData.
	 */
	JointChannel.prototype.getData = function (index, store) {
		var rVal = store ? store : new JointData();
		TransformChannel.prototype.getData.call(this, index, rVal);
		rVal._jointIndex = this._jointIndex;
		return rVal;
	};

	return JointChannel;
});