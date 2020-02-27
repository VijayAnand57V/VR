import React, { Component } from 'react';
import { View, Text } from 'react-native-web';
import { Media, Player, controls } from 'react-media-player';
import { view } from 'react-easy-state';
import ReactGA from 'react-ga';

import VolumeSlider from './VolumeSlider';
import PlayPause from './PlayPause';
import Repeat from './Repeat';
import FullScreen from './FullScreen';
import { GA_EVENT_CAT_PLAYER, GA_EVENT_ACTION_REPEAT } from '../../config/Constants';
import playerStore from '../../stores/playerStore';
import { showToast } from '../../utils/utils';
import Shuffle from './Shuffle';
import MuteUnmute from './MuteUnmute';

const { CurrentTime, Progress, SeekBar, Duration } = controls;

const PrevTrack = props => (
  <svg width="10px" height="12px" viewBox="0 0 10 12" {...props}>
    <polygon fill="#FAFBFB" points="10,0 2,4.8 2,0 0,0 0,12 2,12 2,7.2 10,12" />
  </svg>
);

const NextTrack = props => (
  <svg width="10px" height="12px" viewBox="0 0 10 12" {...props}>
    <polygon fill="#FAFBFB" points="8,0 8,4.8 0,0 0,12 8,7.2 8,12 10,12 10,0" />
  </svg>
);

class MediaPlayer extends Component {
  _handlePrevTrack = () => {
    this.props.onPrevTrack();
  };

  _handleNextTrack = () => {
    this.props.onNextTrack();
  };

  _handleRepeatTrack = () => {
    ReactGA.event({
      category: GA_EVENT_CAT_PLAYER,
      action: GA_EVENT_ACTION_REPEAT,
      value: 1,
    });
    this.props.onRepeatTrack();
    if (!this.props.repeatTrack) {
      showToast('Repeat Mode is ON');
    } else {
      showToast('Repeat Mode is OFF');
    }
  };

  _handleEnded = () => {
    this.props.onEnded();
  };

  _formatLabel = name => name.substring(0, 23);

  render() {
    const { src, currentTrack, repeatTrack, autoPlay } = this.props;
    return (
      <Media>
        {mediaProps => (
          <View className={`media-player${mediaProps.isFullscreen ? ' media-player--fullscreen' : ''}`} tabIndex="0">
            <View className="media-player-element" onClick={() => mediaProps.playPause()}>
              <Player src={src} loop={repeatTrack} autoPlay={autoPlay} onEnded={this._handleEnded} />
            </View>
            <View
              className="media-controls media-controls--full"
              style={{
                visibility: playerStore.showControls ? 'visible' : 'hidden',
              }}
            >
              <View className="media-row" style={{ width: '100%' }}>
                <CurrentTime className="media-control media-control--current-time" />
                <View style={{ width: '60%', justifyContent: 'center' }}>
                  {currentTrack && (
                    <Text className="font" numberOfLines={1}>
                      {/* {this._formatLabel(currentTrack)} */}
                      {currentTrack}
                    </Text>
                  )}
                </View>
                <Duration className="media-control media-control--duration" />
              </View>
              <View className="media-control-group media-control-group--seek">
                <Progress className="media-control media-control--progress" />
                <SeekBar className="media-control media-control--seekbar" />
              </View>
              <View className="media-row">
                <View className="media-control-group">
                  <PrevTrack className="media-control media-control--prev-track" onClick={this._handlePrevTrack} />
                  <PlayPause className="media-control media-control--play-pause" />
                  <NextTrack className="media-control media-control--next-track" onClick={this._handleNextTrack} />
                </View>
                <View className="media-control-group">
                  <Repeat
                    className="media-control media-control--repeat"
                    isActive={repeatTrack}
                    onClick={this._handleRepeatTrack}
                  />
                  <Shuffle />
                  <MuteUnmute className="media-control media-control--mute-unmute" />
                  {/* <Volume
                    className="media-control media-control--volume"
                    style={{ width: 65, margin: 0, padding: 0 }}
                  /> */}
                  <VolumeSlider />
                  <FullScreen className="media-control media-control--repeat" />
                </View>
              </View>
            </View>
          </View>
        )}
      </Media>
    );
  }
}

export default view(MediaPlayer);
