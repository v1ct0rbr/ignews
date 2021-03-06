import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import subscribe from '../../pages/api/subscribe';
import { api } from '../../services/api';
import { getStripeJS } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
	priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
	const [session] = useSession();
	const router = useRouter();

	async function handleSubscribe() {
		if (!session) {
			signIn('github');
			return;
		}

		if (session.activeSubscription) {
			router.push('/posts');
			return;
		}

		try {
			const response = await api.post('/subscribe');

			const { sessionId } = response.data;

			const stripe = await getStripeJS();

			stripe.redirectToCheckout({ sessionId });
		} catch (err) {
			alert(err.message);
		}
	}

	return (
		<button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
			Subscribe
		</button>
	);
}
