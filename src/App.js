import { useState } from 'react';
import './App.css';
import StartPage from './pages/StartPage';
import InfoPage from './pages/InfoPage';
import AssessmentPage from './pages/AssessmentPage';

const Page = () => {
	const [step, setStep] = useState(1);

	// handler

	const onClickStart = () => {
		setStep(2);
	}

	const onClickContinue = () => {
		setStep(3);
	}

	switch (step) {
		case 1:
			return <StartPage onClickStart={onClickStart} />

		case 2:
			return <InfoPage onClickContinue={onClickContinue} />

		case 3:
			return <AssessmentPage />

		default:
			return null;
	}
}

function App() {
	return (
		<div style={{ textAlign: 'center', paddingTop: '20px' }}>
			{
				<Page />
			}
		</div>
	)
}

export default App;
