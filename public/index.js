var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
if (!window)
    throw new Error('No window available');
var stream = null, audio = null, mixedStream = null, chunks = [], recorder = null, startButton = null, stopButton = null, downloadButton = null, recordedVideo = null, recordedVideoWrap = null, recordedAtLeastOne = false;
function setupVideoFeedback() {
    if (!stream)
        throw new Error('No stream available');
    var videoElm = document.querySelector('.video-feedback');
    videoElm.srcObject = stream;
    videoElm.play();
}
function setupStream() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4, navigator.mediaDevices.getDisplayMedia({ video: true })];
                case 1:
                    stream = _b.sent();
                    return [4, navigator.mediaDevices.getUserMedia({ audio: {
                                echoCancellation: true,
                                noiseSuppression: true,
                                sampleRate: 44100
                            } })];
                case 2:
                    audio = _b.sent();
                    setupVideoFeedback();
                    return [3, 4];
                case 3:
                    _a = _b.sent();
                    return [3, 4];
                case 4: return [2];
            }
        });
    });
}
function handleDataAvailable(e) {
    chunks.push(e.data);
}
function handleStop() {
    var blob = new Blob(chunks, {
        type: "video/mp4"
    });
    var urlObject = URL.createObjectURL(blob);
    stream = null;
    audio = null;
    chunks = [];
    recordedAtLeastOne = true;
    downloadButton.href = urlObject;
    downloadButton.download = 'video.mp4';
    recordedVideo.src = urlObject;
    recordedVideo.load();
    recordedVideo.onloadeddata = function () {
        recordedVideo.play();
        recordedVideoWrap.classList.remove('hidden');
        recordedVideoWrap.scrollIntoView({ behavior: "smooth", block: "start" });
    };
}
function startRecording() {
    return __awaiter(this, void 0, void 0, function () {
        var mime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (recordedAtLeastOne) {
                        downloadButton.href = "";
                        recordedVideo.src = "";
                        recordedVideoWrap.classList.add('hidden');
                    }
                    return [4, setupStream()];
                case 1:
                    _a.sent();
                    if (!stream)
                        throw new Error('No stream available');
                    if (!audio)
                        throw new Error('No audio available');
                    mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
                        ? "video/webm; codecs=vp9"
                        : "video/webm";
                    mixedStream = new MediaStream(__spreadArray(__spreadArray([], stream.getTracks(), true), audio.getTracks(), true));
                    recorder = new MediaRecorder(mixedStream, { mimeType: mime });
                    recorder.ondataavailable = handleDataAvailable;
                    recorder.onstop = handleStop;
                    recorder.start(200);
                    startButton.disabled = true;
                    stopButton.disabled = false;
                    return [2];
            }
        });
    });
}
function stopRecording() {
    if (!recorder)
        throw new Error('No recorder available');
    recorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
}
window.addEventListener('load', function () {
    startButton = document.querySelector('.start-recording');
    stopButton = document.querySelector('.stop-recording');
    downloadButton = document.querySelector('.download-video');
    recordedVideo = document.querySelector('.recorded-video');
    recordedVideoWrap = document.querySelector('.recorded-video-wrap');
    startButton.addEventListener("click", startRecording);
    stopButton.addEventListener("click", stopRecording);
});
