import React, { Component } from 'react';
import * as handTrack from 'handtrackjs';
import Deque from 'double-ended-queue';
import { Button } from 'react-bootstrap';

class WebCanvas extends Component {
    state = {
      model: null,
      toggle: false,
      deque: null,
      direction: '',
    }

    startVideo = () => {
      const { toggle } = this.state;
      const deque = new Deque(10);
      console.log(deque);
      const video = document.getElementById('myvideo');
      if (toggle === false) {
        handTrack.startVideo(video).then((status) => {
          if (status) {
            this.setState({ toggle: true, deque });
            this.runDetection();
          }
        });
      } else {
        handTrack.stopVideo(video);
        this.setState({ toggle: false });
      }
    }

    componentDidMount() {
      const modelParams = {
        flipHorizontal: true,
        maxNumBoxes: 20,
        iouThreshold: 0.5,
        scoreThreshold: 0.6,
      };
      handTrack.load(modelParams).then((lmodel) => {
        this.setState({ model: lmodel });
      });
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia({ video: true }, this.handleVideo, this.videoError);
      }
    }

      handleVideo = (stream) => {
        this.refs.video.srcObject = stream;
      }

      videoError = () => {
        console.log('Error!');
      }

    runDetection = () => {
      const { model, toggle, deque } = this.state;
      const video = document.getElementById('myvideo');
      const directions = {};
      let direction = '';
      model.detect(video).then((predictions) => {
        if (predictions.length !== 0) {
          const [x, y, width, height] = predictions[0].bbox;
          const center = [(x + width) / 2, (y + height) / 2];
          deque.push(center);
          if (deque[7] !== undefined) {
            const dX = deque[7][0] - deque[1][0];
            const dY = deque[7][1] - deque[1][1];
            console.log('diff', dX, dY);
            if (Math.abs(dX) > 30) {
              if (Math.sign(dX) === 1) {
                directions.Right = dX;
              } else directions.Left = dX;
            }
            if (Math.abs(dY) > 30) {
              if (Math.sign(dY) === 1) {
                directions.Down = dY;
              } else directions.Up = dY;
            }
            const directionsKeys = Object.keys(directions);
            if (directionsKeys.length === 1) {
              direction = directionsKeys[0];
            }
            if (directionsKeys.length !== 0 && directionsKeys.length !== 1) {
              const absArray = Object.values(directions).map(Math.abs);
              const index = absArray.indexOf(Math.max(...absArray));
              const key = Object.keys(directions)
                .find(key => directions[key] === Object.values(directions)[index]);
              direction = key;
            }
            console.log(direction);
            const newDeque = new Deque(10);
            this.setState({ deque: newDeque, direction });
          }
        }
        if (toggle) {
          requestAnimationFrame(this.runDetection);
        }
      });
    }

    render() {
      return (
<div>
        <video id='myvideo' ref="video" width='300' height='400' autoPlay={true} />
        <div>
        <Button variant="primary"onClick={this.startVideo}> Start</Button>
        </div>
        <div>
            <h2>{this.state.direction}</h2>
        </div>
      </div>
);
    }
}

export default WebCanvas;
