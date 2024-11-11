/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { ChapterBookmarkInfo, ChapterDownloadInfo, ChapterReadInfo } from '@/modules/chapter/services/Chapters.ts';
import { ChapterType } from '@/lib/graphql/generated/graphql.ts';
import { NullAndUndefined } from '@/Base.types.ts';
import { ChapterListOptions } from '@/modules/chapter/Chapter.types.ts';

export function unreadFilter(unread: NullAndUndefined<boolean>, { isRead: isChapterRead }: ChapterReadInfo) {
    switch (unread) {
        case true:
            return !isChapterRead;
        case false:
            return isChapterRead;
        default:
            return true;
    }
}

function downloadFilter(downloaded: NullAndUndefined<boolean>, { isDownloaded: chapterDownload }: ChapterDownloadInfo) {
    switch (downloaded) {
        case true:
            return chapterDownload;
        case false:
            return !chapterDownload;
        default:
            return true;
    }
}

function bookmarkedFilter(
    bookmarked: NullAndUndefined<boolean>,
    { isBookmarked: chapterBookmarked }: ChapterBookmarkInfo,
) {
    switch (bookmarked) {
        case true:
            return chapterBookmarked;
        case false:
            return !chapterBookmarked;
        default:
            return true;
    }
}

type TChapterSort = Pick<ChapterType, 'sourceOrder' | 'fetchedAt' | 'chapterNumber' | 'uploadDate'>;
const sortChapters = <T extends TChapterSort>(
    chapters: T[],
    { sortBy, reverse }: Pick<ChapterListOptions, 'sortBy' | 'reverse'>,
): T[] => {
    const sortedChapters: T[] = [...chapters];

    switch (sortBy) {
        case 'source':
            sortedChapters.sort((a, b) => a.sourceOrder - b.sourceOrder);
            break;
        case 'fetchedAt':
            sortedChapters.sort((a, b) => Number(a.fetchedAt ?? 0) - Number(b.fetchedAt ?? 0));
            break;
        case 'chapterNumber':
            sortedChapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
            break;
        case 'uploadedAt':
            sortedChapters.sort((a, b) => Number(a.uploadDate ?? 0) - Number(b.uploadDate ?? 0));
            break;
        default:
        // nothing to do
    }

    if (reverse) {
        sortedChapters.reverse();
    }

    return sortedChapters;
};

type TChapterFilter = TChapterSort & ChapterReadInfo & ChapterDownloadInfo & ChapterBookmarkInfo;
export function filterAndSortChapters<Chapters extends TChapterFilter>(
    chapters: Chapters[],
    options: ChapterListOptions,
): Chapters[] {
    const filtered = options.active
        ? chapters.filter(
              (chp) =>
                  unreadFilter(options.unread, chp) &&
                  downloadFilter(options.downloaded, chp) &&
                  bookmarkedFilter(options.bookmarked, chp),
          )
        : [...chapters];

    return sortChapters(filtered, options);
}

export const isFilterActive = (options: ChapterListOptions) => {
    const { unread, downloaded, bookmarked } = options;
    return unread != null || downloaded != null || bookmarked != null;
};