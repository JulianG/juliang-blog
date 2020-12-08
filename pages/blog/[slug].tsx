import { GetStaticProps, GetStaticPaths } from "next";
import React from "react";
import dayjs from "dayjs";
import { Navigation, CommonHead, Footer } from "../../components";
import { getAllPosts, getPostBySlug } from "../../lib/merged-api";
import { Post } from '../../lib/types';

type Props = { post: Partial<Post> }

export const BlogPostPage = ({ post }: Props): JSX.Element => {
  const publishDate = dayjs(post.date).format("D MMMM, YYYY");

  return (
    <article>
      <header>
        <CommonHead title={`${post.title} - Julian​Garamendy​.dev`} description={post.description} />
        <h1>Julian​Garamendy​.dev</h1>
        <Navigation />
      </header>
      <section>
        <h1>{post.title}</h1>
        <small>{publishDate}</small>
        {post.coverImage ? <img src={post.coverImage} /> : null}
        <div dangerouslySetInnerHTML={{ __html: post.bodyHtml || '' }}></div>
      </section>
      <Footer />
    </article>
  );
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const slug = context.params?.slug
  try {
    const post = await getPostBySlug(`${slug}`);
    return { props: { post }, revalidate: 1 };
  } catch (e) {
    return { notFound: true }
 }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  return {
    paths: posts.map(post => (
      { params: { slug: post.slug } }
    )),
    fallback: true
  };
}

export default BlogPostPage;
