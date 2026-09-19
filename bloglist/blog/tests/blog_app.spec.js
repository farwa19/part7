const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });
  test("front page can be opened", async ({ page }) => {
    const locator = page.getByRole("heading", { name: "bLOGS" });
    await expect(locator).toBeVisible();
  });

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("link", { name: "login" }).click();
    const password = page.getByText("password");
    const username = page.getByText("username");
    await expect(password).toBeVisible();
    await expect(username).toBeVisible();

    // ...
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();
      await page.getByRole("textbox").first().fill("root");
      await page.getByRole("textbox").last().fill("sekret");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByRole("link", { name: /logout/i })).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("link", { name: "login" }).click();
      await page.getByRole("textbox").first().fill("rooyut");
      await page.getByRole("textbox").last().fill("sebhjkret");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByRole("link", { name: "login" })).toBeVisible();
    });
  });
});

describe("When logged in", () => {
  beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "login" }).click();
    await page.getByRole("textbox").first().fill("root");
    await page.getByRole("textbox").last().fill("sekret");
    await page.getByRole("button", { name: "login" }).click();

    // Wait until logout is visible to ensure login is complete before running tests
    await expect(page.getByRole("link", { name: "logout" })).toBeVisible();
  });

  test("a new blog can be created", async ({ page }) => {
    await page.getByRole("link", { name: "new blog" }).click();

    await page
      .getByRole("textbox", { name: "title" })
      .fill("test title by playwright");
    await page.getByRole("textbox", { name: "author" }).fill("tester");
    await page.getByRole("textbox", { name: "url" }).fill("http://test.com");
    await page.getByRole("button", { name: "create" }).click();

    // Wait for navigation to blogs page after creating
    await page.waitForURL("**/blogs");

    await expect(
      page.getByRole("link", { name: "test title by playwright" }),
    ).toBeVisible();
  });
  test("a new blog can be liked", async ({ page }) => {
    await page
      .getByRole("link", { name: "Go To Statement Considered Harmful" })
      .click();
    await page.waitForURL(/\/blogs\/[a-zA-Z0-9]+/);
    console.log(await page.content());
    const likesLocator = page.getByText(/Likes: \d+/);
    const likesText = await likesLocator.textContent();

    const currentLikes = parseInt(likesText.match(/\d+/)[0], 10);

    await page.getByRole("button", { name: "like" }).click();
    await page.getByRole("button", { name: "like" }).click();

    await expect(likesLocator).toHaveText(
      new RegExp(`Likes: ${currentLikes + 1}`),
    );
  });
  test("user who added the blog can delete the blog.", async ({ page }) => {
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    await page.getByRole("link", { name: "new blog" }).click();

    await page
      .getByRole("textbox", { name: "title" })
      .fill("test title by plkkjaywright");
    await page.getByRole("textbox", { name: "author" }).fill("tester");
    await page.getByRole("textbox", { name: "url" }).fill("http://test.com");
    await page.getByRole("button", { name: "create" }).click();

    await page.waitForURL("**/blogs");

    await page
      .getByRole("link", { name: "test title by plkkjaywright" })
      .click();
    await page.getByRole("button", { name: "delete" }).click();

    await expect(
      page.getByRole("link", { name: "test title by plkkjaywright" }),
    ).not.toBeVisible();
  });
  /*
  test('blogs are ordered according to likes with the blog with the most likes being first', async ({ page }) => {
    const blogs = page.locator('.blog')
    const likesArray = []

    for (let i = 0; i < await blogs.count(); i++) {
      const blog = blogs.nth(i)
      await blog.getByRole('button', { name: 'showmore' }).click()
      const likesText = await blog.getByText(/likes \d+/).textContent()
      const currentLikes = parseInt(likesText.match(/\d+/)[0], 10)
      likesArray.push(currentLikes)
    }
    console.log(likesArray)
    const sortedLikesArray = [...likesArray].sort((a, b) => b - a)
    expect(likesArray).toEqual(sortedLikesArray)
  })
  test('user who did not add the blog cannot see the delete button', async ({ page }) => {
    const response = await page.request.post('http://localhost:3002/api/users', {
      data: {
        username: 'musa',
        name: 'Musa',
        password: 'sexs'
      }
    })

    expect(response.status()).toBe(201)

    await page.getByRole('button', { name: 'logout' }).click()
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByRole('textbox').first().fill('musa')
    await page.getByRole('textbox').last().fill('sexs')
    await page.getByRole('button', { name: 'login' }).click()

    const blog = page.locator('.blog').filter({ hasText: 'Go To Statement Considered Harmful' })
    await blog.getByRole('button', { name: 'showmore' }).click()
    await expect(blog.getByRole('button', { name: 'delete' })).not.toBeVisible()
  })
    */
});
