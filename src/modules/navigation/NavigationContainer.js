// ========================================================
// NavigationContainer
// ========================================================

// core
import React, {
    Component
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  NavigationExperimental,
} from 'react-native';


const {
    Transitioner: NavigationTransitioner,
    Card: NavigationCard,
} = NavigationExperimental;

// third party
import { connect } from 'react-redux';

// first party
import { ACTIONS, NAV } from '../../constants/constants';
import * as NavActions from '../navigation/NavigationActions';
import Scene from './Scene';
import NavigationDock from './NavigationDock';
import NavigationBar from './NavigationBar';
import Modal from './Modal';

// ========================================================
// Component
// ========================================================

class NavigationContainer extends Component {

    constructor(props) {
        super(props)

        this._renderCard = this._renderCard.bind(this);
        this._renderScene = this._renderScene.bind(this);
        this._renderOverlay = this._renderOverlay.bind(this);
    }

    render() {

        const { navigationState } = this.props;
        const { tabs } = navigationState;
        const tabKey = tabs.routes[tabs.index].key;
        const scenes = navigationState[tabKey];
        const configTransition = { duration: scenes.animation === 'reset' ? 0 : 250 };

        return (
            <View style={styles.container}>

                <NavigationTransitioner
                    key={'stack_' + tabKey}
                    configureTransition={ () => { return configTransition }}
                    onNavigate={this.props.onNavigate}
                    navigationState={scenes}
                    renderOverlay={this._renderOverlay}
                    renderScene={this._renderCard}
                    style={styles.navigationCardStack}
                />

                <NavigationDock
                    navigationState={this.props.navigationState}
                    onNavigate={this.props.onNavigate}
                    scenes={scenes}
                />

                <Modal
                    navigationState={this.props.navigationState}
                    onNavigate={this.props.onNavigate}
                    scenes={scenes}
                />
            </View>
        );
    }

    _renderOverlay(sceneProps) {
        const showNavigationBar = sceneProps.scene.route.navigationBar;

        // hide navigationBar
        if (!showNavigationBar) {
            return this._renderCard(sceneProps);
        }

        return (
            <NavigationBar {...sceneProps} />
        )
    }

    _renderCard(sceneProps) {
        const animation = sceneProps.navigationState.animation;
        const isModal = animation === NAV.VERTICAL;
        const horizontalAnimation = undefined;
        const verticalAnimation = NavigationCard.CardStackStyleInterpolator.forVertical(sceneProps);
        const cardStyle = isModal ? verticalAnimation : horizontalAnimation;

        return (
            <NavigationCard
                {...sceneProps}
                style={cardStyle}
                key={sceneProps.scene.route.key}
                renderScene={this._renderScene}
            />
        )
    }

    _renderScene(sceneProps) {
        return (
            <Scene
                {...sceneProps}
                key={sceneProps.scene.route.key}
            />
        )
    }
}

// ========================================================
// Styles
// ========================================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navigationCardStack: {
        flex: 20,
    },
});


// ========================================================
// Redux Configurations
// ========================================================

// pass state to props of this component
const mapStateToProps = (state) => {
    return {
        navigationState: state.navigationState,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onNavigate: (action) => dispatch(action)
    }
}

// ========================================================
// Exports
// ========================================================

export default connect(mapStateToProps, mapDispatchToProps)(NavigationContainer)

