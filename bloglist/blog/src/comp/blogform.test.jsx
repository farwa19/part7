import { render, screen } from "@testing-library/react";
import BlogForm from "./blogform";
import userEvent from "@testing-library/user-event";

test("calls the event handler with the right details when a new blog is created", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const titleInput = screen.getByPlaceholderText("title");
  const authorInput = screen.getByPlaceholderText("author");
  const urlInput = screen.getByPlaceholderText("url");

  const sendButton = screen.getByText("create");

  await user.type(titleInput, "test");
  await user.type(urlInput, "test.com");
  await user.type(authorInput, "tester");
  await user.click(sendButton);

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "test",
    author: "tester",
    url: "test.com",
  });
});
