import Head from 'next/head'
import Layout, { siteTitle } from '../components/Layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/Date'

// SSG ** Build 해야 동작한다.
export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}

// SSG 인데 외부에서 데이터를 받아오는 버전
// export async function getStaticProps() {
//   // 여기서는 경로를 상대 경로를 쓸 수 없음
//   이건 테스트용이고, 본래 요청하는 코드는 client side에만 둔다.
//   그리고 이 코드는 client side에 없으므로 이렇게 fetch 하면 안된다(지양한다).
//   const response = await fetch('https://github.com/vercel/next.js/issues/44062')
//   // const json = await response.json()

//   return {
//     props: {
//       allPostsData: [],
//     },
//   }
// }

// SSR
// CSR 처럼 이미 브라우저로 와서 데이터를 생성하는게 아니라
// 서버에서 요리를 마치고 보내는 형태 말그대로 SSR
// export async function getServerSideProps() {
//   const allPostsData = getSortedPostsData()
//   return {
//     props: {
//       allPostsData,
//     },
//   }
// }

export default function Home({ allPostsData }) {
  // CSR
  // CSR로 하려면 React 처럼 내부에 로직으로는 못함
  // 파일을 읽는건 nodejs에서 동작하기 때문
  // fs 모듈을 쓸 수 가 없다는 말임!
  // 그래서 api를 써야함
  // const [allPostsData, setAllPostsData] = useState([])
  // useEffect(() => {
  //   fetch('/api/posts')
  //     .then((res) => res.json())
  //     .then((data) => setAllPostsData(data.allPostsData))
  // }, [])

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>항상 발전하고, 성장하고자 하는 개발자 홍용기 입니다.</p>
        <ul>
          <li>📧 E-mail: calmmne@naver.com</li>
          <li>
            💾 Github: <a href="https://github.com/0715yk">0715yk</a>
          </li>
          <li>
            🏠 Blog: <a href="https://velog.io/@0715yk">velog</a>
          </li>
          <li>
            🖼이력서 : &nbsp;
            <a href="https://www.notion.so/937ab5b22e934c59893d97fa6e7e5189?pvs=4">
              resume
            </a>
          </li>
        </ul>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
