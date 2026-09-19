import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect } from "vitest";
import Blog from "./blog";
import { MemoryRouter } from "react-router-dom";
import persistentUser from "../service/persistentUser";

test("renders content", () => {
  const mockUser = {
    username: "testuser",
    name: "User",
    id: "1234577667",
  };

  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpattjjhhjerns.com/",
    likes: 7,
    user: mockUser,
  };

  render(
    <MemoryRouter>
      <Blog blog={blog} user={mockUser} />
    </MemoryRouter>,
  );
  console.log("mockUser:", "firtst");
  screen.debug();
  const element = screen.getByText("React patterns");
  expect(element).toBeDefined();
});
/*
test('clicking the button shows blogs URL and number of likes', async () => {
   const mockUser = {
    username: 'testuser',
    name: 'User',
    id: '1234577667'
  }

  
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpattjjhhjerns.com/',
    likes: 7,
    user: mockUser
  }
  const mockHandler = vi.fn()

  render( <Blog blog={blog} user={mockUser} toggleImportance={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('showmore')
  await user.click(button)
  console.log(mockHandler)
  const url = screen.getByText('https://reactpattjjhhjerns.com/')
  const like = screen.getByText('likes 7')
  
  expect(url).toBeDefined()
  expect(like).toBeDefined()

  
})


//test('if the like button is clicked twice, the event handler the component received as props is called twice.', async () => {
   //const mockUser = {
   // username: 'testuser',
    //name: 'User',
    //id: '1234577667'
 // }

  
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpattjjhhjerns.com/',
    likes: 7,
    user: mockUser
  }
  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={mockUser} updateLikes={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('showmore')
  await user.click(button)
  const likebutton = screen.getByText('like')
  await user.click(likebutton)
  await user.click(likebutton)
 expect(mockHandler.mock.calls).toHaveLength(2)

  
})
*/
test("Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed", async () => {
  const mockUser = {
    username: "testuser",
    name: "User",
    id: "1234577667",
  };
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpattjjhhjerns.com/",
    likes: 7,
    user: mockUser,
  };
  const mockHandler = vi.fn();
  render(
    <MemoryRouter>
      <Blog blog={blog} user={null} updateLikes={mockHandler} />
    </MemoryRouter>,
  );

  const user = userEvent.setup();
  const link = screen.getByText("React patterns");

  await user.click(link);

  const like = screen.getByText("Likes: 7");

  expect(like).toBeDefined();
  const likebutton = screen.queryByText("like");
  const deletebutton = screen.queryByText("delete");
  expect(likebutton).toBeNull();
  expect(deletebutton).toBeNull();
});
test("Delete button is displayed only for the owner of the blog", async () => {
  const mockUser = {
    username: "testuser",
    name: "User",
    id: "1234577667",
  };
  persistentUser.saveUser(mockUser);
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpattjjhhjerns.com/",
    likes: 7,
    user: mockUser,
  };
  const mockHandler = vi.fn();
  render(
    <MemoryRouter>
      <Blog blog={blog} user={mockUser} updateLikes={mockHandler} />
    </MemoryRouter>,
  );
  screen.debug();
  const user = userEvent.setup();
  console.log("mockUser:", screen.debug());
  const link = screen.getByText("React patterns");

  screen.debug();
  console.log("jndkjnkj");
  await user.click(link);
  const deletebutton = screen.getByText("delete");
  expect(deletebutton).toBeDefined();
});
test("Authenticated users who are not the blog’s creator are shown only the like button", async () => {
  const mockUser = {
    username: "testuser",
    name: "User",
    id: "1234577667",
  };
  const anotherUser = {
    username: "anotheruser",
    name: "Another User",
    id: "987654321",
  };
  persistentUser.saveUser(anotherUser);
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpattjjhhjerns.com/",
    likes: 7,
    user: mockUser,
  };
  const mockHandler = vi.fn();
  render(
    <MemoryRouter>
      <Blog blog={blog} user={anotherUser} updateLikes={mockHandler} />
    </MemoryRouter>,
  );
  const user = userEvent.setup();
  console.log("mockUser:", screen.debug());
  const link = screen.getByText("React patterns");
  await user.click(link);
  screen.debug();
  const likebutton = screen.getByText("Like");
  const deletebutton = screen.queryByText("delete");
  expect(likebutton).toBeDefined();
  expect(deletebutton).toBeNull();
});
