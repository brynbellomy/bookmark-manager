import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles, createStyles } from '@material-ui/styles'

import { setTagFilter } from './redux/libActions'

function Tags(props) {
    let { tags, tagFilter, hideTagsWhenFiltered, showUntaggedButton, setTagFilter } = props

    const classes = useStyles(props) //{ ...useStyles(), ...props.classes }

    function onClickUntagged() {
        if (!setTagFilter) {
            return
        }

        if (tagFilter && tagFilter.length === 0) {
            setTagFilter(undefined)
        } else if (tagFilter && tagFilter.length > 0) {
            setTagFilter([])
        } else if (!tagFilter) {
            setTagFilter([])
        }
    }

    function onClickTag(tag) {
        if (!setTagFilter) {
            return
        }

        if (!tagFilter) {
            setTagFilter([tag])
        } else if (tagFilter.includes(tag)) {
            let newFilter = tagFilter.filter(t => t !== tag)
            if (newFilter.length === 0) {
                newFilter = undefined
            }
            setTagFilter( newFilter )
        } else {
            setTagFilter([ ...(tagFilter || []), tag ])
        }
    }

    const selectedClass = hideTagsWhenFiltered ? classes.tagHidden : classes.tagSelected

    return (
        <div className={classes.root}>
            {(tags || []).map(tag => (
                <div key={tag}
                    className={clsx(
                        classes.tag,
                        (tagFilter || []).includes(tag) && selectedClass
                    )}
                    onClick={() => onClickTag(tag)}
                >
                    {tag}
                </div>
            ))}
            {showUntaggedButton &&
                <div className={clsx(classes.tag, tagFilter && tagFilter.length === 0 && classes.tagSelected)} onClick={onClickUntagged}>(untagged)</div>
            }
        </div>
    )
}

const useStyles = makeStyles(theme => createStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'start',
    },
    tag: {
        // backgroundColor: '#333',
        backgroundColor: '#5b8494',
        color: 'white',
        height: 'fit-content',
        margin: 5,
        padding: '2px 6px',
        borderRadius: 49,
        fontSize: '0.7rem',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
    },
    tagSelected: {
        backgroundColor: '#ff804f',
    },
    tagHidden: {
        display: 'none',
    },
}))

export default Tags
