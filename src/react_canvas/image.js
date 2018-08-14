import React, { PureComponent } from 'react';
import { Image } from 'react-konva';

export default class VaderImage extends PureComponent {
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
				x={this.props.x}
				y={this.props.y}
				scaleX={1}
				scaleY={1}
				width={this.props.width}
				height={this.props.height}
				rotation={this.props.rotation}
				onDragEnd={this.handleChange}
				onTransformEnd={this.handleChange}
				name={this.props.name}
				ref={node => {
					this.imageNode = node;
				}}
				offset={1}
			/>
		);
	}
}
