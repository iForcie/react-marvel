import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';

import useMarvelService from '../../services/MarvelService';
import AppBanner from '../appBanner/AppBanner';
import setContent from '../utils/setContent';

const SinglePage = ({Component, dataType}) => {
	const {id} = useParams();
	const [data, setData] = useState(null);
	const {process, setProcess, getComic, getCharacter, clearError} = useMarvelService();

	useEffect(() => {
		updateData()
	}, [id])

	const updateData = () => {
		clearError();

		switch(dataType) {
			case 'comic':
				getComic(id).then(onDataLoaded).then(() => setProcess('confirmed'));
				break;
			case 'character':
				getCharacter(id).then(onDataLoaded).then(() => setProcess('confirmed'));
				break;
			default:
				console.log('default');
		}
	}

	const onDataLoaded = (data) => {
		setData(data);
	}

	// const errorMessage = error ? <ErrorMessage /> : null;
	// const spinner = loading ? <Spinner /> : null;
	// const content = !(loading || error || !data) ? <Component data={data} /> : null;

	return (
		<>
			<AppBanner/>
			{setContent(process, Component, data)}
		</>
	)
}

export default SinglePage;