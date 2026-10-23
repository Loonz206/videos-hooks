import { expect, test } from '@playwright/test';

const buildVideo = (id: string, title: string, description: string) => {
  return {
    id: {
      kind: 'youtube#video',
      videoId: id,
    },
    snippet: {
      title,
      description,
      thumbnails: {
        default: {
          url: 'https://example.com/default.jpg',
          width: 120,
          height: 90,
        },
        medium: {
          url: 'https://example.com/medium.jpg',
          width: 320,
          height: 180,
        },
        high: { url: 'https://example.com/high.jpg', width: 480, height: 360 },
      },
    },
  };
};

const fixtures: Record<string, unknown[]> = {
  'bacon cheeseburgers': [
    buildVideo(
      'bacon-1',
      'Bacon Cheeseburger Basics',
      'Default search video one',
    ),
    buildVideo('bacon-2', 'Burger Science', 'Default search video two'),
  ],
  cats: [
    buildVideo('cats-1', 'Cats Compilation', 'Cats search video one'),
    buildVideo('cats-2', 'Cat Facts', 'Cats search video two'),
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route(
    'https://www.googleapis.com/youtube/v3/search**',
    async (route) => {
      const requestUrl = new URL(route.request().url());
      const term = requestUrl.searchParams.get('q') || '';
      if (term === 'api-failure') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'API failed' }),
        });
        return;
      }

      const items = fixtures[term] || fixtures['bacon cheeseburgers'];

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items }),
      });
    },
  );
});

test('renders default videos and detail panel', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('button', { name: 'Bacon Cheeseburger Basics' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Bacon Cheeseburger Basics' }),
  ).toBeVisible();
  await expect(page.getByText('Default search video one')).toBeVisible();
});

test('search updates results and detail panel', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Video Search').fill('cats');
  await page.locator('button.searchbar__button').click();

  await expect(
    page.getByRole('button', { name: 'Cats Compilation' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Cats Compilation' }),
  ).toBeVisible();
  await expect(page.getByText('Cats search video one')).toBeVisible();
});

test('selecting another video updates the detail view', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Burger Science' }).click();
  await expect(
    page.getByRole('heading', { name: 'Burger Science' }),
  ).toBeVisible();
  await expect(page.getByText('Default search video two')).toBeVisible();
});

test('api failures trigger the application error boundary fallback', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByLabel('Video Search').fill('api-failure');
  await page.locator('button.searchbar__button').click();

  await expect(
    page.getByRole('heading', { name: 'We could not load this app.' }),
  ).toBeVisible();
});
