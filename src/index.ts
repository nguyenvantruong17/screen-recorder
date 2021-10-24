if(!window) throw new Error('No window available');

let stream: MediaStream | null = null,
    audio: MediaStream | null = null,
    mixedStream: MediaStream | null = null,
    chunks: Array<Blob> = [],
    recorder: MediaRecorder | null = null,
    startButton: HTMLButtonElement | null = null,
    stopButton: HTMLButtonElement | null = null,
    downloadButton: HTMLAnchorElement | null = null,
    recordedVideo: HTMLMediaElement | null = null,
    recordedVideoWrap: HTMLDivElement | null = null,
    recordedAtLeastOne: boolean = false;

/**
 * @description Set up video feedback
 */
function setupVideoFeedback() {
  if(!stream) throw new Error('No stream available');

  const videoElm: HTMLMediaElement = document.querySelector('.video-feedback');
  videoElm.srcObject = stream;
  videoElm.play();
}

/**
 * @description Set up stream and audio
 */
async function setupStream() {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    audio = await navigator.mediaDevices.getUserMedia({ audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100
    } as MediaTrackConstraints});

    setupVideoFeedback();
  } catch {
    // Error handler
  }
}

/**
 * @description Get data of `dataavailable` event while recording
 */
function handleDataAvailable(e: BlobEvent) {
  chunks.push(e.data);
}

/**
 * @description Handle stop event
 */
function handleStop() {
  const blob = new Blob(chunks, {
    type: "video/mp4"
  });
  const urlObject = URL.createObjectURL(blob);

  stream = null;
  audio = null;
  chunks = [];

  recordedAtLeastOne = true;

  downloadButton.href = urlObject;
  downloadButton.download = 'video.mp4';

  recordedVideo.src = urlObject;
  recordedVideo.load();
  recordedVideo.onloadeddata = () => {
    recordedVideo.play();
    recordedVideoWrap.classList.remove('hidden');
    recordedVideoWrap.scrollIntoView({ behavior: "smooth", block: "start" })
  }


}

/**
 * @description Start recording
 */
async function startRecording() {
  if(recordedAtLeastOne) {
    downloadButton.href = "";
    recordedVideo.src = "";
    recordedVideoWrap.classList.add('hidden');
  }

  await setupStream();

  if(!stream) throw new Error('No stream available');

  if(!audio) throw new Error('No audio available');

  // Needed for better browser support
  const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm"

  // You don't need to mix streams when you don't have audio.
  // You can use the `new MediaRecorder` directly instead.
  mixedStream = new MediaStream([
    ...stream.getTracks(),
    ...audio.getTracks()
  ]);

  recorder = new MediaRecorder(mixedStream, { mimeType: mime });
  recorder.ondataavailable = handleDataAvailable;
  recorder.onstop = handleStop;
  recorder.start(200)

  startButton.disabled = true;
  stopButton.disabled = false;
}

/**
 * @description Stop recording
 */
function stopRecording() {
  if(!recorder) throw new Error('No recorder available');

  recorder.stop();
  startButton.disabled = false;
  stopButton.disabled = true;
}

window.addEventListener('load', () => {
  startButton = document.querySelector('.start-recording');
  stopButton = document.querySelector('.stop-recording');
  downloadButton = document.querySelector('.download-video');
  recordedVideo = document.querySelector('.recorded-video');
  recordedVideoWrap = document.querySelector('.recorded-video-wrap')

  startButton.addEventListener("click", startRecording);
  stopButton.addEventListener("click", stopRecording);
})
