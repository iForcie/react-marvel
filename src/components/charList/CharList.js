import { Component } from 'react';

import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false
        })
    } 

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    renderItems(arr) {              //метод для оптимизации, чтобы не помещать в render
        const items = arr.map((item) => {
            // console.log(item);
            let imgStyle = {'objectFit': 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit': 'unset'};
            }

            return (
                <li 
                    className="char__item"
                    key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        );
    }

    render() {

        const {charList, error, loading} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(errorMessage || spinner) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long" onClick={() => this.renderItems(charList)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;