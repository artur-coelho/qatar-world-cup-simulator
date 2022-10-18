import React from 'react';
import { Col, Card } from 'react-bootstrap';
import Dustbin from './Dustbin';

const Match = ({ index, accepts, lastDroppedItem }) => {
	return (
		<Col>
			<Card className='p-2'>
				<Dustbin
					accept={accepts + ' '}
					lastDroppedItem={lastDroppedItem}
					onDrop={item => handleQuarter(index, item)}
					index={index * 2}
				></Dustbin>
				<div>X</div>
				<Dustbin
					accept={accepts + ' '}
					lastDroppedItem={lastDroppedItem}
					onDrop={item => handleQuarter(index, item)}
					index={index * 2 + 1}
				></Dustbin>
			</Card>
		</Col>
	);
};

export default Match;
