import memoize from 'lodash/memoize'

export function tagFallsWithin(tag, tagScope) {
    const tagScopeParts = tagScope.split('/')
    const tagParts = tag.split('/')

    if (tagParts.length < tagScopeParts.length) {
        return false
    }

    for (let i = 0; i < tagScopeParts.length; i++) {
        if (tagParts[i] !== tagScopeParts[i]) {
            return false
        }
    }
    return true
}

function drillDown(tagTree, keypath) {
    let cursor = tagTree
    for (let key of keypath) {
        cursor = cursor[key]
    }
    return cursor
}

export function walkTagTree(tagTree, startingKeypath, fn) {
    function recurse(cursor, currentKeypath) {
        fn(currentKeypath, cursor.__entries__ || [])

        let subtags = Object.keys(cursor).filter(key => key !== '__entries__').sort()
        for (let tag of subtags) {
            if (currentKeypath !== null) {
                recurse(cursor[tag], [ ...currentKeypath, tag ])
            } else {
                recurse(cursor[tag], [ tag ])
            }
        }
    }

    let cursor
    if (startingKeypath !== null) {
        startingKeypath = startingKeypath.split('/')
        cursor = drillDown(tagTree, startingKeypath)
        if (!cursor) {
            return
        }
    } else {
        cursor = tagTree
    }

    recurse(cursor, startingKeypath)
}

export const strToColor = memoize(function(str) {
    return colors[getHashCode(str) % colors.length]
})

function getHashCode(str) {
    var hash = 0
    if (str.length === 0) { return hash }
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
        hash = hash & hash // Convert to 32bit integer
    }
    if (hash < 0) {
        hash *= -1
    }
    return hash
}

var colors = [
    '#FF8A80',
    '#FF5252',
    '#FF1744',
    '#D50000',
    // '#FF80AB',
    '#FF4081',
    '#F50057',
    '#C51162',
    // '#EA80FC',
    '#E040FB',
    // '#AA00FF',
    '#B388FF',
    '#7C4DFF',
    '#651FFF',
    '#6200EA',
    '#8C9EFF',
    '#536DFE',
    '#3D5AFE',
    '#304FFE',
    '#82B1FF',
    '#448AFF',
    '#2979FF',
    '#2962FF',
    '#80D8FF',
    '#40C4FF',
    '#00B0FF',
    '#0091EA',
    '#26C6DA',
    '#00BCD4',
    '#00ACC1',
    '#0097A7',
    '#00838F',
    '#006064',
    '#4DB6AC',
    '#26A69A',
    '#009688',
    '#00897B',
    '#00796B',
    '#00695C',
    '#004D40',
    '#66BB6A',
    '#4CAF50',
    '#43A047',
    '#388E3C',
    '#2E7D32',
    // '#1B5E20',
    '#FDD835',
    // '#FBC02D',
    '#F9A825',
    '#F57F17',
    '#FB8C00',
    '#F57C00',
    '#EF6C00',
    '#E65100',
    '#E64A19',
    '#D84315',
    '#BF360C',
    '#607D8B',
    // '#546E7A',
    '#455A64',
]
