define([
	'goo/statemachine/actions/Action'
],
/** @lends */
function(
	Action
) {
	"use strict";

	function LogVariableAction(id, settings) {
		Action.apply(this, arguments);

		this.currentTime = 0;
	}

	LogVariableAction.prototype = Object.create(Action.prototype);

	LogVariableAction.prototype.configure = function(settings) {
		this.everyFrame = !!settings.everyFrame;
		this.message = settings.message || '';
	};

	LogVariableAction.external = {
		parameters: [{
			name: 'Message',
			key: 'message',
			type: 'string',
			description: 'message to print',
			'default': 'hello'
		}, {
			name: 'On every frame',
			key: 'everyFrame',
			type: 'boolean',
			description: 'Do this action every frame',
			'default': false
		}],
		transitions: []
	};

	LogVariableAction.prototype._run = function(/*fsm*/) {
		console.log(this.message);
	};

	return LogVariableAction;
});