import { useState } from "react"

import  { useField ,useAnecdotes} from '../hooks/index'
import { useNavigate } from 'react-router-dom'


const CreateNew = () => {
  const navigate = useNavigate()
  const { addAnecdote } = useAnecdotes()
  
 const handleReset = () => {
  content.clear()
  author.clear()
  info.clear()
}

  const content = useField('text')
  const author = useField('text')
  const info = useField('text')


  const handleSubmit = (e) => {
    e.preventDefault()

    addAnecdote({
      content: content.input.value,
      author: author.input.value,
      info: info.input.value,
      votes: 0
    })

    navigate('/')
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          
          <input {...content.input} />
          
        </div>
        <div>
          author
          <input {...author.input} />
        </div>
        <div>
          url for more info
         <input {...info.input} />
        </div>
        <button>create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
