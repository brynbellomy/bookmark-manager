import sortBy from 'lodash/sortBy'
import {
    SET_ENTRIES,
    SELECT_ENTRY,
    CLEAR_SELECTED_ENTRIES,
    SET_TAG_FILTER,
} from './libActions'

const initialState = {
    entries: {},
    urlsByTimestamp: [],
    selectedEntries: {},
    tags: [],
    tagTree: {},
    tagFilter: undefined,
}

function setKeypath(obj, keypath) {
    let cursor = obj
    for (let key of keypath) {
        cursor[key] = cursor[key] || {}
        cursor = cursor[key]
    }
}

export default (state = initialState, action) => {
    switch (action.type) {

    case SET_ENTRIES: {
        const { entries } = action.payload

        const mergedEntries = {
            ...state.entries,
            ...entries,
        }

        // Cache a list of urls sorted by their creation timestamp
        let urlsByTimestamp = Object.keys(mergedEntries).map(url => ({
            url,
            timestampUTCSeconds: mergedEntries[url].timestampUTCSeconds,
        }))
        urlsByTimestamp = sortBy(urlsByTimestamp, 'timestampUTCSeconds').map(entry => entry.url)

        // Cache a deduplicated list of all tags
        let tags = Object.values(mergedEntries).reduce((into, each) => {
            (each.tags || []).forEach(tag => into[tag] = true)
            return into
        }, {})
        tags = sortBy(Object.keys(tags), tag => tag.toLowerCase())

        // Build a tree structure out of the tags for the list view
        const tagTree = {}
        function addURLToKeypath(tagTree, tag, url) {
            let keypath = tag.split('/')
            let cursor = tagTree
            for (let key of keypath) {
                cursor[key] = cursor[key] || {}
                cursor = cursor[key]
            }
            cursor.__entries__ = cursor.__entries__ || []
            cursor.__entries__.push(url)
        }

        for (let url of Object.keys(mergedEntries)) {
            const entry = mergedEntries[url]

            if (entry.tags) {
                for (let tag of entry.tags) {
                    addURLToKeypath(tagTree, tag, url)
                }
            }
        }

        return {
            ...state,
            entries: mergedEntries,
            urlsByTimestamp,
            tags,
            tagTree,
        }
    }

    case SELECT_ENTRY: {
        const { url, isSelected } = action.payload

        const selectedEntries = {
            ...state.selectedEntries,
        }
        if (!isSelected) {
            delete selectedEntries[url]
        } else {
            selectedEntries[url] = true
        }
        return {
            ...state,
            selectedEntries,
        }
    }

    case CLEAR_SELECTED_ENTRIES: {
        return {
            ...state,
            selectedEntries: {},
        }
    }

    case SET_TAG_FILTER: {
        const { tagFilter } = action.payload
        return {
            ...state,
            tagFilter,
        }
    }

    default:
        return {
            ...state,
        }
    }
}