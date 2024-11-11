/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useContext, useLayoutEffect } from 'react';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import List from '@mui/material/List';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BackupIcon from '@mui/icons-material/Backup';
import InfoIcon from '@mui/icons-material/Info';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { useTranslation } from 'react-i18next';
import CollectionsOutlinedBookmarkIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import DnsIcon from '@mui/icons-material/Dns';
import WebIcon from '@mui/icons-material/Web';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import DevicesIcon from '@mui/icons-material/Devices';
import SyncIcon from '@mui/icons-material/Sync';
import PaletteIcon from '@mui/icons-material/Palette';
import { ListItemLink } from '@/modules/core/components/ListItemLink.tsx';
import { NavBarContext } from '@/modules/navigation-bar/contexts/NavbarContext.tsx';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { makeToast } from '@/modules/core/utils/Toast.ts';

export function Settings() {
    const { t } = useTranslation();

    const { setTitle, setAction } = useContext(NavBarContext);
    useLayoutEffect(() => {
        setTitle(t('settings.title'));
        setAction(null);

        return () => {
            setTitle('');
            setAction(null);
        };
    }, [t]);

    const [triggerClearServerCache, { loading: isClearingServerCache }] = requestManager.useClearServerCache();

    const clearServerCache = async () => {
        try {
            await triggerClearServerCache();
            makeToast(t('settings.clear_cache.label.success'), 'success');
        } catch (e) {
            makeToast(t('settings.clear_cache.label.failure'), 'error');
        }
    };

    return (
        <List sx={{ padding: 0 }}>
            <ListItemLink to="/settings/appearance">
                <ListItemIcon>
                    <PaletteIcon />
                </ListItemIcon>
                <ListItemText primary={t('settings.appearance.title')} />
            </ListItemLink>
            <ListItemLink to="/settings/categories">
                <ListItemIcon>
                    <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary={t('category.title.category_other')} />
            </ListItemLink>
            <ListItemLink to="/settings/defaultReaderSettings">
                <ListItemIcon>
                    <AutoStoriesIcon />
                </ListItemIcon>
                <ListItemText primary={t('reader.settings.title.default_reader_settings')} />
            </ListItemLink>
            <ListItemLink to="/settings/librarySettings">
                <ListItemIcon>
                    <CollectionsOutlinedBookmarkIcon />
                </ListItemIcon>
                <ListItemText primary={t('library.title')} />
            </ListItemLink>
            <ListItemLink to="/settings/downloadSettings">
                <ListItemIcon>
                    <GetAppOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={t('download.title')} />
            </ListItemLink>
            <ListItemLink to="/settings/trackingSettings">
                <ListItemIcon>
                    <SyncIcon />
                </ListItemIcon>
                <ListItemText primary={t('tracking.title')} />
            </ListItemLink>
            <ListItemLink to="/settings/backup">
                <ListItemIcon>
                    <BackupIcon />
                </ListItemIcon>
                <ListItemText primary={t('settings.backup.title')} />
            </ListItemLink>

            <ListItemButton disabled={isClearingServerCache} onClick={clearServerCache}>
                <ListItemIcon>
                    <DeleteForeverIcon />
                </ListItemIcon>
                <ListItemText
                    primary={t('settings.clear_cache.label.title')}
                    secondary={t('settings.clear_cache.label.description')}
                />
            </ListItemButton>
            <ListItemLink to="/settings/browseSettings">
                <ListItemIcon>
                    <ExploreOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary={t('global.label.browse')} />
            </ListItemLink>
            <ListItemLink to="/settings/device">
                <ListItemIcon>
                    <DevicesIcon />
                </ListItemIcon>
                <ListItemText primary={t('settings.device.title.device')} />
            </ListItemLink>
            <ListItemLink to="/settings/webUI">
                <ListItemIcon>
                    <WebIcon />
                </ListItemIcon>
                <ListItemText primary={t('settings.webui.title.webui')} />
            </ListItemLink>
            <ListItemLink to="/settings/server">
                <ListItemIcon>
                    <DnsIcon />
                </ListItemIcon>
                <ListItemText primary={t('settings.server.title.server')} />
            </ListItemLink>
            <ListItemLink to="/settings/about">
                <ListItemIcon>
                    <InfoIcon />
                </ListItemIcon>
                <ListItemText primary={t('settings.about.title')} />
            </ListItemLink>
        </List>
    );
}