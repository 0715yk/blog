// only server side
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { serialize } from 'next-mdx-remote/serialize'
// markdown을 html로 치환해줌

// blog 폴더(루트) 환경 = process.cwd()
// posts = md 파일이 있는 폴더
const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$|\.mdx$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       fileName: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       fileName: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        fileName: fileName.replace(/\.md$|\.mdx$/, ''),
      },
    }
  })
}

export async function getPostData(id) {
  const fullMdPath = path.join(postsDirectory, `${id}.md`)
  const mdExist = fs.existsSync(fullMdPath)

  if (mdExist) {
    const fileContents = fs.readFileSync(fullMdPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()

    // Combine the data with the id and contentHtml
    return {
      id,
      contentHtml,
      ...matterResult.data,
    }
  } else {
    const fullPath = path.join(postsDirectory, `${id}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const mdxSource = await serialize(matterResult.content)
    return {
      id,
      mdxSource,
      ...matterResult.data,
    }
  }
}

export async function createPost({ id, title, date, content }) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const data = `---
title: '${title}'
date: '${date}'
---

${content}`

  fs.writeFileSync(fullPath, data)
}
