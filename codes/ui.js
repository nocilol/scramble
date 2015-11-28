
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
// Alterator - Container which can call function when it is clicked
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
	var clickFunc = function() {
		func.call(context);
	};

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
	this._toggle = !this._toggle;
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
	this._dragFunc = function() {
		func.call(context);
	};
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

