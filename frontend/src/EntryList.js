import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles, createStyles } from '@material-ui/styles'
import Tags from './Tags'
import EntryIcon from './EntryIcon'
import { H5, H6 } from './Typography'
import { strToColor, walkTagTree } from './utils'


function EntryList(props) {
    const { urlsSorted, entries, selectedEntries, selectEntry, tagTree, tagFilter, setSidebarPageURL } = props
    const classes = useStyles()

    function onClickCheckbox(evt, url) {
        evt.stopPropagation()
        selectEntry(url, !selectedEntries[url])
    }

    const sections = []

    let tagRoots = tagFilter === undefined ? [ null ] : tagFilter
    for (let tagRoot of tagRoots) {
        walkTagTree(tagTree, tagRoot, (keypath, urls) => {
            sections.push((
                <EntryListSection
                    key={keypath}
                    keypath={keypath}
                    urls={urls}
                    entries={entries}
                    tagFilter={tagFilter}
                    classes={classes}
                />
            ))
        })
    }

    return (
        <div className={classes.root}>
            {sections}
        </div>
    )
}

function EntryListSection({ keypath, urls, entries, tagFilter, classes }) {
    const [ expanded, setExpanded ] = useState(false)

    return (
        <div className={clsx(expanded && classes.expandedSection)}>
            <div onClick={() => setExpanded(!expanded)} className={classes.expandableSectionHeader}>
                <ExpandMoreIcon className={clsx(classes.arrow, expanded && classes.arrowFlip)} />
                {keypath && <H5>{keypath.join('/')}</H5>}
            </div>

            {expanded && urls.map(url => (
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <EntryIcon entry={entries[url]} className={classes.favicon} />
                        {entries[url].pageTitle}
                    </ExpansionPanelSummary>

                    <ExpansionPanelDetails className={classes.expandedSectionBody}>
                        <div className={classes.screenshot} style={{ backgroundImage: `url(/image/${entries[url].screenshotFilename})` }}></div>
                        <div className={classes.notesWrapper}>
                            <H6>Notes</H6>
                            <div className={classes.notes}>{entries[url].notes}</div>
                        </div>
                        <div style={{ flexGrow: 1 }} />
                        <div>
                            <div className="link"><a href={url}>{url}</a></div>
                            <Tags
                                tags={entries[url].tags}
                                tagFilter={tagFilter}
                                hideTagsWhenFiltered={true}
                                showUntaggedButton={false}
                            />
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            ))}
        </div>
    )
}

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: '100%',
    },
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
        width: 24,
        height: 24,
        marginRight: 24,
    },
    screenshot: {
        width: 300,
        height: 200,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
    },
    notesWrapper: {
        minWidth: 300,
        marginLeft: 32,
    },
    notes: {
        fontFamily: 'Helvetica',
        fontSize: '0.8rem',
        marginTop: 12,
    },
    expandableSectionHeader: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    expandedSection: {
        marginTop: 20,
        marginBottom: 20,
    },
    expandedSectionBody: {
        justifyContent: 'space-between',
    },
    arrow: {
        marginRight: 16,
    },
    arrowFlip: {
        transform: 'rotate(180deg)',
        transition: 'transform 200ms',
    },
}))

export default EntryList

