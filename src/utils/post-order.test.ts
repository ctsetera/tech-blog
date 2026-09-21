import { describe, expect, test } from 'bun:test';
import { sortPosts, sortPostsByFilename } from './post-order';

function post(id: string, pinned = false, pubDate = '2023-01-01') {
  return { id, data: { pinned, pubDate: new Date(pubDate) } };
}

describe('post ordering', () => {
  test('pins take priority, with filenames descending in both groups', () => {
    const posts = [
      post('2023-04-15-01', true),
      post('2023-07-04-01'),
      post('2023-04-12-01'),
      post('2023-04-15-02', true),
      post('2023-04-16-01'),
    ];
    expect(sortPosts(posts).map((p) => p.id)).toEqual([
      '2023-04-15-02',
      '2023-04-15-01',
      '2023-07-04-01',
      '2023-04-16-01',
      '2023-04-12-01',
    ]);
  });

  test('filenames determine order even when publication dates disagree', () => {
    const posts = [
      post('2023-04-15-01', false, '2025-01-01'),
      post('2023-04-15-02', false, '2023-01-01'),
      post('2023-04-16-01', false, '2022-01-01'),
    ];
    expect(sortPosts(posts).map((p) => p.id)).toEqual([
      '2023-04-16-01',
      '2023-04-15-02',
      '2023-04-15-01',
    ]);
  });

  test('uses string order, so article numbers must be zero-padded', () => {
    const posts = [post('2023-04-15-10'), post('2023-04-15-2')];
    expect(sortPosts(posts).map((p) => p.id)).toEqual(['2023-04-15-2', '2023-04-15-10']);
  });

  test('navigation ignores pins and sorting leaves the input unchanged', () => {
    const posts = [post('2023-04-15-01', true), post('2023-04-15-02')];
    const original = [...posts];
    expect(sortPostsByFilename(posts).map((p) => p.id)).toEqual(['2023-04-15-02', '2023-04-15-01']);
    sortPosts(posts);
    expect(posts).toEqual(original);
  });
});
