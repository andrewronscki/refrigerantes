import React, { Component } from 'react';
import api from '../../services/api';
import { async } from 'q';
import "./styles.css";

export default class Main extends Component {
    state = {
        products: [],
    }

    componentDidMount() {
        this.loadProducts();
    }

    loadProducts = async () => {
        const response = await api.get();

        this.setState({ products: response.data});
    };

    render() {
        const { products } = this.state;
        return (
            <div className="product-list">
                {products.map(product => (
                    <article key={product.id}>
                        <strong>{product.sabor}</strong>
                        <p>{product.quantidade}</p>
                        <a href="">Comprar</a>
                    </article>
                ))}
            </div>
        )
    }
}

// https://www.carlrippon.com/react-drop-down-data-binding/