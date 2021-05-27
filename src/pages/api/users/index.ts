import { NextApiRequest, NextApiResponse } from 'next';
import { exit } from 'process';

// JWT (Storage)
// Next Auth (Social)


export default (request: NextApiRequest, response: NextApiResponse) => {
	console.log(request.query);
	exit;
	const users = [
		{ id: 1, name: 'Victor' },
		{ id: 2, name: 'Henrique' },
		{ id: 3, name: 'Gilvonete' },
		{ id: 4, name: 'Natália' },
		{ id: 5, name: 'Donaria' },
	];

	return response.json(users);
};
