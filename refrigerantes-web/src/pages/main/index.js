import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Swal from 'sweetalert2';
import api from '../../services/api';
import './styles.css';

export default class Main extends Component {
  state = {
    products: [],
    productList: [],
    totalPrice: 0,
    price: 0,
  };

  componentDidMount() {
    this.loadProducts();

    const productList = localStorage.getItem('productList');

    if (productList) {
      this.setState({ productList: JSON.parse(productList) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { productList } = this.state;

    if (prevState.productList !== productList) {
      localStorage.setItem('productList', JSON.stringify(productList));
    }
  }

  loadProducts = async () => {
    const response = await api.get();

    this.setState({ products: response.data });
  };

  handleChange = event => {
    const a = event.target.value.split(',');
    const price = a[0];
    const setPrice = { price };
    console.log(price);
    this.setState(setPrice);
  };

  handlerTotalPrice = () => {
    const { price, products } = this.state;
    const { amount } = this.refs;
    const { product } = this.refs;

    if (!amount.value && (!price || price === 0)) {
      Swal.fire(
        'Atenção!',
        'Você precisa selecionar um produto e uma quantidade.',
        'warning'
      );
    } else if (!amount.value) {
      Swal.fire('Atenção!', 'Você precisa informar uma quantidade.', 'warning');
    } else if (amount.value < 0) {
      Swal.fire(
        'Atenção!',
        `A quantidade não pode ser um número negativo, você nos informou: ${amount.value}`,
        'warning'
      );
    } else if (price <= 0 || !price) {
      Swal.fire(
        'Atenção!',
        'Você esqueceu de selecionar um produto.',
        'warning'
      );
    } else {
      const totalPrice = price * amount.value;
      if (totalPrice >= 0) {
        const setTotalPrice = { totalPrice };
        this.setState(setTotalPrice);
        Swal.fire(
          'Calculamos para você',
          `O valor total do(s) produto(s) é R$: ${totalPrice}`,
          'success'
        );
      } else {
        Swal.fire(
          'Atenção!',
          'Você esqueceu de por algum parâmetro, favor verificar',
          'warning'
        );
      }
    }
  };

  render() {
    const { products, totalPrice, productList } = this.state;

    return (
      <div className="product-list">
        <article>
          <strong>Selecione o seu refrigerante:</strong>
          <select onChange={this.handleChange}>
            <option value={0}>Selecione</option>
            {products.map(product => (
              <option
                ref="product"
                key={product.id}
                value={[product.valor, product.sabor, product.quantidade]}
              >
                {product.sabor}, {product.quantidade}, R$:{' '}
                {product.valor.toFixed(2)}
              </option>
            ))}
          </select>
        </article>
        <article>
          <strong>Selecione a quantidade desejada:</strong>
          <input ref="amount" type="number" />
        </article>

        <article>
          <strong>Valor total:</strong>
          <p>R$: {totalPrice.toFixed(2)}</p>
        </article>

        <button type="submit" onClick={() => this.handlerTotalPrice()}>
          CALCULAR VALOR
          <FontAwesome name="dollar" className="font-awesome" />
        </button>

        <article>
          <ul>
            {productList.map(product => (
              <li key={product.id}>
                <span>{product.name}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    );
  }
}
