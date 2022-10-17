import React from 'react';
import { Col } from 'react-bootstrap';
import Team from './Team';

const Group = ({ color, group, countries }) => {
	return (
		<Col xs={6} md={3} lg={3 / 2} className='group'>
			<div className='groupLetter' style={{ color }}>
				<div className='letter'>Grupo {group}</div>
			</div>
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
								<Team team={team} type={group} />
							</div>
						</div>
					);
				})}
			</div>
		</Col>
	);
};

export default Group;
