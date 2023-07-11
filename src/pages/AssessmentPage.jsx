import { useState, useEffect, useRef } from "react";

const AssessmentPage = () => {
	// The width and height of the captured photo. We will set the
	// width to the value defined here, but the height will be
	// calculated based on the aspect ratio of the input stream.
	const width = 220;	// We will scale the photo width to this
	const [height, setHeight] = useState(0);	// This will be computed based on the input stream
	const [heightCamera, setHeightCamera] = useState(0);	// This will be computed based on the input stream

	// |streaming| indicates whether or not we're currently streaming
	// video from the camera. Obviously, we start at false.
	const [streaming, setStreaming] = useState(false);
	const [streamingCamera, setStreamingCamera] = useState(false);

	// The various HTML elements we need to configure or control. These
	// will be set by the startup() function.
	const video = useRef(null);
	const canvas = useRef(null);
	const photo = useRef(null);
	const startButton = useRef(null);

	const videoCamera = useRef(null);
	const canvasCamera = useRef(null);
	const photoCamera = useRef(null);
	const startButtonCamera = useRef(null);

	const [hide, setHide] = useState(false);
	const [showCaptured, setShowCaptured] = useState(false);

	async function startup() {
		try {
			let stream = await navigator.mediaDevices
				.getDisplayMedia({
					video: {
						displaySurface: "window",
					},
					audio: false,
				})

			video.current.srcObject = stream;
			video.current.play().catch(err => console.error(err));

		} catch (err) {
			console.error(`An error occurred: ${err}`);
		}

		clearphoto();
	}

	const getScreenVideoHeight = () => {
		let _height = video.current.videoHeight / (video.current.videoWidth / width);
		// Firefox currently has a bug where the height can't be read from
		// the video, so we will make assumptions if this happens.

		if (isNaN(_height)) {
			_height = width / (4 / 3);
		}

		return _height;
	}

	const onCanPlayVideo = () => {
		console.log("On Can Play Video");
		setTimeout(() => {
			if (!streaming) {
				let _height = getScreenVideoHeight();
				setHeight(_height);

				video.current.setAttribute("width", width);
				video.current.setAttribute("height", _height);
				canvas.current.setAttribute("width", width);
				canvas.current.setAttribute("height", _height);
				setStreaming(true);
			}
		}, 1000)
	}

	async function startupCamera() {
		try {
			let stream = await navigator.mediaDevices
				.getUserMedia({ video: true, audio: false });

			videoCamera.current.srcObject = stream;
			videoCamera.current.play().catch(err => {
				console.error("Camera error: ", err);
			});
		} catch (err) {
			console.error(`An error occurred: ${err}`);
		}

		clearphotoCamera();
	}

	const getCameraVideoHeight = () => {
		let _height = videoCamera.current.videoHeight / (videoCamera.current.videoWidth / width);
		// Firefox currently has a bug where the height can't be read from
		// the video, so we will make assumptions if this happens.

		if (isNaN(_height)) {
			_height = width / (4 / 3);
		}

		return _height;
	}

	const onCanPlayVideoCamera = () => {
		console.log("On Can Play Camera");
		setTimeout(() => {
			if (!streamingCamera) {
				let _height = getCameraVideoHeight();
				setHeight(_height);

				videoCamera.current.setAttribute("width", width);
				videoCamera.current.setAttribute("height", _height);
				canvasCamera.current.setAttribute("width", width);
				canvasCamera.current.setAttribute("height", _height);
				setStreamingCamera(true);
			}
		}, 1000);
	}

	// Fill the photo with an indication that none has been
	// captured.

	function clearphoto() {
		const context = canvas.current.getContext("2d");
		context.fillStyle = "#AAA";
		context.fillRect(0, 0, canvas.current.width, canvas.current.height);

		const data = canvas.current.toDataURL("image/png");
		photo.current.setAttribute("src", data);
	}

	function clearphotoCamera() {
		const context = canvasCamera.current.getContext("2d");
		context.fillStyle = "#AAA";
		context.fillRect(0, 0, canvasCamera.current.width, canvasCamera.current.height);

		const data = canvasCamera.current.toDataURL("image/png");
		photoCamera.current.setAttribute("src", data);
	}

	// Capture a photo by fetching the current contents of the video
	// and drawing it into a canvas, then converting that to a PNG
	// format data URL. By drawing it on an offscreen canvas and then
	// drawing that to the screen, we can change its size and/or apply
	// other changes before drawing it.

	function takepicture() {
		const context = canvas.current.getContext("2d");
		let _height = getScreenVideoHeight();
		console.log("w", width);
		console.log("h", _height);
		if (width && _height) {
			canvas.current.width = width;
			canvas.current.height = _height;
			context.drawImage(video.current, 0, 0, width, _height);

			const data = canvas.current.toDataURL("image/png");
			photo.current.setAttribute("src", data);
		} else {
			clearphoto();
		}
	}

	function takepictureCamera() {
		const context = canvasCamera.current.getContext("2d");
		let _height = getCameraVideoHeight();
		if (width && _height) {
			canvasCamera.current.width = width;
			canvasCamera.current.height = _height;
			context.drawImage(videoCamera.current, 0, 0, width, _height);

			const data = canvasCamera.current.toDataURL("image/png");
			photoCamera.current.setAttribute("src", data);
		} else {
			clearphotoCamera();
		}
	}


	const startHide = () => {
		setTimeout(() => {
			setShowCaptured(false)
		}, 10000);
	}

	const captureTimer = () => {
		setInterval(() => {
			console.log("captured");
			takepicture();
			takepictureCamera();

			setShowCaptured(true);
			startHide();
		}, 20000);
	}

	const __startup = async () => {
		await startup();
		await startupCamera();

		captureTimer();
	}

	useEffect(() => {
		console.log('starting');
		__startup();
	}, []);

	return (
		<div>
			<div className="contentarea">
				<div className="camera-container">
					<div className="camera-container-head" style={{textAlign: 'right'}}>
						<button onClick={() => setHide(!hide)}>{ hide ? 'Show' : 'Hide'}</button>
					</div>
					<div className={`video-container ${hide ? 'hidden' : 'visible'}`}>
						<div className="camera">
							<video ref={video} id="video" onCanPlay={onCanPlayVideo}>Video stream not available.</video>
							<button ref={startButton} id="startbutton" onClick={takepicture}>Take photo</button>
						</div>
						<div className="camera">
							<video ref={videoCamera} id="videoCamera" onCanPlay={onCanPlayVideoCamera}>Video stream not available.</video>
							<button ref={startButtonCamera} id="startbuttonCamera" onClick={takepictureCamera}>Take camera photo</button>
						</div>
					</div>
				</div>
				<canvas ref={canvas} id="canvas"> </canvas>
				<canvas ref={canvasCamera} id="canvasCamera"> </canvas>
				<div className={`output-container ${showCaptured ? 'visible' : 'hidden'}`}>
					<div className="output">
						<img ref={photo} id="photo" alt="The screen capture will appear in this box." />
					</div>
					<div className="output">
						<img ref={photoCamera} id="photoCamera" alt="The screen capture will appear in this box." />
					</div>
				</div>
			</div>
		</div>
	)
}

export default AssessmentPage;