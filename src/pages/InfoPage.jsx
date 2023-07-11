const InfoPage = ({ onClickContinue }) => {
	return (
		<div>
			<h1>Camera Access and Screen Sharing Information</h1>
			<h4>Please allow access to your web camera and share your screen.<br/> We will be frequently taking camera photo and screenshot.</h4>
			<button style={{marginTop: '20px'}} onClick={onClickContinue}>Continue</button>
		</div>
	)
}

export default InfoPage;