import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
    useParams,
    Link,
} from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles, createStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import GridOnIcon from '@material-ui/icons/GridOn'
import ListIcon from '@material-ui/icons/List'

import { selectEntry, clearSelectedEntries, deleteSelectedEntries, editTitle, editNotes } from './redux/libActions'
import EntryGrid from './EntryGrid'
import EntryList from './EntryList'
import BatchEditDialog from './BatchEditDialog'
import BatchDeleteDialog from './BatchDeleteDialog'
import Tags from './Tags'
import Sidebar from './Sidebar'
import { tagFallsWithin, processTagFilter, filterWantsUntagged } from './utils'

import './App.css'


function App(props) {
    let { entries, urlsByTimestamp, selectedEntries, tags, tagTree, selectEntry, clearSelectedEntries, deleteSelectedEntries, editTitle, editNotes } = props

    let routeParams = useParams()
    let tagFilter = processTagFilter(routeParams[0])

    const [ showBatchModal, setShowBatchModal ] = useState(false)
    const [ showDeleteModal, setShowDeleteModal ] = useState(false)
    const [ sidebarPageURL, setSidebarPageURL ] = useState(null)
    const [ listMode, setListMode ] = useState(true)
    const classes = useStyles()

    // Filter entries
    let urls = [ ...urlsByTimestamp ]
    if (filterWantsUntagged(tagFilter)) {
        urls = urls.filter(url => {
            const entry = entries[url]
            return !entry.tags || entry.tags.length === 0
        })
    } else if (tagFilter && tagFilter.length > 0) {
        urls = urls.filter(url => {
            const entry = entries[url]
            if (!entry.tags || entry.tags.length === 0) {
                return false
            }
            for (let tag of tagFilter) {
                let foundMatch = false
                for (let i = 0; i < entry.tags.length; i++) {
                    if (tagFallsWithin(entry.tags[i], tag)) {
                        foundMatch = true
                        break
                    }
                }
                if (!foundMatch) {
                    return false
                }
            }
            return true
        })
    }
    urls.reverse()



    return (
        <div className={classes.root}>
            <Paper className={classes.headerBar}>
                <h1>queue</h1>
                {Object.keys(selectedEntries).length > 0 &&
                    <React.Fragment>
                        <Button onClick={() => setShowBatchModal(true)}>Batch edit</Button>
                        <Button onClick={clearSelectedEntries}>Clear selection</Button>
                        <Button onClick={() => setShowDeleteModal(true)}>Delete</Button>
                    </React.Fragment>
                }

                <div style={{ flexGrow: 1 }}></div>

                {tagFilter &&
                    <Link to="/">
                        <Button>Clear tag filter</Button>
                    </Link>
                }

                <ButtonGroup size="small">
                    <Button onClick={() => setListMode(true)} disabled={listMode}><ListIcon /></Button>
                    <Button onClick={() => setListMode(false)} disabled={!listMode}><GridOnIcon /></Button>
                </ButtonGroup>

            </Paper>

            <div className={classes.mainContentArea} style={{ display: 'flex' }}>
                <div className="container" style={{ flexBasis: '85%' }}>

                    {listMode &&
                        <EntryList
                            urlsSorted={urls}
                            entries={entries}
                            selectedEntries={selectedEntries}
                            selectEntry={selectEntry}
                            tagFilter={tagFilter}
                            setSidebarPageURL={setSidebarPageURL}
                            tagTree={tagTree}
                        />
                    }

                    {!listMode &&
                        <EntryGrid
                            urlsSorted={urls}
                            entries={entries}
                            selectedEntries={selectedEntries}
                            selectEntry={selectEntry}
                            tagFilter={tagFilter}
                            setSidebarPageURL={setSidebarPageURL}
                        />
                    }

                </div>

                <Tags
                    tags={tags}
                    tagFilter={tagFilter}
                    hideTagsWhenFiltered={false}
                    showUntaggedButton={true}
                    classes={{ root: classes.tagContainerSidebar }}
                />
            </div>

            <BatchEditDialog open={showBatchModal} onClose={() => setShowBatchModal(false)} selectedEntries={selectedEntries} />
            <BatchDeleteDialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} entries={entries} selectedEntries={selectedEntries} />

            <Sidebar
                url={sidebarPageURL}
                entry={entries[sidebarPageURL]}
                onClose={() => setSidebarPageURL(null)}
                editTitle={editTitle}
                editNotes={editNotes}
                tagFilter={tagFilter}
            />
        </div>
    )
}

const useStyles = makeStyles(theme => createStyles({
    root: {},
    headerBar: {
        position: 'fixed',
        zIndex: 999,
        display: 'flex',
        backgroundColor: 'hsl(33, 5%, 94%)',
        height: 40,
        width: 'calc(100% - 40px)',
        padding: 20,
        top: 0,
        alignItems: 'center',

        '& > h1': {
            marginRight: 64,
        },

        '& > *': {
            height: 'fit-content',
        },
    },
    mainContentArea: {
        display: 'flex',
        padding: 20,
        marginTop: 80,
    },
    tagContainerSidebar: {
        flexBasis: '15%',
    },

    entry: {
        background: 'white',
        padding: 20,
        margin: 20,
        width: 300,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
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
    entryTitle: {
        cursor: 'text',
    },
    screenshot: {
        width: 300,
        height: 200,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
    },
}))

const mapStateToProps = (state) => {
    return {
        entries: state.lib.entries,
        urlsByTimestamp: state.lib.urlsByTimestamp,
        tags: state.lib.tags,
        tagTree: state.lib.tagTree,
        tagFilter: state.lib.tagFilter,
        selectedEntries: state.lib.selectedEntries,
    }
}

const mapDispatchToProps = {
    selectEntry,
    clearSelectedEntries,
    deleteSelectedEntries,
    editTitle,
    editNotes,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
