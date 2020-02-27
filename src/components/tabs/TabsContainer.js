import React from 'react';
import { View, Text } from 'react-native-web';
import { view } from 'react-easy-state';
// import ReactGA from 'react-ga';

import SearchTab from './SearchTab';
import WhatAShame from '../WhatAShame';
import PlaylistsTab from './PlaylistsTab';
import ProfileTab from './ProfileTab';

import { accentColor, primaryColorLight } from '../../config/Colors';
import RelatedTab from './RelatedTab';
import musicStore from '../../stores/musicStore';


const styles = {
  rootContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  headerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
  },
  menuText: {
    fontStyle: 'bold',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 16,
    color: primaryColorLight,
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
  menuTextActive: {
    fontStyle: 'bold',
    fontWeight: '900',
    letterSpacing: 2,
    fontSize: 16,
    color: accentColor,
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    // backgroundColor: 'grey',
  },
};

class TabsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'SEARCH',
      menuItems: [
        { name: 'SEARCH', path: '/' },
        { name: 'RELATED', path: '/related' },
        { name: 'PLAYLISTS', path: '/playlists' },
        { name: 'PROFILE', path: '/profile' },
        // { name: 'CREDITS', path: '/credits' },
        { name: 'MORE', path: '/more' },
      ],
    };
  }

  componentDidMount() {
    this.state.menuItems.forEach(item => {
      if (item.path === window.location.pathname) {
        this.setState({ activeTab: item.name });
      }
    });
  }

  _onClickMenuItem = item => {
    // window.history.pushState('', '', `${item.path}`);
    // ReactGA.pageview(window.location.pathname);
    this.setState({ activeTab: item.name });
  };

  _renderContent = () => {
    switch (this.state.activeTab) {
      case 'SEARCH':
        return <SearchTab />;
      case 'RELATED':
        return <RelatedTab currentTrack={musicStore.currentTrack} />;
      case 'FAVOURITES':
        return <WhatAShame giphyId="26ufd1zhcpm30DWrC" />;
      case 'PLAYLISTS':
        return <PlaylistsTab />;
      case 'LOGIN':
      case 'PROFILE':
        return <ProfileTab />;

    
      default:
        return <WhatAShame giphyId="26ufd1zhcpm30DWrC" />;
    }
  };

  _renderMenu = array =>
    array.map(item => (
      <View key={item.name} onClick={() => this._onClickMenuItem(item)}>
        <Text className="font" style={this.state.activeTab === item.name ? styles.menuTextActive : styles.menuText}>
          {item.name}
        </Text>
      </View>
    ));

  render() {
    const { menuItems } = this.state;
    return (
      <View style={styles.rootContainer}>
        <View style={styles.headerContainer}>{this._renderMenu(menuItems)}</View>
        <View style={styles.contentContainer}>{this._renderContent()}</View>
      </View>
    );
  }
}

export default view(TabsContainer);
