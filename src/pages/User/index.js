import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  ContainerLoading,
  ButtonRepo,
  ButtonRepoText,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    refreshing: false,
  };

  componentDidMount() {
    this.load();
  }

  load = async () => {
    const { navigation } = this.props;

    const { stars, page } = this.state;

    // eslint-disable-next-line react/prop-types
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: [...stars, ...response.data],
      page: page + 1,
    });
  };

  refreshList = async () => {
    const { navigation } = this.props;

    const { stars, page } = this.state;

    this.setState({ stars: [], page: 1, refreshing: true });

    // eslint-disable-next-line react/prop-types
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: [...stars, ...response.data],
      page: page + 1,
      refreshing: false,
    });
  };

  renderLoading = () => {
    const { page } = this.state;

    return (
      <ContainerLoading page={page}>
        <ActivityIndicator size="large" color="#7159c1" />
      </ContainerLoading>
    );
  };

  getRepository = repo => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repo });
  };

  render() {
    const { navigation } = this.props;
    const { stars, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          onEndReached={this.load}
          onEndReachedThreshold={0.2}
          refreshing={refreshing}
          onRefresh={this.refreshList}
          ListFooterComponent={this.renderLoading}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
              <ButtonRepo onPress={() => this.getRepository(item)}>
                <ButtonRepoText>Ver mais</ButtonRepoText>
              </ButtonRepo>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
