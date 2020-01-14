import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { strToColor } from './utils'

export default function EntryIcon({ entry, className }) {
    if (entry.faviconURL && entry.faviconURL.length > 0) {
        return <img src={entry.faviconURL} className={className} />
    } else {
        return <Avatar className={className} style={{ backgroundColor: strToColor(entry.pageTitle[0]) }}>{entry.pageTitle[0]}</Avatar>
    }
}

