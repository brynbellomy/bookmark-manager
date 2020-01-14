import React, { useState, useEffect } from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import Avatar from '@material-ui/core/Avatar'
import Drawer from '@material-ui/core/Drawer'
import TextField from '@material-ui/core/TextField'
import Tags from './Tags'
import { H5, H6 } from './Typography'
import { strToColor } from './utils'

function Sidebar(props) {
    const { editTitle, editNotes, url, entry, onClose, tagFilter } = props
    const [ editingTitle, setEditingTitle ] = useState(false)
    const [ editingNotes, setEditingNotes ] = useState(false)
    const classes = useStyles()

    if (!entry) {
        return null
    }

    function onClickTitle(evt, url) {
        evt.stopPropagation()
        setEditingTitle(true)
    }

    function onEditTitleKeyDown(evt) {
        if (evt.key === 'Enter' && evt.shiftKey === true) {
            evt.stopPropagation()
            evt.preventDefault()

            editTitle({ url, title: evt.target.value.trim() })
            setEditingTitle(false)
        }
    }

    function onClickNotes(evt, url) {
        evt.stopPropagation()
        setEditingNotes(true)
    }

    function onEditNotesKeyDown(evt) {
        if (evt.key === 'Enter' && evt.shiftKey === true) {
            evt.stopPropagation()
            evt.preventDefault()

            editNotes({ url, notes: evt.target.value.trim() })
            setEditingNotes(false)
        }
    }

    function onClickBackground() {
        setEditingTitle(false)
        setEditingNotes(false)
    }

    return (
        <Drawer anchor="right" open={!!url} onClose={onClose} onClick={onClickBackground} classes={{ paper: classes.root }}>
            <div className={classes.column}>
                <div className={classes.entryHeader}>
                    {entry.faviconURL && entry.faviconURL.length > 0 &&
                        <img src={entry.faviconURL} className={classes.favicon} />
                    }
                    {(!entry.faviconURL || entry.faviconURL.length === 0) &&
                        <Avatar className={classes.favicon} style={{ backgroundColor: strToColor(entry.pageTitle[0]) }}>{entry.pageTitle[0]}</Avatar>
                    }

                    {editingTitle &&
                        <TextField multiline fullWidth autoFocus defaultValue={entry.pageTitle} onKeyDown={onEditTitleKeyDown} />
                    }
                    {!editingTitle &&
                        <H5 onClick={onClickTitle}>{entry.pageTitle}</H5>
                    }
                </div>

                <div className={classes.screenshot} style={{ backgroundImage: `url(/image/${entry.screenshotFilename})` }}></div>
                <div className="link"><a href={url}>{url}</a></div>
                <div style={{ flexGrow: 1 }}></div>

                <div className={classes.notesWrapper}>
                    <H6>Notes</H6>

                    {editingNotes &&
                        <TextField
                            fullWidth
                            multiline
                            autoFocus
                            onKeyDown={onEditNotesKeyDown}
                            rows={4}
                            defaultValue={entry.notes}
                        />
                    }
                    {!editingNotes && entry.notes && entry.notes.trim().length > 0 &&
                        <div onClick={onClickNotes} className={classes.notes}>{entry.notes}</div>
                    }
                    {!editingNotes && (!entry.notes || entry.notes.trim().length === 0) &&
                        <div onClick={onClickNotes} className={classes.notes}>(click here to add notes)</div>
                    }
                </div>

                <div className={classes.tagsWrapper}>
                    <H6>Tags</H6>
                    <Tags
                        tags={entry.tags}
                        tagFilter={tagFilter}
                        hideTagsWhenFiltered={true}
                        showUntaggedButton={false}
                    />
                </div>
            </div>
        </Drawer>
    )
}

const useStyles = makeStyles(theme => createStyles({
    root: {
        width: 300,
        padding: 20,
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
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
    entryTitle: {
        cursor: 'text',
    },
    screenshot: {
        width: 300,
        height: 200,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
    },
    notesWrapper: {
        marginTop: 48,
    },
    tagsWrapper: {
        marginTop: 48,
    },
    notes: {
        fontFamily: 'Helvetica',
        fontSize: '0.8rem',
        marginTop: 12,
    },
}))

export default Sidebar