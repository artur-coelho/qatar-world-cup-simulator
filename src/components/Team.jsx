import React, { useCallback } from 'react';
import { Form } from 'react-bootstrap';
import { useDrag } from 'react-dnd';
import Image from 'react-bootstrap/Image';

const Team = ({ team, type, selectedTeams, setSelectedTeams }) => {
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

	const handleClick = useCallback(({ target: { name, value } }) => {
		console.log(name, value);
		setSelectedTeams(prevState => {
			if (Number(prevState.first) === Number(name) && value === 'second') {
				return { first: null, [value]: name };
			}
			if (Number(prevState.second) === Number(name) && value === 'first') {
				return { [value]: name, second: null };
			}
			return { ...prevState, [value]: name };
		});
	}, []);

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
					className='ms-1 me-0'
					value='first'
					type='radio'
					name={id}
					id={`${country}-radio-first`}
					checked={Number(selectedTeams.first) === Number(id)}
					onChange={handleClick}
				/>
				<Form.Check
					inline
					className='ms-1 me-0'
					value='second'
					type='radio'
					name={id}
					id={`${country}-radio-second`}
					checked={Number(selectedTeams.second) === Number(id)}
					onChange={handleClick}
				/>
			</Form>
		</div>
	);
};

export default Team;
