import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { batchEditEntries } from './redux/libActions'

function BatchEditDialog(props) {
    const addTagsRef = useRef(null)
    const removeTagsRef = useRef(null)

    function onClickSave() {
        const tagsToAdd = addTagsRef.current.value.split(',').map(x => x.trim()).filter(x => x.length > 0)
        const tagsToRemove = removeTagsRef.current.value.split(',').map(x => x.trim()).filter(x => x.length > 0)
        props.batchEditEntries({ urls: Object.keys(props.selectedEntries), tagsToAdd, tagsToRemove })

        props.onClose()
    }

    return (
        <Dialog open={props.open} onClose={() => props.onClose()}>
            <DialogTitle>Batch edit</DialogTitle>
            <DialogContent>
                Add tags: <TextField inputRef={addTagsRef} /><br />
                Remove tags: <TextField inputRef={removeTagsRef} /><br />

                <Button color="primary" onClick={onClickSave}>Save</Button>
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
    batchEditEntries,
}

export default connect(null, mapDispatchToProps)(BatchEditDialog)
