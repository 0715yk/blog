import Head from 'next/head'
import Date from '../../components/Date'
import Layout from '../../components/Layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from '../../styles/utils.module.css'
import { useRouter } from 'next/router'
import { MDXRemote } from 'next-mdx-remote'
import CodeBlock from '../../components/CodeBlock'

export async function getStaticPaths() {
  return {
    paths: getAllPostIds(),
    fallback: true,
    // 빌드시에 생성되지 않은 페이지에 대한 처리를 하는 옵션
    // false : 처리하지 않는다. 404 에러
    // true : callback 동작으로 loader를 보여줬다가 데이터가 있다면 그 때 그리겠다.
    // blocking을 하면 loader도 없이 안그리다가 제너레이션 되는 순간 그리겠다
  }
}

export async function getStaticProps({ params }) {
  // 이렇게 여기서 params를 받을 수 있다.
  const postData = await getPostData(params.fileName)
  return {
    props: {
      postData,
    },
  }
}

const Button = ({ children }) => {
  return (
    <button
      className="px-10 dark:bg-white dark:text-teal-700 bg-black text-lg text-teal-200 rounded-lg"
      onClick={() => alert(`thanks to ${children}`)}
    >
      {children}
    </button>
  )
}
const components = { Button, CodeBlock }

export default function Post({ postData }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        {postData.contentHtml && (
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        )}
        {postData.mdxSource && (
          <MDXRemote {...postData.mdxSource} components={components} />
        )}
      </article>
    </Layout>
  )
}
