import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import update from 'immutability-helper';
import Group from './Group';
import Dustbin from './Dustbin';
import Trophy from '../assets/logo/trophy.png';
import countries from '../assets/data/countries.json';
import { compareArrays } from '../helpers/compareArrays';
import {
	groupStageData,
	quarterData,
	qualifiedData,
	semifinalData,
	finalData,
	winnerData,
} from '../assets/data/identifiers';
import { Container, Row } from 'react-bootstrap';
import Match from './Match';

function randomInRange(min, max) {
	return Math.random() * (max - min) + min;
}

const canvasStyles = {
	position: 'fixed',
	pointerEvents: 'none',
	width: '100%',
	height: '100%',
	top: 0,
	left: 0,
};

function getAnimationSettings(originXA, originXB) {
	return {
		startVelocity: 30,
		spread: 360,
		ticks: 60,
		zIndex: 0,
		particleCount: 150,
		origin: {
			x: randomInRange(originXA, originXB),
			y: Math.random() - 0.2,
		},
	};
}

const Teams = () => {
	const [dustbins, setDustbins] = useState(groupStageData);
	const [quarter, setQuarter] = useState(quarterData);
	const [qualified, setQualified] = useState(qualifiedData);
	const [semifinal, setSemifinal] = useState(semifinalData);
	const [final, setFinal] = useState(finalData);
	const [winner, setWinner] = useState(winnerData);
	const refAnimationInstance = useRef(null);
	const [intervalId, setIntervalId] = useState();

	const [firstQualifieds, setFirstQualifieds] = useState({
		A: null,
		B: null,
		C: null,
		D: null,
		E: null,
		F: null,
		G: null,
		H: null,
	});

	// console.log(firstQualifieds);
	// console.log('Dustbins: ', dustbins);
	// console.log('Quarter', quarter);

	const setQualifiedGroup = useCallback((group, groupName) => {
		setFirstQualifieds(prevState => {
			return { ...prevState, [groupName]: group };
		});
	});

	useEffect(() => {
		Object.keys(firstQualifieds).forEach((key, index) => {
			// console.log(firstQualifieds[key]?.first);
			// dustbins[index * 2].lastDroppedItem = firstQualifieds[key]?.first;
			// dustbins[index * 2 + 1].lastDroppedItem = firstQualifieds[key]?.second;
			setDustbins(
				update(dustbins, {
					[index * 2]: {
						lastDroppedItem: {
							$set: firstQualifieds[key]?.first,
						},
					},
					[index * 2 + 1]: {
						lastDroppedItem: {
							$set: firstQualifieds[key]?.second,
						},
					},
				})
			);
			console.log(dustbins);
		});
	}, [firstQualifieds]);

	const getInstance = useCallback(instance => {
		refAnimationInstance.current = instance;
	}, []);

	const nextTickAnimation = useCallback(() => {
		if (refAnimationInstance.current) {
			refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
			refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
		}
	}, []);

	const startAnimation = useCallback(() => {
		if (!intervalId) {
			setIntervalId(setInterval(nextTickAnimation, 400));
		}
	}, [intervalId, nextTickAnimation]);

	const pauseAnimation = useCallback(() => {
		clearInterval(intervalId);
		setIntervalId(null);
	}, [intervalId]);

	const stopAnimation = useCallback(() => {
		clearInterval(intervalId);
		setIntervalId(null);
		refAnimationInstance.current && refAnimationInstance.current.reset();
	}, [intervalId]);

	const handleDrop = useCallback(
		(index, item) => {
			if (
				dustbins[index].lastDroppedItem !== item &&
				dustbins[index + 1]?.lastDroppedItem !== item &&
				dustbins[index - 1]?.lastDroppedItem !== item
			) {
				setDustbins(
					update(dustbins, {
						[index]: {
							lastDroppedItem: {
								$set: item,
							},
						},
					})
				);
			}
		},
		[dustbins]
	);

	const handleQuarter = useCallback(
		(index, item) => {
			if (
				dustbins[index].lastDroppedItem !== item &&
				dustbins[index + 1]?.lastDroppedItem !== item &&
				dustbins[index - 1]?.lastDroppedItem !== item
			) {
				const result = compareArrays(quarter, dustbins[index], index, item);

				setQuarter(result);
			}
		},
		[quarter]
	);

	const handleFinalStages = useCallback((index, item, array, setState) => {
		setState(
			update(array, {
				[index]: {
					lastDroppedItem: {
						$set: item,
					},
				},
			})
		);
	}, []);

	useEffect(() => {
		return () => {
			clearInterval(intervalId);
		};
	}, [intervalId]);

	useEffect(() => {
		if (winner[0].lastDroppedItem !== null) {
			startAnimation();
		}
	}, [winner]);

	return (
		<Container>
			<Row className='d-flex justify-content-space-between'>
				{countries.map(country => {
					return (
						<Group
							key={country.group}
							color={country.color}
							group={country.group}
							countries={country.countries}
							id={country.id}
							setQualifiedGroup={setQualifiedGroup}
						/>
					);
				})}
			</Row>

			{/* <div>
				{firstQualifieds.map((item, index) => {
					return (
						<Match
							key={index}
							index={index}
							accept={accepts}
							lastDroppedItem={lastDroppedItem}
							onDrop={item => {
								handleDrop(index, item);
								handleQuarter(index, item);
							}}
						/>
					);
				})}
			</div> */}

			<section className='headline'>
				<article>CLASSIFICADOS</article>
			</section>

			<div className='qualified' style={{ overflow: 'hidden', clear: 'both' }}>
				{dustbins.map(({ accepts, lastDroppedItem }, index) => (
					<div className='dustbinContainer' key={index}>
						<Dustbin
							accept={accepts}
							lastDroppedItem={lastDroppedItem}
							onDrop={item => {
								handleDrop(index, item);
								handleQuarter(index, item);
							}}
							key={index}
							index={index}
							isOptional={true}
						/>
					</div>
				))}
			</div>

			<section className='headline'>
				<article>OITAVAS DE FINAL</article>
			</section>

			<div className='qualified'>
				{quarter.map(({ accepts, lastDroppedItem }, index) => (
					<div className='dustbinContainer' key={index}>
						<Dustbin
							accept={accepts + ' '}
							lastDroppedItem={lastDroppedItem}
							onDrop={item => handleQuarter(index, item)}
							key={index}
							index={index}
							stage={'eight'}
						/>
					</div>
				))}
			</div>

			<section className='headline'>
				<article>QUARTAS DE FINAL</article>
			</section>
			<div
				className='containerTeams'
				style={{ overflow: 'hidden', clear: 'both' }}
			>
				{qualified.map(({ accepts, lastDroppedItem }, index) => (
					<div className='containerTeam' key={index}>
						<Dustbin
							accept={accepts}
							lastDroppedItem={lastDroppedItem}
							onDrop={item =>
								handleFinalStages(index, item, qualified, setQualified)
							}
							key={index}
							index={index}
							isQualified={true}
							stage={'quarter'}
						/>
					</div>
				))}
			</div>

			<section className='headline'>
				<article>SEMIFINAIS</article>
			</section>

			<div
				className='containerTeams containerTeams--modifier--grid'
				style={{ overflow: 'hidden', clear: 'both' }}
			>
				{semifinal.map(({ accepts, lastDroppedItem }, index) => (
					<div className='containerTeam' key={index}>
						<Dustbin
							accept={accepts}
							lastDroppedItem={lastDroppedItem}
							onDrop={item =>
								handleFinalStages(index, item, semifinal, setSemifinal)
							}
							key={index}
							index={index}
							isQualified={true}
							stage={'semifinal'}
						/>
					</div>
				))}
			</div>

			<div className='separatorText separator--modifier--grid--final'>
				<p className='separatorItem'>FINAL</p>
			</div>

			<div
				className='containerTeams containerTeams--modifier--grid--column '
				style={{ overflow: 'hidden', clear: 'both' }}
			>
				{final.map(({ accepts, lastDroppedItem }, index) => (
					<div className='containerTeam' key={index}>
						<Dustbin
							accept={accepts}
							lastDroppedItem={lastDroppedItem}
							onDrop={item => handleFinalStages(index, item, final, setFinal)}
							key={index}
							index={index}
							isQualified={true}
							stage={'final'}
						/>
					</div>
				))}
			</div>
			<div
				className='containerTeams containerTeams--modifier--grid--winner winner'
				style={{ overflow: 'hidden', clear: 'both' }}
			>
				{winner.map(({ accepts, lastDroppedItem }, index) => (
					<div key={index}>
						<div className='' key={index}>
							<Dustbin
								accept={accepts}
								lastDroppedItem={lastDroppedItem}
								onDrop={item =>
									handleFinalStages(index, item, winner, setWinner)
								}
								key={index}
								index={index}
								isQualified={true}
								stage={'final'}
							/>
							<p className='winner'>CAMPEÃO</p>
						</div>
						<img src={Trophy} className='trophy' />
					</div>
				))}
			</div>
			<ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
		</Container>
	);
};

export default Teams;
