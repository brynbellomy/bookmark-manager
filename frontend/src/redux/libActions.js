import * as fetch from '../fetch'

export const SET_ENTRIES = 'SET_ENTRIES'
export const SELECT_ENTRY = 'SELECT_ENTRY'
export const CLEAR_SELECTED_ENTRIES = 'CLEAR_SELECTED_ENTRIES'
export const DELETE_SELECTED_ENTRIES = 'DELETE_SELECTED_ENTRIES'

export const getEntries = () => {
    return async (dispatch) => {
        const entries = await fetch.getEntries()

        dispatch({
            type: SET_ENTRIES,
            payload: { entries },
        })
    }
}


export const selectEntry = (url, isSelected) => {
    return async (dispatch) => {
        dispatch({
            type: SELECT_ENTRY,
            payload: { url, isSelected },
        })
    }
}

export const clearSelectedEntries = (url, isSelected) => {
    return async (dispatch) => {
        dispatch({
            type: CLEAR_SELECTED_ENTRIES,
            payload: {},
        })
    }
}

export const deleteSelectedEntries = ({ urls }) => {
    return async (dispatch) => {
        await fetch.deleteEntries({ urls })
        dispatch({
            type: DELETE_SELECTED_ENTRIES,
            payload: {},
        })
        dispatch(getEntries())
    }
}

export const batchEditEntries = ({ urls, tagsToAdd, tagsToRemove }) => {
    return async (dispatch) => {
        const updatedEntries = await fetch.batchEdit({ urls, tagsToAdd, tagsToRemove })

        dispatch({
            type: SET_ENTRIES,
            payload: {
                entries: updatedEntries,
            },
        })
    }
}

export const editTitle = ({ url, title }) => {
    return async (dispatch) => {
        const updatedEntry = await fetch.editTitle({ url, title })

        dispatch({
            type: SET_ENTRIES,
            payload: {
                entries: updatedEntry,
            },
        })
    }
}

export const editNotes = ({ url, notes }) => {
    return async (dispatch) => {
        const updatedEntry = await fetch.editNotes({ url, notes })

        dispatch({
            type: SET_ENTRIES,
            payload: {
                entries: updatedEntry,
            },
        })
    }
}

