import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';
import { stripe } from '../../../services/stripe';
import { FaUsb } from 'react-icons/fa';

export async function saveSubscription(subscriptionId: string, customerId: string, createAction: boolean) {
	//Buscar o usuário no banco de Fauna como o id customerID
	//SAvler os dados da subscription do FaunaDB

	const userRef = await fauna.query(
		q.Select('ref', q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId)))
	);

	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	const subscriptionData = {
		id: subscription.id,
		userId: userRef,
		status: subscription.status,
		price_id: subscription.items.data[0].price.id,
	};

    if(createAction) {
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                {data: subscriptionData}
            )
        )
    }else{
        await fauna.query(
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subscriptionId
                        )
                    )
                ),
                {data: subscriptionData}
            )
        )

        /* await fauna.query(
            q.Update(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subscriptionId
                        )
                    )
                ),
                {data: {status: subscriptionData.status}}
            )
        ) */
    }

	//await fauna.query(q.Create(q.Collection('subscriptions'), { data: subscriptionData }));
}
