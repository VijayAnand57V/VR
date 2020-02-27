import React, { Component } from 'react';
import { withMediaProps } from 'react-media-player';
import ReactGA from 'react-ga';

import {
  GA_EVENT_CAT_PLAYER,
  GA_EVENT_ACTION_FULLSCREEN,
  CONTROLS_TIMEOUT_DURATION,
  KEY_VOLUME_LEVEL,
} from '../../config/Constants';
import { primaryColorLight } from './../../config/Colors';
import musicStore from '../../stores/musicStore';
import playerStore from '../../stores/playerStore';
import { getRandomNumber } from '../../utils/utils';
import { saveDataToStorage } from '../../api/storage';

const mod = (num, max) => ((num % max) + max) % max;
let isFullscreen = false;
let activateMouseListener = true;
class Fullscreen extends Component {
  componentDidMount() {
    this._addFullscreenChangeHandler();

    document.onkeydown = event => {
      const { id } = document.activeElement;
      let volumeLevel;

      if (id !== 'searchTextInput' && id !== 'playlistNameInput' && id !== 'impositionTextArea') {
        const { media } = this.props;
        if (!event) event = window.event;
        let code = event.keyCode;
        if (event.charCode && code === 0) code = event.charCode;
        switch (code) {
          case 37:
            // Key left.
            media.seekTo(media.currentTime - 5);
            break;
          case 39:
            // Key right.
            media.seekTo(media.currentTime + 5);
            break;
          case 38:
            // Key up.
            event.preventDefault();
            volumeLevel = media.volume + 0.1;
            if (volumeLevel > 1) {
              volumeLevel = 1;
            }
            media.setVolume(volumeLevel);
            saveDataToStorage(KEY_VOLUME_LEVEL, volumeLevel);
            break;
          case 40:
            // Key down.
            event.preventDefault();
            volumeLevel = media.volume - 0.1;
            if (volumeLevel < 0) {
              volumeLevel = 0;
            }
            media.setVolume(volumeLevel);
            saveDataToStorage(KEY_VOLUME_LEVEL, volumeLevel);
            break;
          case 32:
            // key space
            media.playPause();
            event.preventDefault();
            break;
          case 70:
            // key F
            this._onClickFullScreen();
            break;
          case 77:
            // key N
            media.muteUnmute();
            break;
          case 78:
            // key N
            this._navigatePlaylist(1);
            break;
          case 80:
            // key P
            this._navigatePlaylist(-1);
            break;
          default:
            break;
        }
      }
    };
  }

  _addFullscreenChangeHandler = () => {
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'].forEach(eventType =>
      document.addEventListener(
        eventType,
        () => {
          isFullscreen = !isFullscreen;
          if (isFullscreen) {
            this._hideControlsAfterSometime();
            if (activateMouseListener) {
              activateMouseListener = false;
              document.addEventListener(
                'mousemove',
                () => {
                  if (isFullscreen && playerStore.showControls === false) {
                    playerStore.showControls = true;
                    this._hideControlsAfterSometime();
                  }
                },
                false
              );
            }
          } else {
            playerStore.showControls = true;
          }
        },
        false
      )
    );
  };

  _isMouseOnControls = () => false;

  _hideControlsAfterSometime = () => {
    setTimeout(() => {
      if (isFullscreen && !this._isMouseOnControls()) {
        playerStore.showControls = false;
      } else {
        playerStore.showControls = true;
      }
    }, CONTROLS_TIMEOUT_DURATION);
  };

  _onClickFullScreen = () => {
    ReactGA.event({
      category: GA_EVENT_CAT_PLAYER,
      action: GA_EVENT_ACTION_FULLSCREEN,
      value: 1,
    });
    this.props.media.fullscreen();
  };

  _navigatePlaylist = direction => {
    const currentTrack = musicStore.getCurrentTrack();
    const nowPlayingList = musicStore.getNowPlayingList();
    if (nowPlayingList.length > 1) {
      let currentTrackPosition; //= nowPlayingList.indexOf(currentTrack)
      nowPlayingList.forEach((item, index) => {
        if (currentTrack.id === item.id) {
          currentTrackPosition = index;
        }
      });
      let newIndex;
      if (musicStore.isShuffleON()) {
        newIndex = getRandomNumber(0, nowPlayingList.length - 1);
        const songsPlayed = musicStore.getSongsPlayed();
        while (songsPlayed.includes(nowPlayingList[newIndex]) && songsPlayed.length !== nowPlayingList.length) {
          newIndex = getRandomNumber(0, nowPlayingList.length - 1);
        }
      } else {
        newIndex = mod(currentTrackPosition + direction, nowPlayingList.length);
      }
      musicStore.setCurrentTrack(nowPlayingList[newIndex]);
    }
  };

  render() {
    const { isFullscreen } = this.context;

    return (
      <svg
        width="36px"
        height="36px"
        viewBox="0 0 36 36"
        className={this.props.className}
        onClick={() => this._onClickFullScreen()}
      >
        <circle fill={primaryColorLight} cx="18" cy="18" r="18" />
        {!isFullscreen ? (
          <g>
            <polyline fill="none" stroke="#CDD7DB" strokeWidth="1.75" points="9.875,16.5 9.875,11.375 15,11.375" />
            <polyline fill="none" stroke="#CDD7DB" strokeWidth="1.75" points="26.125,16.5 26.125,11.375 21,11.375" />
            <polyline fill="none" stroke="#CDD7DB" strokeWidth="1.75" points="9.875,19.5 9.875,24.625 15,24.625" />
            <polyline fill="none" stroke="#CDD7DB" strokeWidth="1.75" points="26.125,19.5 26.125,24.625 21,24.625" />
          </g>
        ) : (
          <g>
            <polyline fill="none" stroke="#CDD7DB" strokeWidth="1.75" points="14.125,10.5 14.125,15.625 9,15.625" />
            <polyline fill="none" stroke="#CDD7DB" strokeWidth="1.75" points="21.875,10.5 21.875,15.625 27,15.625" />
            <polyline fill="none" stroke="#CDD7DB" strokeWidth="1.75" points="14.125,25.5 14.125,20.375 9,20.375" />
            <polyline fill="none" stroke="#CDD7DB" strokeWidth="1.75" points="21.875,25.5 21.875,20.375 27,20.375" />
          </g>
        )}
      </svg>
    );
  }
}

export default withMediaProps(Fullscreen);
