import React from 'react';
import html2canvas from 'html2canvas';
import { AiOutlineDownload } from 'react-icons/ai';
import FifaLogo from '../assets/logo/fifaLogo.svg?component';
import { Col, Container, Row } from 'react-bootstrap';
const Header = () => {
	const takeScreenshot = async () => {
		const canvas = await html2canvas(document.querySelector('#root'));
		canvas.style.display = 'none';
		canvas.style.height = '100vh';
		document.body.appendChild(canvas);
		const image = canvas
			.toDataURL('image/png')
			.replace('image/png', 'image/octet-stream');
		const a = document.createElement('a');
		a.setAttribute('download', `info.png`);
		a.setAttribute('href', image);
		a.click();
	};
	return (
		<section>
			<Container>
				<Row className='p-2 d-flex justify-content-center'>
					<Col xs={0} sm={3} className='logo d-none d-md-block'>
						<FifaLogo />
					</Col>
					<Col xs={12} md={6} className='titleContainer'>
						<div className='content'>
							<h1>Simulador</h1>
							<h4>Copa do Mundo Catar 2022</h4>
						</div>
					</Col>
					<Col xs={0} sm={3} className='d-none d-md-block'></Col>
				</Row>
			</Container>
		</section>
	);
};
export default Header;
