/* eslint-disable lines-around-comment */
import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import type { Dispatch } from 'redux';

// @ts-ignore
import { Dialog } from '../../base/dialog';
import { translate } from '../../base/i18n/functions';
import { connect } from '../../base/redux/functions';
import { updateSettings } from '../../base/settings/actions';
import { shouldHideShareAudioHelper } from '../../base/settings/functions.any';
// eslint-disable-next-line lines-around-comment
// @ts-ignore
import { toggleScreensharing } from '../../base/tracks/actions';
import Checkbox from '../../base/ui/components/web/Checkbox';

/**
 * The type of the React {@code Component} props of {@link ShareAudioDialog}.
 */
export interface Props extends WithTranslation {

    /**
     * Boolean stored in local storage that determines whether or not the dialog will be displayed again.
     */
    _shouldHideShareAudioHelper: boolean;

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Dispatch<any>;
}

/**
 * Component that displays the audio screen share helper dialog.
 */
class ShareAudioDialog extends Component<Props> {

    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._onContinue = this._onContinue.bind(this);
        this._onSelectHideShareAudioHelper = this._onSelectHideShareAudioHelper.bind(this);
    }

    /**
     * Continue the normal screen sharing flow when the user clicks continue.
     *
     * @returns {boolean}
     */
    _onContinue() {
        // Pass undefined as the first parameter so the underlying logic decides weather or not to stop screen sharing.
        this.props.dispatch(toggleScreensharing(undefined, true));

        return true;
    }

    /**
     * Callback invoked when the hide audio helper checkbox has been selected. This setting will be persisted in
     * the local storage, thus the dialog won't be displayed again.
     *
     * @param {Object} e - The key event to handle.
     * @returns {void}
     */
    _onSelectHideShareAudioHelper({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) {
        this.props.dispatch(updateSettings({ hideShareAudioHelper: checked }));
    }

    /**
     * Implements {@Component#render}.
     *
     * @inheritdoc
     */
    render() {

        const { t } = this.props;

        return (
            <Dialog
                hideCancelButton = { false }
                okKey = { t('dialog.shareAudio') }
                onSubmit = { this._onContinue }
                titleKey = { t('dialog.shareAudioTitle') }
                width = { 'medium' } >
                <div className = 'share-audio-dialog'>
                    <img
                        className = 'share-audio-animation'
                        src = 'images/share-audio.gif' />
                    <Checkbox
                        checked = { this.props._shouldHideShareAudioHelper }
                        label = { t('dialog.hideShareAudioHelper') }
                        name = 'hide-share-audio-helper'
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange = { this._onSelectHideShareAudioHelper } />
                </div>
            </Dialog>
        );
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state: Object): Partial<Props> {

    return {
        _shouldHideShareAudioHelper: shouldHideShareAudioHelper(state)
    };
}


export default translate(connect(_mapStateToProps)(ShareAudioDialog));
