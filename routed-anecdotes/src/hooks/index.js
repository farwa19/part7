
import anecdoteService from '../services/anecdotes'
import { useState, useEffect } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }
  const clear = () => {
  setValue('')
}

  const input = {
    type,
    value,
    onChange
  }

  return {
    input,
    clear
  }
}
export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = (anecdote) => {
    anecdoteService.createNew(anecdote).then(data => {
      setAnecdotes((currentAnecdotes) => currentAnecdotes.concat(data))
    })
  }

  const deleteAnecdote = (anecdote) => {
    anecdoteService.remove(anecdote).then(() => {
      setAnecdotes((currentAnecdotes) =>
        currentAnecdotes.filter((item) => item.id !== anecdote.id),
      )
    })
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote,
  }
}