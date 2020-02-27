import React from 'react';
import { View, Text } from 'react-native-web';
import ReactSVG from 'react-svg';
import randomColor from 'randomcolor';
import shortid from 'shortid';
import ReactGA from 'react-ga';

import './../../styles/song-item.css';
import playIcon from './../../assets/images/icons/play.svg';
import queueIcon from './../../assets/images/icons/add.svg';
import musicStore from './../../stores/musicStore';
import { showToast, parseHtmlEntities } from '../../utils/utils';
import SaveButton from './../SaveButton';
import { GA_EVENT_CAT_MUSIC, GA_EVENT_ACTION_SONG_SEARCH } from '../../config/Constants';
import { primaryColorLight } from './../../config/Colors';

class SearchResultItem extends React.Component {
  _onClickPlay = () => {
    const { name, videoUrl } = this.props;
    musicStore.playTrack({
      src: videoUrl,
      label: this._formatLabel(name),
    });
    showToast('Playing');
    ReactGA.event({
      category: GA_EVENT_CAT_MUSIC,
      action: GA_EVENT_ACTION_SONG_SEARCH,
      value: 1,
    });
  };

  _onClickQueue = () => {
    const { name, videoUrl } = this.props;
    const nowPlayingList = musicStore.getNowPlayingList();
    if (nowPlayingList.length === 0) {
      // if queue is already empty start plying
      musicStore.playTrack({
        src: videoUrl,
        label: this._formatLabel(name),
      });
    } else {
      musicStore.addToNowPlayingList({
        src: videoUrl,
        label: this._formatLabel(name),
      });
    }

    showToast('Added to Now Playing');
  };

  _formatDataToSave = () => {
    const { name, videoUrl } = this.props;
    return [
      // save playlist component accepts arrays only
      {
        src: videoUrl,
        label: this._formatLabel(name),
        id: shortid.generate(),
        key: shortid.generate(),
      },
    ];
  };

  _formatLabel = str => {
    const name = parseHtmlEntities(str);
    if (name.length > 75) {
      return `${name.substring(0, 75)}...`;
    }
    return name;
  };

  render() {
    const generatedColor = randomColor({
      luminosity: 'bright',
      hue: 'blue',
    });
    return (
      <View
        className="song-item-container"
        style={{
          borderLeftWidth: 4,
          borderLeftStyle: 'solid',
          borderLeftColor: generatedColor,
        }}
      >
        {this.props.showImage && (
          <View
            onClick={() => this._onClickPlay()}
            style={{
              width: 121,
              height: 75,
              backgroundColor: generatedColor,
            }}
          >
            <img src={this.props.thumbnailUrl} alt="My awesome" width="121" height="75" />
          </View>
        )}
        <View
          style={{
            height: this.props.showImage ? 75 : 35,
            flex: 1,
          }}
          onClick={() => this._onClickPlay()}
        >
          <Text className="title font" numberOfLines={1}>
            {/* {this._formatLabel(this.props.name)} */}
            {parseHtmlEntities(this.props.name)}
          </Text>
        </View>
        <View className="actions-container">
          <ReactSVG
            title="Play now"
            path={playIcon}
            evalScripts="always"
            svgClassName="action-icon"
            svgStyle={{ fill: primaryColorLight }}
            onClick={() => {
              this._onClickPlay();
            }}
          />
          <ReactSVG
            title="Add to queue"
            path={queueIcon}
            evalScripts="always"
            svgClassName="action-icon"
            svgStyle={{ fill: primaryColorLight }}
            onClick={() => {
              this._onClickQueue();
            }}
          />
          <SaveButton
            title="Save to playlist"
            dataToSave={this._formatDataToSave()}
            svgStyle={{ fill: primaryColorLight }}
          />
        </View>
      </View>
    );
  }
}

export default SearchResultItem;
