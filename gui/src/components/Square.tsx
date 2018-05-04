import * as React from 'react'
import * as Igokabaddi from '../modules/igokabaddi'

interface SquareProps {
	square: Igokabaddi.Square;
}

export class Square extends React.Component<SquareProps> {
	state: Igokabaddi.Square;
	constructor(props: SquareProps) {
		super(props);
		this.state = props.square;
	}
	render() {
		switch (this.state.color) {
		case Igokabaddi.Color.Red:
			return <button className="square red"></button>;
		case Igokabaddi.Color.Blue:
			return <button className="square blue"></button>;
		case Igokabaddi.Color.Neut:
			return <button className="square neut"></button>;
		}
	}
}


