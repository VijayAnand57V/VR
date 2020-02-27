import React from 'react';
import { View } from 'react-native-web';
import Modal from 'react-responsive-modal';
import { Link } from 'react-router-dom';
// import logo from './../assets/images/logo-min.png';
// import { accentColor } from '../config/Colors';
// import DownloadBox from './DownloadBox';

const styles = {
  rootContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    letterSpacing: 3,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  logo: {
    cursor: 'pointer',
  },
};

class Header extends React.Component {
  state = {
    open: false,
  };

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <View style={styles.rootContainer}>
        <Modal
          open={this.state.open}
          onClose={this.closeModal}
          center
          styles={{
            modal: {
              padding: 0,
            },
          }}
          showCloseIcon={false}
          classNames={{ overlay: 'custom-overlay', modal: 'custom-modal' }}
        >
          {/* <DownloadBox closeModal={() => this.closeModal()} /> */}
        </Modal>
        <Link to="/">
          {' '}
          {/* <img src={logo} width="75" height="75" alt="Music player" style={styles.logo} /> */}
        </Link>
        {/* <Text className="font" style={styles.logoText}>
          Re-imagined youtube music player
        </Text> */}
        {/* <Button title="" color={accentColor} onPress={() => this.openModal()} /> */}
      </View>
    );
  }
}

export default Header;
