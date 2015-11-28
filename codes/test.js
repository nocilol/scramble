
//**************************************************************************
// Test - Test
//**************************************************************************
function Test() {
	// static class
	throw new Error('This is a static class');
}

//--------------------------------------------------------------------------
// Call test
//--------------------------------------------------------------------------
Test.call = function() {
	// image lists
	this._bgImage = 'images/Background.png';
	this._catImage = 'images/Cat.png';
	this._dogImage = 'images/Dog.png';
	this._npImage = 'ui/red_button08.png';

	// clear stage
	StageManager.clear();

	// reset loader
	loader.reset();

	// load images and setup test
	var that = this;
	loader.add([this._bgImage, this._catImage, this._dogImage, this._npImage])
	.load(function() {
		that.setup.call(that);
	});
};

//--------------------------------------------------------------------------
// Setup test
//--------------------------------------------------------------------------
Test.setup = function() {
	// create container and add background, cat, dog sprites in it
	this._container = new Container();
	this._bgSprite = new Sprite(loader.resources[this._bgImage].texture);
	this._catSprite = new Sprite(loader.resources[this._catImage].texture);
	this._dogSprite = new Sprite(loader.resources[this._dogImage].texture);
	this._container.addChild(this._bgSprite);
	this._container.addChild(this._catSprite);
	this._container.addChild(this._dogSprite);

	// create nine-patch
	this._ninePatch = new NinePatch(
		loader.resources[this._npImage].texture, 300, 200);

	// create toggle and add it to container
	this._toggle = new Toggle(false);
	this._toggle.addChild(this._ninePatch);
	this._toggle.position.set(700, 10);
	this._toggle.setClick(this._click, this);
	this._container.addChild(this._toggle);

	// set size of background
	this._bgSprite.width = 1024;
	this._bgSprite.height = 768;

	// set animate function
	StageManager.setAnimate(this._animate, this);

	// add container in stage and show it
	StageManager.stage.add('test', this._container, true);
};

//--------------------------------------------------------------------------
// Animate function of test
//--------------------------------------------------------------------------
Test._animate = function() {
	// move cat sprite by (2, 1)
	this._catSprite.x += 2;
	this._catSprite.y += 1;
};

//--------------------------------------------------------------------------
// Click function of toggle
//--------------------------------------------------------------------------
Test._click = function(toggle) {
	// reset position of cat sprite
	var resetPos = toggle ? 0 : 200;
	this._catSprite.position.set(resetPos, resetPos);
};
