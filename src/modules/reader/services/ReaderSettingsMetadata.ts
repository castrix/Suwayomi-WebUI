/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo } from 'react';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { DEFAULT_READER_SETTINGS } from '@/modules/reader/Reader.constants.ts';
import { IReaderSettings } from '@/modules/reader/Reader.types.ts';
import { convertFromGqlMeta } from '@/modules/metadata/services/MetadataConverter.ts';
import { getMetadataFrom } from '@/modules/metadata/services/MetadataReader.ts';
import { GqlMetaHolder, Metadata, MetadataHolder, MetadataHolderType } from '@/modules/metadata/Metadata.types.ts';
import { MangaIdInfo } from '@/modules/manga/Manga.types.ts';

function getReaderSettingsWithDefaultValueFallback<DefaultSettings extends IReaderSettings>(
    type: 'global',
    metadataHolder: MetadataHolder,
    defaultSettings?: DefaultSettings,
    useEffectFn?: typeof useEffect,
): DefaultSettings;
function getReaderSettingsWithDefaultValueFallback<DefaultSettings extends IReaderSettings>(
    type: 'manga',
    metadataHolder: MangaIdInfo & MetadataHolder,
    defaultSettings?: DefaultSettings,
    useEffectFn?: typeof useEffect,
): DefaultSettings;
function getReaderSettingsWithDefaultValueFallback<DefaultSettings extends IReaderSettings>(
    type: Extract<MetadataHolderType, 'global' | 'manga'>,
    metadataHolder: (MangaIdInfo & MetadataHolder) | MetadataHolder,
    defaultSettings: DefaultSettings = DEFAULT_READER_SETTINGS as DefaultSettings,
    useEffectFn?: typeof useEffect,
): DefaultSettings {
    return getMetadataFrom(
        type as Parameters<typeof getMetadataFrom>[0],
        metadataHolder as Parameters<typeof getMetadataFrom>[1],
        defaultSettings,
        true,
        useEffectFn,
    );
}

const getSettings = (
    metaHolder: MangaIdInfo & GqlMetaHolder,
    defaultSettings?: IReaderSettings,
    useEffectFn?: typeof useEffect,
) =>
    getReaderSettingsWithDefaultValueFallback(
        'manga',
        {
            ...metaHolder,
            meta: convertFromGqlMeta(metaHolder.meta),
        },
        defaultSettings,
        useEffectFn,
    );

export const getReaderSettingsFor = (
    metaHolder: MangaIdInfo & GqlMetaHolder,
    defaultSettings: IReaderSettings,
): IReaderSettings => getSettings(metaHolder, defaultSettings);

export const useGetReaderSettingsFor = (
    metaHolder: MangaIdInfo & GqlMetaHolder,
    defaultSettings: IReaderSettings,
): IReaderSettings => {
    const settings = getSettings(metaHolder, defaultSettings, useEffect);
    return useMemo(() => settings, [metaHolder, defaultSettings]);
};

export const useDefaultReaderSettings = (): {
    metadata?: Metadata;
    settings: IReaderSettings;
    loading: boolean;
    request: ReturnType<typeof requestManager.useGetGlobalMeta>;
} => {
    const request = requestManager.useGetGlobalMeta({ notifyOnNetworkStatusChange: true });
    const { data, loading } = request;
    const metadata = useMemo(() => convertFromGqlMeta(data?.metas.nodes), [data?.metas.nodes]);
    const metaHolder: MetadataHolder = useMemo(() => ({ meta: metadata }), [metadata]);
    const tmpSettings = getReaderSettingsWithDefaultValueFallback('global', metaHolder, undefined, useEffect);
    const settings = useMemo(() => tmpSettings, [metaHolder]);

    return useMemo(
        () => ({
            metadata,
            settings,
            loading,
            request,
        }),
        [metadata, settings, loading, request],
    );
};
