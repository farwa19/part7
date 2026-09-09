const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}
const remove = async (object) => {
  try {
    const response = await fetch(`${baseUrl}/${object.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      console.log('anecdote deleted successfully.')
    } else {
      console.error('Failed to delete anecdote. Status:', response.status)
    }
  } catch (error) {
    console.error('Error deleting anecdote:', error)
  }
}
const createNew = async (object) => {
  console.log("jbh",object)
   const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(object)
  })
  
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  
  return await response.json()
}

export default { getAll, createNew ,remove}