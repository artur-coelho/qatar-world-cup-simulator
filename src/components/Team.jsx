import React from 'react';
import { Form } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { useDrag } from 'react-dnd';

const Team = ({ team, type }) => {
	let { country, id, name } = team;

	const [{ isDragging }, drag] = useDrag(
		() => ({
			type,
			item: { country, id },
			collect: monitor => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[country, id, type]
	);
	return (
		<div className='w-100 d-flex justify-content-between'>
			<div>
				<Image
					ref={drag}
					src={`assets/images/countries/${country}.png`}
					rounded
					width={32}
					height='24px'
					title={country}
					style={{
						transform: isDragging ? 'scale(1.2)' : 'scale(1)',
						cursor: 'grab',
					}}
				/>
				<span className='countryName'>{name}</span>
			</div>
			<Form>
				<Form.Check
					inline
					type='radio'
					id={`${country}-radio-first`}
					className='ms-1 me-0'
				/>
				<Form.Check
					inline
					type='radio'
					id={`${country}-radio-second`}
					className='ms-1 me-0'
				/>
			</Form>
		</div>
	);
};

export default Team;
