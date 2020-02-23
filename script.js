const video = document.querySelector('.video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        {video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}


video.addEventListener('play', () => {
    const container = document.querySelector('.container');
    const canvas = faceapi.createCanvasFromMedia(video);
    container.append(canvas);
   
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);


    setInterval(async () => {
       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
       .withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
       const resizedDetections = faceapi.resizeResults(detections, displaySize);
       console.log(resizedDetections);

    //    resizedDetections.forEach( detection => {
    //        const box = detection.detection.box;
    //        const drawBox = new faceapi.draw.DrawBox(box, { label: 'Face'})
    //        drawBox.draw(canvas);
    //    })

       canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
       faceapi.draw.drawDetections(canvas, resizedDetections);
       faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
       faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100)
});

function loadLabeledImages() {
    const labels = ['Kelley Muro', 'Yesenia Tenorio'];

}