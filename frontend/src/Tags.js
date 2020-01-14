import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles, createStyles } from '@material-ui/styles'
import { addTag, removeTag, filterWantsUntagged, processTagFilter } from './utils'

function Tags(props) {
    let { tags, hideTagsWhenFiltered, showUntaggedButton } = props
    let routeParams = useParams()
    let tagFilter = processTagFilter(routeParams[0])

    const classes = useStyles(props) //{ ...useStyles(), ...props.classes }
    const selectedClass = hideTagsWhenFiltered ? classes.tagHidden : classes.tagSelected

    return (
        <div className={classes.root}>
            {(tags || []).map(tag => (
                <Tag tag={tag} tagFilter={tagFilter} classes={classes} selectedClass={selectedClass} key={tag} />
            ))}
            {showUntaggedButton && !filterWantsUntagged(tagFilter) &&
                <Link to="/untagged">
                    <div className={clsx(classes.tag)}>(untagged)</div>
                </Link>
            }
            {showUntaggedButton && filterWantsUntagged(tagFilter) &&
                <Link to="/">
                    <div className={clsx(classes.tag, classes.tagSelected)}>(untagged)</div>
                </Link>
            }
        </div>
    )
}

function Tag({ tag, tagFilter, classes, selectedClass }) {
    const isSelected = (tagFilter || []).includes(tag)
    const linkURL = isSelected 
        ? removeTag(tagFilter, tag).filter(x => !!x && x !== '').sort().join(',')
        :    addTag(tagFilter, tag).filter(x => !!x && x !== '').sort().join(',')
    return (
        <Link to={`/${linkURL}`}>
            <div key={tag}
                className={clsx(
                    classes.tag,
                    (tagFilter || []).includes(tag) && selectedClass
                )}
            >
                {tag}
            </div>
        </Link>
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
