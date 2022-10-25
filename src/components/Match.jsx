import React from 'react';
import { Col, Card } from 'react-bootstrap';
import Dustbin from './Dustbin';

const Match = ({
	index,
	accept,
	lastDroppedItem,
	onDrop,
	oponent,
	isQualified,
}) => {
	return (
		<Col xs={6} sm={3} xl='auto' className='p-0 my-2'>
			<Card
				width='124px'
				className='p-2 d-flex flex-row justify-content-center align-items-center'
			>
				<Dustbin
					accept={accept}
					lastDroppedItem={lastDroppedItem}
					onDrop={onDrop}
					key={index}
					index={index}
					stage={'eight'}
					isQualified={isQualified}
				/>
				<span className='h2 m-1 versus'>X</span>

				<Dustbin
					accept={oponent.accepts}
					lastDroppedItem={oponent.lastDroppedItem}
					onDrop={onDrop}
					key={index + 1}
					index={index + 1}
					stage={'eight'}
					isQualified={isQualified}
				/>
			</Card>
		</Col>
	);
};

export default Match;
