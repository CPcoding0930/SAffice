const changeVideo = (event) => {
    const imageSource = event.childNodes[1].src;
    const videoSource = imageSource.substring(0, imageSource.length - 3) + "mp4";
    if(source.src == videoSource)
        return;
    change = true;
    source.src = videoSource;
    canvasToImage.style.display = "none";
    loader[0].style.display = "inline";
    webcamElement.load();
    loader[0].style.display = "none";
    canvasToImage.style.display = "inline";
    change = false;
}

