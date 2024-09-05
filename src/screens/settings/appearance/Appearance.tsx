/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import Link from '@mui/material/Link';
import { NavBarContext } from '@/components/context/NavbarContext.tsx';
import { ThemeMode, ThemeModeContext } from '@/components/context/ThemeModeContext.tsx';
import { Select } from '@/components/atoms/Select.tsx';
import { MediaQuery } from '@/lib/ui/MediaQuery.tsx';
import { NumberSetting } from '@/components/settings/NumberSetting.tsx';
import { useLocalStorage } from '@/util/useStorage.tsx';
import { I18nResourceCode, i18nResources } from '@/i18n';
import { langCodeToName } from '@/util/language.tsx';
import { getTheme } from '@/lib/ui/AppThemes.ts';
import { ThemeList } from '@/screens/settings/appearance/theme/ThemeList.tsx';

export const Appearance = () => {
    const { t, i18n } = useTranslation();
    const { themeMode, setThemeMode, pureBlackMode, setPureBlackMode, appTheme } = useContext(ThemeModeContext);
    const isDarkMode =
        getTheme(appTheme).muiTheme.palette?.mode === 'dark' || MediaQuery.getThemeMode() === ThemeMode.DARK;

    const { setTitle, setAction } = useContext(NavBarContext);
    useEffect(() => {
        setTitle(t('settings.appearance.title'));
        setAction(null);

        return () => {
            setTitle('');
            setAction(null);
        };
    }, [t]);

    const DEFAULT_ITEM_WIDTH = 300;
    const [itemWidth, setItemWidth] = useLocalStorage<number>('ItemWidth', DEFAULT_ITEM_WIDTH);

    return (
        <List
            subheader={
                <ListSubheader component="div" id="appearance-theme">
                    {t('settings.appearance.theme.title')}
                </ListSubheader>
            }
        >
            <ListItem>
                <ListItemText primary={t('settings.appearance.theme.device_theme')} />
                <Select<ThemeMode> value={themeMode} onChange={(e) => setThemeMode(e.target.value as ThemeMode)}>
                    <MenuItem key={ThemeMode.SYSTEM} value={ThemeMode.SYSTEM}>
                        System
                    </MenuItem>
                    <MenuItem key={ThemeMode.DARK} value={ThemeMode.DARK}>
                        Dark
                    </MenuItem>
                    <MenuItem key={ThemeMode.LIGHT} value={ThemeMode.LIGHT}>
                        Light
                    </MenuItem>
                </Select>
            </ListItem>
            <ThemeList />
            {isDarkMode && (
                <ListItem>
                    <ListItemText primary={t('settings.appearance.theme.pure_black_mode')} />
                    <Switch checked={pureBlackMode} onChange={(_, enabled) => setPureBlackMode(enabled)} />
                </ListItem>
            )}
            <List
                subheader={
                    <ListSubheader component="div" id="appearance-theme">
                        {t('global.label.display')}
                    </ListSubheader>
                }
            >
                <ListItem>
                    <ListItemText
                        primary={t('global.language.label.language')}
                        secondary={
                            <>
                                <span>{t('settings.label.language_description')} </span>
                                <Link
                                    href="https://hosted.weblate.org/projects/suwayomi/suwayomi-webui"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {t('global.language.title.weblate')}
                                </Link>
                            </>
                        }
                    />
                    <Select
                        value={i18nResources.includes(i18n.language as I18nResourceCode) ? i18n.language : 'en'}
                        onChange={({ target: { value: language } }) => i18n.changeLanguage(language)}
                    >
                        {i18nResources.map((language) => (
                            <MenuItem key={language} value={language}>
                                {langCodeToName(language)}
                            </MenuItem>
                        ))}
                    </Select>
                </ListItem>
                <NumberSetting
                    settingTitle={t('settings.label.manga_item_width')}
                    settingValue={`px: ${itemWidth}`}
                    value={itemWidth}
                    defaultValue={DEFAULT_ITEM_WIDTH}
                    minValue={100}
                    maxValue={1000}
                    stepSize={10}
                    valueUnit="px"
                    showSlider
                    handleUpdate={setItemWidth}
                />
            </List>
        </List>
    );
};