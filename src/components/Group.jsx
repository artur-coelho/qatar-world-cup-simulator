import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import Team from './Team';

const Group = ({ group, countries, setQualifiedGroup }) => {
	const [selectedTeams, setSelectedTeams] = useState({
		first: null,
		second: null,
	});

	useEffect(() => {
		setQualifiedGroup(selectedTeams, group);
	}, [selectedTeams]);

	return (
		<Col xs={12} sm={6} lg={3} className='group'>
			<div className='groupLetter d-flex justify-content-center mt-4'>
				<div className='letter'>Grupo {group}</div>
			</div>
			<hr className='mb-2 mt-0' />
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
							<div className='countryItem' key={team.id}>
								<Team
									key={team.id}
									team={team}
									type={group}
									selectedTeams={selectedTeams}
									setSelectedTeams={setSelectedTeams}
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
