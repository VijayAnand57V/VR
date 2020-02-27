import React from 'react';
import { View, Text, Button } from 'react-native-web';
import dayjs from 'dayjs';
// import shortid from 'shortid';

import { accentColor, primaryColor } from '../config/Colors';
import EditPlaylistItem from './listItems/EditPlaylistItem';
import playlists from './../api/playlists';
import { COL_MUSIC_DATA } from '../config/Constants';
import userStore from '../stores/userStore';
import musicStore from '../stores/musicStore';
import { saveToFirebase } from '../api/firebase';
import { showToast } from '../utils/utils';

const styles = {
  rootContainer: {
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  songsContainer: {
    maxHeight: 400,
    overflow: 'scroll',
    marginTop: 20,
  },
};

class EditPlaylist extends React.Component {
  state = {
    data: this.props.data,
  };

  _deleteSong = position => {
    const newData = this.state.data;
    newData.splice(position, 1);
    this.setState({ data: newData });
    showToast('Deleted');
  };

  _onClickSave = () => {
    playlists.updatePlaylist(this.props.playlistId, this.state.data);
    if (userStore.loggedIn) {
      const firebaseData = {
        playlists: musicStore.getAllPlaylists(),
        updatedAt: dayjs().format(),
      };
      saveToFirebase(COL_MUSIC_DATA, firebaseData, () => {});
    }
    this.props.closeModal();
  };

  render() {
    return (
      <View style={styles.rootContainer}>
        <View style={{ width: '100%', alignItems: 'flex-start' }}>
          <Text
            className="font"
            style={{
              color: accentColor,
              fontSize: 24,
            }}
          >
            Edit Playlist: {this.props.title}
          </Text>
        </View>
        <View style={styles.songsContainer}>
          {/* <FlatList
            keyExtractor={() => shortid.generate()}
            data={this.state.data}
            renderItem={({ item, index }) => (
              <EditPlaylistItem name={item.label} onClickDelete={() => this._deleteSong(index)} />
            )}
          /> */}
          {this.state.data.map((item, index) => (
            <EditPlaylistItem key={item.key} name={item.label} onClickDelete={() => this._deleteSong(index)} />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Save Playlist" color={accentColor} onPress={() => this._onClickSave()} />
          <Button title="Cancel" color={primaryColor} onPress={() => this.props.closeModal()} />
        </View>
      </View>
    );
  }
}

export default EditPlaylist;
