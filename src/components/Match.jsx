import React, { useState, useEffect } from 'react';
import { Col, Card } from 'react-bootstrap';
import Dustbin from './Dustbin';

const Match = ({
	index,
	accept,
	lastDroppedItem,
	onDrop,
	oponent,
	isQualified,
	setMatchWinner,
}) => {
	const [winner, setWinner] = useState(null);

	useEffect(() => {
		setMatchWinner(winner);
	}, [winner]);

	return (
		<Col
			xs={6}
			sm={3}
			xxl='auto'
			className='p-0 my-2 d-flex justify-content-center'
		>
			<Card className='matchCard p-2 d-flex flex-row justify-content-center '>
				<Dustbin
					accept={accept}
					lastDroppedItem={lastDroppedItem}
					onDrop={onDrop}
					key={index}
					index={index}
					stage={'eight'}
					isQualified={isQualified}
					winner={winner}
					setWinner={setWinner}
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
					winner={winner}
					setWinner={setWinner}
				/>
			</Card>
		</Col>
	);
};

export default Match;
