require([
	'lib/V',

	'goo/math/Vector3',
	'goo/renderer/pass/Composer',
	'goo/renderer/pass/RenderPass',
	'goo/renderer/pass/FurPass',

	'goo/shapes/Sphere',
	'goo/util/TangentGenerator'
],
function(
	V,

	Vector3,
	Composer,
	RenderPass,
	FurPass,

	Sphere,
	TangentGenerator
	) {
	"use strict";

	var gui;

	var goo;

	function init() {
		V.describe('Its getting hairy!');

		goo = V.initGoo();

		gui = new window.dat.GUI();

		createFurRenderingRoutine();

		var material = V.getColoredMaterial();

		var meshData = new Sphere(32, 32);

		TangentGenerator.addTangentBuffer(meshData);

		var entity = goo.world.createEntity(
						meshData,
						material
					).addToWorld();
		var s = 40;
		entity.setScale(s, s, s);

		V.addOrbitCamera(new Vector3(90, Math.PI / 2, 0));
		//V.addLights();

		V.process();
	}

	function createFurRenderingRoutine() {

		var renderList = goo.world.getSystem('RenderSystem').renderList;
		var composer = new Composer();

		var regularPass = new RenderPass(renderList);
		regularPass.renderToScreen = true;

		// TODO: Add filter , to only render entities with FurComponents in the FurPass.
		var furPass = new FurPass(renderList);
		furPass.clear = false;

		var furFolder = gui.addFolder("Fur settings");
		furFolder.add(furPass.furUniforms, 'furRepeat', 1, 10);
		furFolder.add(furPass.furUniforms, 'hairLength', 0.05, 10);
		furFolder.add(furPass.furUniforms, 'curlFrequency', 0, 20);
		furFolder.add(furPass.furUniforms, 'curlRadius', -0.02, 0.02);
		furFolder.add(furPass.furUniforms, 'gravity', 0, 20.0);
		furFolder.add(furPass.furUniforms, 'sinusAmount', 0, 20.0);
		furFolder.open();

		composer.addPass(regularPass);
		composer.addPass(furPass);

		console.log(goo.world.getSystem('RenderSystem').composers);

		goo.world.getSystem('RenderSystem').composers.push(composer);
	}

	init();
});