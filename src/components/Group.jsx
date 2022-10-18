import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import Team from './Team';

const Group = ({ color, group, countries, setQualifiedGroup }) => {
	const [selectedTeams, setSelectedTeams] = useState({
		first: null,
		second: null,
	});
	useEffect(() => {
		setQualifiedGroup(selectedTeams, group);
	}, [selectedTeams]);
	return (
		<Col xs={6} md={3} lg={3 / 2} className='group'>
			<div className='groupLetter d-flex justify-content-center mt-2'>
				<div className='letter'>Grupo {group}</div>
			</div>
			<hr className='mb-3 p-1 mt-1' />
			<div className='d-flex justify-content-between'>
				<span>Seleção</span>
				<span>
					Posição: <b className='mx-1'>1º</b> <b>2º</b>
				</span>
			</div>
			<div className='countries'>
				{countries.map(team => {
					return (
						<div className='country' key={team.id}>
							<div className='countryItem'>
								<Team
									team={team}
									type={group}
									setSelectedTeams={setSelectedTeams}
									selectedTeams={selectedTeams}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</Col>
	);
};

export default Group;
