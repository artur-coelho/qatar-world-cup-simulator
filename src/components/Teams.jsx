import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import update from 'immutability-helper';
import Group from './Group';
import Dustbin from './Dustbin';
import Trophy from '../assets/logo/trophy.png';
import countries from '../assets/data/countries.json';
import { compareArrays, isOdd } from '../helpers/compareArrays';
import {
	groupStageData,
	quarterData,
	qualifiedData,
	semifinalData,
	finalData,
	winnerData,
} from '../assets/data/identifiers';
import { Col, Container, Image, Row } from 'react-bootstrap';
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

	const updateDustbins = (group, groupName) => {
		dustbins.map((item, index) => {
			if (item.accepts.includes(groupName) && isOdd(index)) {
				dustbins[index].lastDroppedItem = group.first;
				dustbins[index + 1].lastDroppedItem = group.second;

				const result1 = compareArrays(
					quarter,
					dustbins[index],
					index,
					group.first
				);
				setQuarter(result1);

				const result2 = compareArrays(
					quarter,
					dustbins[index + 1],
					index + 1,
					group.second
				);
				setQuarter(result2);
			}
		});
	};

	const setMatchWinner = useCallback((winner, index, array, setStage) => {
		const newIndex = Math.floor(index / 2);
		setStage(
			update(array, {
				[newIndex]: {
					lastDroppedItem: {
						$set: winner,
					},
				},
			})
		);
	}, []);

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
							setQualifiedGroup={updateDustbins}
						/>
					);
				})}
			</Row>

			<section className='headline'>
				<article>OITAVAS DE FINAL</article>
			</section>

			<Row className='d-flex justify-content-evenly  '>
				{quarter.map(
					({ accepts, lastDroppedItem }, index) =>
						isOdd(index) && (
							<Match
								accept={accepts}
								lastDroppedItem={lastDroppedItem}
								onDrop={item => {
									handleDrop(index, item);
								}}
								oponent={quarter[index + 1]}
								key={index}
								index={index}
								stage={'eight'}
								setMatchWinner={item =>
									setMatchWinner(item, index, qualified, setQualified)
								}
							/>
						)
				)}
			</Row>

			<section className='headline'>
				<article>QUARTAS DE FINAL</article>
			</section>
			<Row className='d-flex justify-content-evenly'>
				{qualified.map(
					({ accepts, lastDroppedItem }, index) =>
						isOdd(index) && (
							<Match
								accept={accepts}
								lastDroppedItem={lastDroppedItem}
								oponent={qualified[index + 1]}
								key={index}
								index={index}
								isQualified={true}
								stage={'quarter'}
								setMatchWinner={item =>
									setMatchWinner(item, index, semifinal, setSemifinal)
								}
							/>
						)
				)}
			</Row>

			<section className='headline'>
				<article>SEMIFINAIS</article>
			</section>

			<Row className='d-flex justify-content-evenly'>
				{semifinal.map(
					({ accepts, lastDroppedItem }, index) =>
						isOdd(index) && (
							<Match
								accept={accepts}
								lastDroppedItem={lastDroppedItem}
								oponent={semifinal[index + 1]}
								key={index}
								index={index}
								isQualified={true}
								stage={'semifinal'}
								setMatchWinner={item =>
									setMatchWinner(item, index, final, setFinal)
								}
							/>
						)
				)}
			</Row>

			<section className='headline'>
				<article> FINAL</article>
			</section>

			<Row className='d-flex justify-content-evenly'>
				{final.map(
					({ accepts, lastDroppedItem }, index) =>
						isOdd(index) && (
							<Match
								accept={accepts}
								lastDroppedItem={lastDroppedItem}
								oponent={final[index + 1]}
								key={index}
								index={index}
								isQualified={true}
								stage={'final'}
								setMatchWinner={item =>
									setMatchWinner(item, index, winner, setWinner)
								}
							/>
						)
				)}
			</Row>

			<Row className='d-flex justify-content-center mt-4 mt-md-0'>
				<Col
					xs={6}
					md={4}
					xl={5}
					className='d-flex justify-content-end align-items-center py-3'
				>
					<p className='winner'>CAMPEÃO:</p>
				</Col>
				<Col
					xs={6}
					md={4}
					xl={2}
					className='d-flex justify-content-center align-items-center'
				>
					{winner[0].lastDroppedItem && (
						<Image
							className='flagImg'
							src={`assets/images/countries/${winner[0].lastDroppedItem?.country}.png`}
							width={100}
							title={winner[0].lastDroppedItem?.country}
							key={winner[0].lastDroppedItem?.id}
						/>
					)}
				</Col>
				<Col
					xs={12}
					md={4}
					xl={5}
					className='mt-3 mt-md-0 p-3 d-flex justify-content-center justify-content-md-start'
				>
					<img src={Trophy} className='trophy ' />
				</Col>
			</Row>
			<ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
		</Container>
	);
};

export default Teams;
