
//**************************************************************************
//--------------------------------------------------------------------------
// Alterator - Container which can show only one contain-object
//--------------------------------------------------------------------------
//**************************************************************************
function Alterator() {
	// super
	Container.call(this);

	// set attributes
	this._map = {};
	this._stack = [];
	this._cur = null;
}

// extends Container
Alterator.prototype = Object.create(Container.prototype);
Alterator.prototype.constructor = Alterator;

//--------------------------------------------------------------------------
// Add object with key
//--------------------------------------------------------------------------
Alterator.prototype.add = function(key, object, show) {
	// set object to be invisible
	object.visible = false;

	// set object into map
	this.set(key, object);

	// add object in this(container)
	this.addChild(object);

	// show object if need
	if(show)
		this.show(key);
};

//--------------------------------------------------------------------------
// Set object into map
//--------------------------------------------------------------------------
Alterator.prototype.set = function(key, object) {
	// set object into map
	this._map[key] = object;
};

//--------------------------------------------------------------------------
// Get object from map
//--------------------------------------------------------------------------
Alterator.prototype.get = function(key) {
	// get object from map
	return this._map[key];
};

//--------------------------------------------------------------------------
// Show object by using key
//--------------------------------------------------------------------------
Alterator.prototype.show = function(key) {
	// check if current show object exists
	if(this._cur) {
		this._cur.visible = false; // set object to be invisible
		this._stack.push(this._cur); // add object into stack
	}

	// get object from map by using key
	//  and set it to be visible
	this.get(key).visible = true;

	// reset current object
	this._cur = this.get(key);
};

//--------------------------------------------------------------------------
// Hide all object
//--------------------------------------------------------------------------
Alterator.prototype.hide = function() {
	// check if current show object exists
	if(this._cur)
		this._cur.visible = false; // set object to be invisible

	// reset current object to null
	this._cur = null;
};

//--------------------------------------------------------------------------
// Show object before
//--------------------------------------------------------------------------
Alterator.prototype.before = function() {
	// check if current show object exists
	if(this._cur)
		this._cur.visible = false; // set object to be invisible

	// get object from stack
	var bef = this._stack.pop();

	// check if some object exists in stack
	if(bef)
		bef.visible = true; // set object to be visible

	// reset current object
	this._cur = bef;
};

//--------------------------------------------------------------------------
// Clear stack of all previous objects
//--------------------------------------------------------------------------
Alterator.prototype.clear = function() {
	// create new empty stack for clearing
	this._stack = [];
};





//**************************************************************************
//--------------------------------------------------------------------------
// Stacker - Container which can stack object in one direction
//--------------------------------------------------------------------------
//**************************************************************************
function Stacker(orient) {
	// super
	Container.call(this);

	// set orientation
	// - 'vert' means vertical, 'horz' means horizontal
	this._orient = orient || 'vert';

	// set stack
	this._stack = [];
}

// extends Container
Stacker.prototype = Object.create(Container.prototype);
Stacker.prototype.constructor = Stacker;

//--------------------------------------------------------------------------
// Add object
//--------------------------------------------------------------------------
Stacker.prototype.add = function(object, index) {
	// add object into stack
	this._stack.splice(index || this.size(), 0, object);

	// add object to this(container)
	this.addChild(object);

	// update stacker
	this.update();
};

//--------------------------------------------------------------------------
// Remove Object
//--------------------------------------------------------------------------
Stacker.prototype.remove = function(index) {
	// get object to remove
	var remObj = this.get(index);

	// remove object from stack
	this._stack.splice(index, 1);

	// remove object from this(container)
	this.removeChild(remObj);

	// update stacker
	this.update();
};

//--------------------------------------------------------------------------
// Update
//--------------------------------------------------------------------------
Stacker.prototype.update = function() {
	// loop all object in stack
	var i, object;
	for (i = 0; i < this.size(); i++) {
		// get object
		object = this.get(i);

		// check orientation
		if (this._orient == 'vert') {
			// vertical
			object.x = 0;
			object.y = this.pos(i - 1);
		} else {
			// horizontal
			object.x = this.pos(i - 1);
			object.y = 0;
		}
	}
};

//--------------------------------------------------------------------------
// Get number of objects
//--------------------------------------------------------------------------
Stacker.prototype.size = function() {
	// return size(length) of stack
	return this._stack.length;
};

//--------------------------------------------------------------------------
// Get position
//--------------------------------------------------------------------------
Stacker.prototype.pos = function(index) {
	// check if index is negative
	if (index < 0)
		return 0; // return 0

	// initialize result of sum value to 0
	var result = 0;

	// loop from 0 to index
	var i;
	for (i = 0; i <= index; i++) {
		// check orientation
		if (this._orient == 'vert')
			result += this.get(index).height; // vertical - sum height
		else
			result += this.get(index).width; // horizontal - sum width
	}

	// return result
	return result;
};

//--------------------------------------------------------------------------
// Get object by using index
//--------------------------------------------------------------------------
Stacker.prototype.get = function(index) {
	// return object from stack
	return this._stack[index];
};





//**************************************************************************
//--------------------------------------------------------------------------
// Nine Patch - Container which can display nine patch texture
//--------------------------------------------------------------------------
//**************************************************************************
function NinePatch(texture, width, height, border) {
	// super
	Container.call(this);

	// set attributes
	this._npTexture = texture;
	this._npWidth = width;
	this._npHeight = height;
	this._npSprites = {};
	this._npBorder = border || (Math.min(texture.width, texture.height) / 3);
	
	// add sprites
	this._addSprites();

	// set frames
	this._setFrames();

	// update sprites
	this._updateSprites();
}

// extends Container
NinePatch.prototype = Object.create(Container.prototype);
NinePatch.prototype.constructor = NinePatch;

//--------------------------------------------------------------------------
// Add sprites
//--------------------------------------------------------------------------
NinePatch.prototype._addSprites = function() {
	// create and add sprites to this(container)
	this.addChild(this._npSprites['u'] = new Sprite(this._npTexture.clone()));
	this.addChild(this._npSprites['d'] = new Sprite(this._npTexture.clone()));
	this.addChild(this._npSprites['l'] = new Sprite(this._npTexture.clone()));
	this.addChild(this._npSprites['r'] = new Sprite(this._npTexture.clone()));
	this.addChild(this._npSprites['ul'] = new Sprite(this._npTexture.clone()));
	this.addChild(this._npSprites['ur'] = new Sprite(this._npTexture.clone()));
	this.addChild(this._npSprites['dl'] = new Sprite(this._npTexture.clone()));
	this.addChild(this._npSprites['dr'] = new Sprite(this._npTexture.clone()));
	this.addChild(this._npSprites['c'] = new Sprite(this._npTexture.clone()));
};

//--------------------------------------------------------------------------
// Set frames
//--------------------------------------------------------------------------
NinePatch.prototype._setFrames = function() {
	// aliasing for shorter notation
	var tw = this._npTexture.width;
	var th = this._npTexture.height;
	var tb = this._npBorder;
	
	// create and set frames
	this._npSprites['u'].texture.frame = new Rectangle(tb, 0, tw - 2 * tb, tb);
	this._npSprites['d'].texture.frame = new Rectangle(tb, th - tb, tw - 2 * tb, tb);
	this._npSprites['l'].texture.frame = new Rectangle(0, tb, tb, th - 2 * tb);
	this._npSprites['r'].texture.frame = new Rectangle(tw - tb, tb, tb, th - 2 * tb);
	this._npSprites['ul'].texture.frame = new Rectangle(0, 0, tb, tb);
	this._npSprites['ur'].texture.frame = new Rectangle(tw - tb, 0, tb, tb);
	this._npSprites['dl'].texture.frame = new Rectangle(0, th - tb, tb, tb);
	this._npSprites['dr'].texture.frame = new Rectangle(tw - tb, th - tb, tb, tb);
	this._npSprites['c'].texture.frame = new Rectangle(tb, tb, tw - 2 * tb, th - 2 * tb);
};

//--------------------------------------------------------------------------
// Update sprites
//--------------------------------------------------------------------------
NinePatch.prototype._updateSprites = function() {
	// aliasing for shorter notation
	var w = this._npWidth;
	var h = this._npHeight;
	var b = this._npBorder;
	var s; // temporary variable for sprite

	// reset position and size of sprites
	s = this._npSprites['u']; s.x = b; s.y = 0; s.width = w - 2 * b; s.height = b;
	s = this._npSprites['d']; s.x = b; s.y = h - b; s.width = w - 2 * b; s.height = b;
	s = this._npSprites['l']; s.x = 0; s.y = b; s.width = b; s.height = h - 2 * b;
	s = this._npSprites['r']; s.x = w - b; s.y = b; s.width = b; s.height = h - 2 * b;
	s = this._npSprites['ul']; s.x = 0; s.y = 0; s.width = b; s.height = b;
	s = this._npSprites['ur']; s.x = w - b; s.y = 0; s.width = b; s.height = b;
	s = this._npSprites['dl']; s.x = 0; s.y = h - b; s.width = b; s.height = b;
	s = this._npSprites['dr']; s.x = w - b; s.y = h - b; s.width = b; s.height = b;
	s = this._npSprites['c']; s.x = b; s.y = b; s.width = w - 2 * b; s.height = h - 2 * b;
};

//--------------------------------------------------------------------------
// Resize nine-patch
//--------------------------------------------------------------------------
NinePatch.prototype.resize = function(width, height) {
	// reset size of nine-patch
	this._npWidth = width;
	this._npHeight = height;

	// update sprites
	this._updateSprites();
};





//**************************************************************************
//--------------------------------------------------------------------------
// Button - Container which can call function when it is clicked
//--------------------------------------------------------------------------
//**************************************************************************
function Button() {
	// super
	Container.call(this);

	// add interactivity
	this._addInteractive();
}

// extends Container
Button.prototype = Object.create(Container.prototype);
Button.prototype.constructor = Button;

//--------------------------------------------------------------------------
// Add interactivity
//--------------------------------------------------------------------------
Button.prototype._addInteractive = function() {
	// set interactive property to true
	this.interactive = true;

	// set button-mode property to true
	this.buttonMode = true;
};

//--------------------------------------------------------------------------
// Set click function
//--------------------------------------------------------------------------
Button.prototype.setClick = function(func, context) {
	// create click function
	var clickFunc = func.bind(context);

	// set click function
	this.on('click', clickFunc).on('tap', clickFunc);
};





//**************************************************************************
//--------------------------------------------------------------------------
// Toggle - Button which can save toggle(on/off) state
//           and apply it to function
//--------------------------------------------------------------------------
//**************************************************************************
function Toggle(toggle) {
	// super
	Button.call(this);

	// set attribute
	this._toggle = toggle || false;
}

// extends Button
Toggle.prototype = Object.create(Button.prototype);
Toggle.prototype.constructor = Toggle;

//--------------------------------------------------------------------------
// Get toggle value
//--------------------------------------------------------------------------
Toggle.prototype.getToggle = function() {
	// return toggle value
	return this._toggle;
};

//--------------------------------------------------------------------------
// Set toggle value
//--------------------------------------------------------------------------
Toggle.prototype.setToggle = function(toggle) {
	// set toggle value
	this._toggle = toggle;
};

//--------------------------------------------------------------------------
// Swap toggle value
//--------------------------------------------------------------------------
Toggle.prototype.swapToggle = function() {
	// swap toggle value
	this.setToggle(!this.getToggle());
};

//--------------------------------------------------------------------------
// Set click function
//--------------------------------------------------------------------------
Toggle.prototype.setClick = function(func, context) {
	// create click function
	var clickFunc = function() {
		this.swapToggle();
		func.call(context, this._toggle);
	};

	// set click function
	this.on('click', clickFunc).on('tap', clickFunc);
};





//**************************************************************************
//--------------------------------------------------------------------------
// Mask Container - Container which only render specific area
//--------------------------------------------------------------------------
//**************************************************************************
function MaskContainer(width, height) {
	// super
	Container.call(this);

	// set attributes
	this._maskWidth = width;
	this._maskHeight = height;

	// add mask
	this._addMask();

	// update mask
	this._updateMask();
}

// extends Container
MaskContainer.prototype = Object.create(Container.prototype);
MaskContainer.prototype.constructor = MaskContainer;

//--------------------------------------------------------------------------
// Add mask
//--------------------------------------------------------------------------
MaskContainer.prototype._addMask = function() {
	// create mask area by using graphics object
	this._maskArea = new Graphics();

	// add mask to this(container)
	this.addChild(this._maskArea);

	// set mask
	this.mask = this._maskArea;
};

//--------------------------------------------------------------------------
// Update mask
//--------------------------------------------------------------------------
MaskContainer.prototype._updateMask = function() {
	// clear mask area
	this._maskArea.clear();

	// draw mask area
	this._maskArea.beginFill();
	this._maskArea.drawRect(0, 0, this._maskWidth, this._maskHeight);
	this._maskArea.endFill();
};

//--------------------------------------------------------------------------
// Resize mask
//--------------------------------------------------------------------------
MaskContainer.prototype.resize = function(width, height) {
	// reset size of mask
	this._maskWidth = width;
	this._maskHeight = height;

	// update mask
	this._updateMask();
};

//--------------------------------------------------------------------------
// Get mask area
//--------------------------------------------------------------------------
MaskContainer.prototype.getArea = function() {
	return this._maskArea;
};





//**************************************************************************
//--------------------------------------------------------------------------
// Draggable - Container which can be dragged
//--------------------------------------------------------------------------
//**************************************************************************
function Draggable(constraint) {
	// super
	Container.call(this);
	
	// set attributes
	this.constraint = constraint || null;
	this._dragFunc = null;

	// add interactivity
	this._addInteractive();

	// add drag functions
	this._addDrag();
}

// extends Container
Draggable.prototype = Object.create(Container.prototype);
Draggable.prototype.constructor = Draggable;

//--------------------------------------------------------------------------
// Add interactivity
//--------------------------------------------------------------------------
Draggable.prototype._addInteractive = function() {
	// set interactive property to true
	this.interactive = true;

	// set button-mode property to true
	this.buttonMode = true;
};

//--------------------------------------------------------------------------
// Add drag funtions
//--------------------------------------------------------------------------
Draggable.prototype._addDrag = function() {
	// add drag functions
	this.on('mousedown', this._dragStart).on('touchstart', this._dragStart);
	this.on('mousemove', this._dragMove).on('touchmove', this._dragMove);
	this.on('mouseup', this._dragEnd).on('touchend', this._dragEnd);
	this.on('mouseupoutside', this._dragEnd).on('touchendoutside', this._dragEnd);
};

//--------------------------------------------------------------------------
// Drag start function
//--------------------------------------------------------------------------
Draggable.prototype._dragStart = function(event) {
	// set drag data
	this._dragData = event.data;
	this._dragOrg = {x : this.x, y : this.y};
	this._dragPos = event.data.global.clone();
	this._dragging = true;
};

//--------------------------------------------------------------------------
// Drag move function
//--------------------------------------------------------------------------
Draggable.prototype._dragMove = function() {
	// check if not dragging
	if (!this._dragging)
		return; // need not move

	// calculate difference of drag position
	var difX = this._dragData.global.x - this._dragPos.x;
	var difY = this._dragData.global.y - this._dragPos.y;

	// get move position
	var movePos = this._getMovePos(difX, difY);

	// set position
	this.position.set(movePos.x, movePos.y);

	// check if custom drag function exists
	if (this._dragFunc)
		this._dragFunc(); // call custom drag function
};

//--------------------------------------------------------------------------
// Get drag move position
//--------------------------------------------------------------------------
Draggable.prototype._getMovePos = function(difX, difY) {
	// create bound object of this
	var fixBound = {width : this.width, height : this.height,
		x : (this._dragOrg.x + difX), y : (this._dragOrg.y + difY)};

	// check if constraint exists
	if (this.constraint) {
		// create bound object of constraint object
		var consBound = this.parent.toLocal(
			this.constraint.position, this.constraint.parent);
		consBound.width = this.constraint.width;
		consBound.height = this.constraint.height;

		// fix position by considering constraint
		if (fixBound.x < consBound.x)
			fixBound.x = consBound.x;
		if (fixBound.y < consBound.y)
			fixBound.y = consBound.y;
		if (fixBound.x + fixBound.width > consBound.x + consBound.width)
			fixBound.x = consBound.x + consBound.width - fixBound.width;
		if (fixBound.y + fixBound.height > consBound.y + consBound.height)
			fixBound.y = consBound.y + consBound.height - fixBound.height;
	}

	// return bound object which contains position info.
	return fixBound;
};

//--------------------------------------------------------------------------
// Drag end function
//--------------------------------------------------------------------------
Draggable.prototype._dragEnd = function() {
	// erase drag data
	this._dragData = null;
	this._dragStartPos = null;
	this._dragging = false;
};

//--------------------------------------------------------------------------
// Set custom drag function
//--------------------------------------------------------------------------
Draggable.prototype.setDrag = function(func, context) {
	// create and set custom drag function
	this._dragFunc = func.bind(context);
};





//**************************************************************************
//--------------------------------------------------------------------------
// Scroll Container - Mask Container which can scroll contents in it
//--------------------------------------------------------------------------
//**************************************************************************
function ScrollContainer(scrWidth, scrHeight, conWidth, conHeight) {
	// super
	MaskContainer.call(this, scrWidth, scrHeight);

	// set attributes
	this._scrWidth = scrWidth;
	this._scrHeight = scrHeight;
	this._conWidth = conWidth || scrWidth;
	this._conHeight = conHeight || scrHeight;
	this.contents = null;
	this._scroller = null;

	this._addScroller();
	this._addContents();

	this._updateScroller();
}

// extends MaskContainer
ScrollContainer.prototype = Object.create(MaskContainer.prototype);
ScrollContainer.prototype.constructor = ScrollContainer;

//--------------------------------------------------------------------------
// Add scroller
//--------------------------------------------------------------------------
ScrollContainer.prototype._addScroller = function() {
	// create scroller by using graphics object
	this._scroller = new Graphics();

	// add scroller to this(mask-container)
	this.addChild(this._scroller);

	// set scroller to be invisible
	this._scroller.visible = false;
};

//--------------------------------------------------------------------------
// Add contents
//--------------------------------------------------------------------------
ScrollContainer.prototype._addContents = function() {
	// create contents by using draggable object
	this.contents = new Draggable(this._scroller);

	// add contents to this(mask-container)
	this.addChild(this.contents);
};

//--------------------------------------------------------------------------
// Update scroller
//--------------------------------------------------------------------------
ScrollContainer.prototype._updateScroller = function() {
	// calculate bound(area) of scroller
	var bound = {};
	if (this._scrWidth >= this._conWidth) {
		bound.x = 0;
		bound.width = this._conWidth;
	} else {
		bound.x = this._scrWidth - this._conWidth;
		bound.width = 2 * this._conWidth - this._scrWidth;
	}
	if (this._scrHeight >= this._conHeight) {
		bound.y = 0;
		bound.height = this._conHeight;
	} else {
		bound.y = this._scrHeight - this._conHeight;
		bound.height = 2 * this._conHeight - this._scrHeight;
	}

	// draw scroller
	this._scroller.clear();
	this._scroller.beginFill();
	this._scroller.drawRect(bound.x, bound.y, bound.width, bound.height);
	this._scroller.endFill();

	// set position of scroller
	this._scroller.position.set(bound.x, bound.y);
};

//--------------------------------------------------------------------------
// Update size of contents
//--------------------------------------------------------------------------
ScrollContainer.prototype.update = function(conWidth, conHeight) {
	// reset size of contents
	this._conWidth = conWidth;
	this._conHeight = conHeight;
	
	// update scroller
	this._updateScroller();
};

//--------------------------------------------------------------------------
// Resize scroller
//--------------------------------------------------------------------------
ScrollContainer.prototype.resize = function(scrWidth, scrHeight) {
	// super
	MaskContainer.prototype.resize.call(this, scrWidth, scrHeight);

	// reset size of scroller
	this._scrWidth = scrWidth;
	this._scrHeight = scrHeight;

	// update scroller
	this._updateScroller();
};





//**************************************************************************
//--------------------------------------------------------------------------
// Text Button - Button which contains nine patch and text
//--------------------------------------------------------------------------
//**************************************************************************
function TextButton(texture, width, height, text, color, align, padding, offsetY) {
	// super
	Button.call(this);

	// set attributes
	this._tbTexture = texture;
	this._tbWidth = width;
	this._tbHeight = height;
	this._tbText = text || '';
	this._tbAlign = align || 1;
	this._tbPadding = padding || 10;
	this._tbOffsetY = offsetY || -0.08;
	this._tbStyle = {font : 'bold ' + (this._tbHeight - 2 * this._tbPadding)
		+ 'px sans-serif', fill : color || 'white'};

	// add nine-patch and text-object
	this._addNinePatch();
	this._addText()

	// update nine-patch and text-object
	this._updateNinePatch();
	this._updateText();
}

// extends Button
TextButton.prototype = Object.create(Button.prototype);
TextButton.prototype.constructor = TextButton;

//--------------------------------------------------------------------------
// Add nine patch
//--------------------------------------------------------------------------
TextButton.prototype._addNinePatch = function() {
	// create nine-patch and add it to this(button)
	this._tbNinePatch = new NinePatch(this._tbTexture, this._tbWidth, this._tbHeight);
	this.addChild(this._tbNinePatch);
};

//--------------------------------------------------------------------------
// Add text object
//--------------------------------------------------------------------------
TextButton.prototype._addText = function() {
	// create text-object and add it to this(button)
	this._tbTextObject = new Text(this._tbText, this._tbStyle);
	this.addChild(this._tbTextObject);
};

//--------------------------------------------------------------------------
// Update nine patch
//--------------------------------------------------------------------------
TextButton.prototype._updateNinePatch = function() {
	// resize nine-patch
	this._tbNinePatch.resize(this._tbWidth, this._tbHeight);
};

//--------------------------------------------------------------------------
// Update text object
//--------------------------------------------------------------------------
TextButton.prototype._updateText = function() {
	// aliasing for shorter notation
	var tbto = this._tbTextObject;

	// reset test and style
	tbto.text = this._tbText;
	tbto.style = this._tbStyle;

	// reset x position
	if (this._tbAlign == 0)
		tbto.x = this._tbPadding;
	else if (this._tbAlign == 1)
		tbto.x = (this._tbWidth - tbto.width) / 2;
	else
		tbto.x = (this._tbWidth - tbto.width) - this._tbPadding;

	// reset y position
	tbto.y = (this._tbHeight - tbto.height +
		this._tbHeight * this._tbOffsetY) / 2;
};

//--------------------------------------------------------------------------
// Resize button
//--------------------------------------------------------------------------
TextButton.prototype.resize = function(width, height) {
	// reset size
	this._tbWidth = width;
	this._tbHeight = height;

	// update nine-patch and text-object
	this._updateNinePatch();
	this._updateText();
};

//--------------------------------------------------------------------------
// Set text
//--------------------------------------------------------------------------
TextButton.prototype.setText = function(text, padding, style, align, offsetY) {
	// reset attributes of text
	this._tbText = text;
	this._tbPadding = padding || this._tbPadding;
	this._tbStyle = style || this._tbStyle;
	this._tbAlign = align || this._tbAlign;
	this._tbOffsetY = offsetY || this._tbOffsetY;

	// update text-object
	this._updateText();
};

//--------------------------------------------------------------------------
// Fit button size to text
//--------------------------------------------------------------------------
TextButton.prototype.fit = function() {
	// aliasing for shorter notation
	var tbto = this._tbTextObject;
	var padding = this._tbPadding;
	var offsetY = this._tbOffsetY;

	// calculate size to fit
	var fitWidth = tbto.width + 2 * padding;
	var fitHeight = tbto.height * (1 - offsetY) + 2 * padding;

	// resize to fit
	this.resize(fitWidth, fitHeight);
};





//**************************************************************************
//--------------------------------------------------------------------------
// Image Button - Button which contains image sprite
//--------------------------------------------------------------------------
//**************************************************************************
function ImageButton(texture, width, height) {
	// super
	Button.call(this);

	// set attributes
	this._ibTexture = texture;
	this._ibWidth = width;
	this._ibHeight = height;

	// add image
	this._addImage();

	// update image
	this._updateImage();
}

// extends Button
ImageButton.prototype = Object.create(Button.prototype);
ImageButton.prototype.constructor = ImageButton;

//--------------------------------------------------------------------------
// Add image
//--------------------------------------------------------------------------
ImageButton.prototype._addImage = function() {
	// create image by using sprite-object
	this._ibImage = new Sprite(this._ibTexture);

	// add image to this(button)
	this.addChild(this._ibImage);
};

//--------------------------------------------------------------------------
// Update image
//--------------------------------------------------------------------------
ImageButton.prototype._updateImage = function() {
	// reset size of image sprite
	this._ibImage.width = this._ibWidth;
	this._ibImage.height = this._ibHeight;
};

//--------------------------------------------------------------------------
// Resize button
//--------------------------------------------------------------------------
ImageButton.prototype.resize = function(width, height) {
	// reset size
	this._ibWidth = width;
	this._ibHeight = height;

	// update image
	this._updateImage();
};





//**************************************************************************
//--------------------------------------------------------------------------
// Image Toggle - Toggle which contains image sprite
//--------------------------------------------------------------------------
//**************************************************************************
function ImageToggle(textureOn, textureOff, width, height, toggle) {
	// super
	Toggle.call(this, toggle);

	// set attributes
	this._itTexOn = textureOn;
	this._itTexOff = textureOff;
	this._itWidth = width;
	this._itHeight = height;

	// add image
	this._addImage();

	// update image
	this._updateImage();
}

// extends Toggle
ImageToggle.prototype = Object.create(Toggle.prototype);
ImageToggle.prototype.constructor = ImageToggle;

//--------------------------------------------------------------------------
// Add image
//--------------------------------------------------------------------------
ImageToggle.prototype._addImage = function() {
	// create image by using sprite-object
	this._itImage = new Sprite(
		this.getToggle() ? this._itTexOn : this._itTexOff);

	// add image to this(button)
	this.addChild(this._itImage);
};

//--------------------------------------------------------------------------
// Update image
//--------------------------------------------------------------------------
ImageToggle.prototype._updateImage = function() {
	// reset size of image sprite
	this._itImage.width = this._itWidth;
	this._itImage.height = this._itHeight;
};

//--------------------------------------------------------------------------
// Set toggle
//--------------------------------------------------------------------------
ImageToggle.prototype.setToggle = function(toggle) {
	// super
	Toggle.prototype.setToggle.call(this, toggle);

	// change texture of image sprite
	this._itImage.texture = toggle ? this._itTexOn : this._itTexOff;
};

//--------------------------------------------------------------------------
// Resize button
//--------------------------------------------------------------------------
ImageToggle.prototype.resize = function(width, height) {
	// reset size
	this._itWidth = width;
	this._itHeight = height;

	// update image
	this._updateImage();
};





//**************************************************************************
//--------------------------------------------------------------------------
// Text Field - Text button which can input text by using keyboard
//--------------------------------------------------------------------------
//**************************************************************************
function TextField(texture, width, height, text, autofit, type, color, align) {
	// super
	TextButton.call(this,
		texture, width, height, text, color || 'black', align || 0);
	
	// set attributes
	this._tfText = text;
	this._tfAutofit = autofit || false;
	this._tfType = type || 'text';
	this._tfInput = null;
	this._tfInputFunc = null;

	// add input element and click function
	this._addInput();
	this._addClick();
	
	// check if auto-fit is needed
	if(this._tfAutofit)
		this.fit(); // auto-fit
}

// extends TextButton
TextField.prototype = Object.create(TextButton.prototype);
TextField.prototype.constructor = TextField;

//--------------------------------------------------------------------------
// Add input element
//--------------------------------------------------------------------------
TextField.prototype._addInput = function() {
	// create input element
	this._tfInput = document.createElement('input');

	// set input element attributes
	this._tfInput.type = this._tfType;
	this._tfInput.style.opacity = 0;
	this._tfInput.onkeyup = this._updateInput.bind(this);
	this._tfInput.onkeydown = this._updateInput.bind(this);
	this._tfInput.onkeypress = this._updateInput.bind(this);

	// add input element to body of document
	document.body.appendChild(this._tfInput);
};

//--------------------------------------------------------------------------
// Add click function
//--------------------------------------------------------------------------
TextField.prototype._addClick = function() {
	// set empty click function
	this.setClick(function() {}, this);
};

//--------------------------------------------------------------------------
// Remove input element
//--------------------------------------------------------------------------
TextField.prototype._removeInput = function() {
	// remove input element from body of document
	document.body.removeChild(this._tfInput);

	// set input element to null
	this._tfInput = null;
};

//--------------------------------------------------------------------------
// Update input event
//--------------------------------------------------------------------------
TextField.prototype._updateInput = function(event) {
	// reset text from input element value
	this._tfText = this._tfInput.value;
	this.setText(this._tfText);

	// check if auto-fit is needed
	if (this._tfAutofit)
		this.fit(); // auto-fit

	// check if custom input function exists
	if (this._tfInputFunc)
		this._tfInputFunc(); // call custom input function

	// check if key is enter
	if (event.keyCode == 13)
		this._removeInput(); // remove input
};

//--------------------------------------------------------------------------
// Set focus
//--------------------------------------------------------------------------
TextField.prototype._setFocus = function() {
	// set focus to input element
	this._tfInput.focus();

	// set cursor to end of input text
	this._tfInput.value = '';
	this._tfInput.value = this._tfText;
};

//--------------------------------------------------------------------------
// Set click function
//--------------------------------------------------------------------------
TextField.prototype.setClick = function(func, context) {
	// create click function
	var clickFunc = function() {
		if (!this._tfInput)
			this._addInput();
		this._setFocus();
		func.call(context);
	};

	// super
	TextButton.prototype.setClick.call(this, clickFunc, this);
};

//--------------------------------------------------------------------------
// Set input function
//--------------------------------------------------------------------------
TextField.prototype.setInput = function(func, context) {
	// create and set custom input function
	this._tfInputFunc = func.bind(context);
};

//--------------------------------------------------------------------------
// Get text
//--------------------------------------------------------------------------
TextField.prototype.getText = function() {
	// return text value
	return this._tfText;
};





//**************************************************************************
//--------------------------------------------------------------------------
// Choice List - Text button which can choose item in choice list
//--------------------------------------------------------------------------
//**************************************************************************
function ChoiceList(texBtn, texCon, width, height, list, color, index, padding) {
	// super
	TextButton.call(this,
		texBtn, width, height, index ? list[index] : list[0]);
	
	// set attributes
	this._clTexBtn = texBtn;
	this._clTexCon = texCon;
	this._clWidth = width;
	this._clHeight = height;
	this._clList = list;
	this._clColor = color || 'black';
	this._clIndex = index || 0;
	this._clPadding = padding || 10;
	this._clChoiceFunc = null;

	// add choice list and click function
	this._addChoice();
	this._addClick();

	// update choice list
	this._updateChoice();
}

// extends TextButton
ChoiceList.prototype = Object.create(TextButton.prototype);
ChoiceList.prototype.constructor = ChoiceList;

//--------------------------------------------------------------------------
// Add choice list
//--------------------------------------------------------------------------
ChoiceList.prototype._addChoice = function() {
	// style of choice list text
	var style = {font : (this._clHeight - 20) + 'px sans-serif',
		fill : this._clColor};

	// create stacker for add choices (foreground of choice list)
	this._clChoiceFore = new Stacker();

	// create choices and add then to stacker(foreground)
	var i; // loop for each list item
	for (i = 0; i < this._clList.length; i++) {
		// create text and button object
		var text = new Text(this._clList[i], style);
		var btn = new Button();

		// create click function
		var clickFunc = function(index) {
			// reset index
			this._clIndex = index;

			// reset text to selected item
			console.log(this._clList);
			this.setText(this._clList[index]);

			// check if custom choice function exists
			if (this._clChoiceFunc)
				this._clChoiceFunc(); // call custom choice function
		};

		// add text to button
		btn.addChild(text);

		// set click function of button
		btn.setClick(clickFunc.bind(this, i), this);

		// add choice item to foreground of choice list
		this._clChoiceFore.add(btn);
	}

	// create background of choice list by nine-patch
	this._clChoiceBack = new NinePatch(
		this._clTexCon, this._clWidth, this._clHeight);

	// add stacker(foreground) into nine-patch(background)
	this._clChoiceBack.addChild(this._clChoiceFore);

	// set choice list to be invisible
	this._clChoiceBack.visible = false;

	// add choice list in this(text-button)
	this.addChild(this._clChoiceBack);
};

//--------------------------------------------------------------------------
// Update choice list
//--------------------------------------------------------------------------
ChoiceList.prototype._updateChoice = function() {
	// resize background
	this._clChoiceBack.resize(this._clWidth,
		this._clChoiceFore.height + 2 * this._clPadding);
	
	// reset position of background
	this._clChoiceBack.position.set(0, this._clHeight);

	// reset position of foreground
	this._clChoiceFore.position.set(this._clPadding, this._clPadding);
};

//--------------------------------------------------------------------------
// Add click function
//--------------------------------------------------------------------------
ChoiceList.prototype._addClick = function() {
	// set empty click function
	this.setClick(function() {}, this);
};

//--------------------------------------------------------------------------
// Resize button and choice list
//--------------------------------------------------------------------------
ChoiceList.prototype.resize = function(width, height) {
	// super
	TextButton.prototype.resize.call(this, width, height);

	// reset size
	this._clWidth = width;
	this._clHeight = height;

	// update choice list
	this._updateChoice();
};

//--------------------------------------------------------------------------
// Set click function
//--------------------------------------------------------------------------
ChoiceList.prototype.setClick = function(func, context) {
	// create click function
	var clickFunc = function() {
		// change visibility of choice list
		this._clChoiceBack.visible = !this._clChoiceBack.visible;

		// custom function
		func.call(context);
	};

	// super
	TextButton.prototype.setClick.call(this, clickFunc, this);
};

//--------------------------------------------------------------------------
// Set custom choice function
//--------------------------------------------------------------------------
ChoiceList.prototype.setChoice = function(func, context) {
	// create and set choice function
	this._clChoiceFunc = func.bind(context);
};

//--------------------------------------------------------------------------
// Get index of selected item
//--------------------------------------------------------------------------
ChoiceList.prototype.getIndex = function() {
	// return choice index
	return this._clIndex;
};

