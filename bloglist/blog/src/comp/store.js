import { create } from 'zustand'

export const NotificationStore = create((set) => ({
  message: null,
  type: 'success',

  setNotification: (message, type = 'success') => {
    set({ message, type })
  },

  clearNotification: () => {
    set({ message: null, type: 'success' })
  }
}))

export const BlogStore = create((set) => ({
  blogs: [],

  setBlogs: (blogsOrUpdater) => {
    set((state) => ({
      blogs:
        typeof blogsOrUpdater === 'function'
          ? blogsOrUpdater(state.blogs)
          : blogsOrUpdater,
    }))
  },

  addBlog: (blog) => {
    set((state) => ({
      blogs: state.blogs.concat(blog)
    }))
  },
}))

export default { NotificationStore, BlogStore }

