import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { deleteSelectedEntries } from './redux/libActions'

function BatchDeleteDialog({ entries, selectedEntries, onClose, deleteSelectedEntries, open }) {
    async function onClickDelete() {
        await deleteSelectedEntries({ urls: Object.keys(selectedEntries) })
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Batch delete</DialogTitle>
            <DialogContent>
                <div>Are you sure you want to delete these bookmarks?</div>

                <ul>
                    {Object.keys(selectedEntries).map(url => (
                        <li key={url}>{entries[url].pageTitle}</li>
                    ))}
                </ul>

                <Button color="primary" onClick={onClickDelete}>Delete</Button>
            </DialogContent>
        </Dialog>
    )
}

// const mapStateToProps = (state) => {
//     return {
//         entries: state.lib.entries,
//         urlsByTimestamp: state.lib.urlsByTimestamp,
//         tags: [],
//         selectedEntries: state.lib.selectedEntries,
//     }
// }

const mapDispatchToProps = {
    deleteSelectedEntries,
}

export default connect(null, mapDispatchToProps)(BatchDeleteDialog)
