import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-konva';

export default class CustomImage extends PureComponent {
	handleChange = e => {
		const shape = e.target;
		// take a look into width and height properties
		// by default Transformer will change scaleX and scaleY
		// while transforming
		// so we need to adjust that properties to width and height
		this.props.onTransform({
			x: shape.x(),
			y: shape.y(),
			width: shape.width() * shape.scaleX(),
			height: shape.height() * shape.scaleY(),
			rotation: shape.rotation(),
			name: this.props.name
		});
	};

	render() {
		// console.log('this.props.image', this.props.image);
		return (
			<Image
				draggable
				image={this.props.image}
				name={this.props.name}
				x={this.props.x}
				y={this.props.y}
				width={this.props.width}
				height={this.props.height}
				scaleX={1}
				scaleY={1}
				rotation={this.props.rotation}
				onDragEnd={this.handleChange}
				onTransformEnd={this.handleChange}
				ref={node => {
					this.imageNode = node;
				}}
				// offset={1}
			/>
		);
	}
}

CustomImage.propTypes = {
	image: PropTypes.instanceOf(window.Image),
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	rotation: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired
};

CustomImage.defaultProps = {
	// image: new window.Image(),
	// width: 500,
	// height: 500,
	// rotation: 0,
	// x: 0,
	// y: 0,
	// name: ''
};
