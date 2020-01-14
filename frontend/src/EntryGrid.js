import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import { makeStyles, createStyles } from '@material-ui/styles'
import Tags from './Tags'
import EntryIcon from './EntryIcon'
import { strToColor } from './utils'

function EntryGrid(props) {
    const { urlsSorted, entries, selectedEntries, selectEntry, tagFilter, setSidebarPageURL } = props
    const classes = useStyles()

    function onClickCheckbox(evt, url) {
        evt.stopPropagation()
        selectEntry(url, !selectedEntries[url])
    }

    return (
        <React.Fragment>
            {urlsSorted.map(url => (
                <Paper key={url}
                    className={clsx(classes.entry, selectedEntries[url] && classes.entrySelected)}
                    onClick={() => setSidebarPageURL(url)}
                >
                    <div className={classes.selectCardOverlay}>
                        <Checkbox checked={!!selectedEntries[url]} onClick={evt => onClickCheckbox(evt, url)} />
                    </div>

                    <div className={classes.entryHeader}>
                        <EntryIcon entry={entries[url]} className={classes.favicon} />
                        {entries[url].pageTitle}
                    </div>
                    <div className={classes.screenshot} style={{ backgroundImage: `url(/image/${entries[url].screenshotFilename})` }}></div>
                    <div className="link"><a href={url}>{url}</a></div>
                    <div style={{ flexGrow: 1 }}></div>

                    <Tags
                        tags={entries[url].tags}
                        tagFilter={tagFilter}
                        hideTagsWhenFiltered={true}
                        showUntaggedButton={false}
                    />
                </Paper>
            ))}
        </React.Fragment>
    )
}

const useStyles = makeStyles(theme => createStyles({
    entry: {
        background: 'white',
        padding: 20,
        margin: 20,
        width: 300,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',

        '&:hover $selectCardOverlay': {
            display: 'block',
        },
    },
    selectCardOverlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'none',
        width: 'fit-content',
        height: 'fit-content',
    },
    entrySelected: {
        background: '#bfe6ff',
    },
    entryHeader: {
        display: 'flex',
        marginBottom: 10,
    },
    favicon: {
        width: 32,
        height: 32,
        marginRight: 10,
    },
    screenshot: {
        width: 300,
        height: 200,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
    },
}))

export default EntryGrid

