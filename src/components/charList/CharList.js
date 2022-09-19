import React, { useState, useEffect, useMemo, useRef } from 'react';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import PropTypes from 'prop-types';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import useMarvelService from '../../services/MarvelService';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
	switch(process) {
		case 'waiting':
			return <Spinner />;
		case 'loading':
			return newItemLoading ? <Component/> : <Spinner />;
		case 'confirmed':
			return <Component />;
		case 'error':
			return <ErrorMessage />;
		default:
			throw new Error('Unexpected process state');
	}
};

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const [lastIdToFocus, setLastIdToFocus] = useState(0);

    const charRef = useRef([]);

    const focusOnChar = (id) => {
        charRef[lastIdToFocus].classList.remove('char__item_selected');
        setLastIdToFocus(lastIdToFocus => id);
        charRef[id].classList.add('char__item_selected');
        charRef[id].focus();
        // console.log(charRef);
    }

    const {process, setProcess, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'));
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    function renderItems(arr) {              //метод для оптимизации, чтобы не помещать в render
        console.log('render');
        const items = arr.map((item, i) => {
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'};
            }

            return (
                <CSSTransition key={item.id} timeout={500} classNames="char__item">
                    <li
                        tabIndex={0}
                        className="char__item"
                        timeout={500}
                        ref={el => charRef[i] = el}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnChar(i);
                        }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            );
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    // const items = renderItems(charList);

    // const errorMessage = error ? <ErrorMessage /> : null;
    // const spinner = loading && !newItemLoading ? <Spinner /> : null;

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(charList), newItemLoading)
    }, [process]);

    return (
        <div className="char__list">
            {elements}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;