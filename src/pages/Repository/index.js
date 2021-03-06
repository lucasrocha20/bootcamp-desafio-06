import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repo').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  renderLoading = () => {
    return <ActivityIndicator size="large" color="#7159c1" />;
  };

  render() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repo');

    return (
      <WebView
        source={{ uri: repository.html_url }}
        style={{ flex: 1 }}
        renderLoading={this.renderLoading}
        startInLoadingState
      />
    );
  }
}
