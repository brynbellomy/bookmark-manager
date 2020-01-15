import querystring from 'querystring'

export async function getEntries() {
    return await (await fetch('/entries')).json()
}

export async function deleteEntries({ urls }) {
    let qs = querystring.stringify({ url: urls })
    await fetch('/delete-urls?' + qs)
}

export async function batchEdit({ urls, tagsToAdd, tagsToRemove }) {
    const resp = await fetch('/batch-edit', {
        method: 'POST',
        body: JSON.stringify({ urls, tagsToAdd, tagsToRemove }),
    })
    return await resp.json()
}

export async function editTitle({ url, title }) {
    const resp = await fetch('/entry/title', {
        method: 'POST',
        body: JSON.stringify({ url, title }),
    })
    return await resp.json()
}

export async function editNotes({ url, notes }) {
    const resp = await fetch('/entry/notes', {
        method: 'POST',
        body: JSON.stringify({ url, notes }),
    })
    return await resp.json()
}



