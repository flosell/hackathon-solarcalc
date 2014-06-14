var TextMarker = function (coord, text, width, height, props) {
	var container;

	if (!(coord instanceof nokia.maps.geo.Coordinate && text &&
		width && height)) {
		throw "Invalid arguments given to TextMarker constructor";
	}

	// Call the "super" constructor to initialize properties inherited from Marker
	nokia.maps.map.Marker.call(this, coord, props);

	this.init(text, width, height, props);
};

extend(TextMarker, nokia.maps.map.Marker);

// TextMarker constructor function
TextMarker.prototype.init = function (text, width, height, props) {
	var that = this,
		// Helper function that allows us to easily set the text and color of our SVG marker.
		createIcon = function (props) {
			var iconSVG = '<svg width="__WIDTH__" height="__HEIGHT__" xmlns="http://www.w3.org/2000/svg">' +
				'<rect x="__X__" y="__Y__" rx="5" ry="5" width="__RECT_WIDTH__" height="__RECT_HEIGHT__" ' +
				'style="fill:__BRUSH__;stroke:__STROKE__;stroke-width:__STROKEWIDTH__;"/>' +
				'<text x="__OFFSETX__" y="__OFFSETY__" fill="__TEXT_PEN__" style="font-weight:normal; ' +
				'font-family:__FONTFAMILY__; font-size:__FONTSIZE__;" textContent="__TEXT__">__TEXT__</text>' +
				'</svg>',
				brush,
				pen,
				textPen;

			if (!props)
				props = {};

			// Setting properties if given else use defaults
			brush = props.brush ? props.brush : {};
			brush.color = props.brush.color || "#000";
			pen = props.pen || {};
			pen.strokeColor = props.pen.strokeColor || brush.color;
			pen.strokeWidth = props.pen.strokeWidth || 1;
			textPen = props.textPen ? props.textPen : {};
			textPen.strokeColor = props.textPen.strokeColor || "#FFF";
			textPen.fontSize = props.textPen.fontSize || 12;
			textPen.fontFamily = props.textPen.fontFamily || "arial";
			textPen.offsetX = props.textPen.offsetX || 0;
			textPen.offsetY = props.textPen.offsetY || 0;

			iconSVG = iconSVG.replace(/__TEXT__/g, text)
					.replace(/__FONTSIZE__/g, textPen.fontSize)
					.replace(/__FONTFAMILY__/g, textPen.fontFamily)
					.replace(/__BRUSH__/g, brush.color)
					.replace(/__STROKE__/g, pen.strokeColor)
					.replace(/__STROKEWIDTH__/g, pen.strokeWidth)
					.replace(/__TEXT_PEN__/g, textPen.strokeColor)
					.replace(/__WIDTH__/g, width + pen.strokeWidth)
					.replace(/__HEIGHT__/g, height + pen.strokeWidth)
					.replace(/__RECT_WIDTH__/g, width)
					.replace(/__RECT_HEIGHT__/g, height)
					.replace(/__OFFSETX__/g, textPen.offsetX)
					.replace(/__OFFSETY__/g, textPen.offsetY)
					.replace(/__OPACITY__/g, brush.opacity)
					.replace(/__X__/g, pen.strokeWidth / 2)
					.replace(/__Y__/g, pen.strokeWidth / 2);

			return new nokia.maps.gfx.GraphicsImage(that.svgParser.parseSvg(iconSVG));
		},
		icon = createIcon(props);

	this.set("icon", icon);

	/* For every created Marker we need to set the anchor property which
	 * is the point in the image that should overlap with the Marker's geo coordinate.
	 */
	this.set("anchor", new nokia.maps.util.Point(icon.width / 2, icon.height / 2));
};

// Helper property to identify instances of TextMarker
TextMarker.prototype._type = "textMarker";

TextMarker.prototype.svgParser =  new nokia.maps.gfx.SvgParser();

// To change text of the marker
TextMarker.prototype.setText = function (text) {
	this.text = text;
};