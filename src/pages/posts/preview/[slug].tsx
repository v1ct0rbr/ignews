import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { useEffect } from 'react';
import { getPrismicClient } from '../../../services/prismic';

import styles from '../post.module.scss';
interface PostPreviewProps {
	post: {
		slug: string;
		title: string;
		updatedAt: string;
		content: string;
	};
}

export default function Preview({ post }: PostPreviewProps) {
	const [session] = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session?.activeSubscription) {
			router.push(`/posts/${post.slug}`);
		}
	}, [session]);

	return (
		<>
			<Head>
				<title>{post.title} | Ignews</title>
			</Head>
			<main className={styles.container}>
				<article className={styles.post}>
					<h1>{post.title}</h1>
					<time className={styles.time}>{post.updatedAt}</time>
					<div
						className={`${styles.postContent} ${styles.previewContent}`}
						dangerouslySetInnerHTML={{ __html: post.content }}
					></div>
					<div className={styles.continueReading}>
						Wanna continue reading?
						<Link href="/">
							<a href="">Subscribe now 🤗</a>
						</Link>
					</div>
				</article>
			</main>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [
			{
				params: {
					slug: 'o-que-sao-sistemas-embarcados-para-que-serve-o-arduino',
				},
			},
		],
		fallback: 'blocking',
	};

	return {
		paths: [],
		fallback: 'blocking',
		//true, false, blocking
		//true: Se alguem acessa um post que não foi gerado de forma estática, então carrega pelo lado do cliente
		//false se o conteúdo não foi gerado de forma estática ainda, retorna um 404
		//true: quando não foi gerado um conteúdo de forma estática, ele vai tentar carregar esse conteúdo novo, porém carrega na camada do next (SSR).
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug } = params;

	const prismic = getPrismicClient();

	const response = await prismic.getByUID('pos', String(slug), {});

	const post = {
		slug,
		title: RichText.asText(response.data.title),
		content: RichText.asHtml(response.data.content.splice(0, 3)),

		updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}),
	};

	return {
		props: {
			post,
		},
		redirect: 60 * 30,
	};
};
