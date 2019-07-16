import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Swal from 'sweetalert2';
import api from '../../services/api';
import './styles.css';

export default class Main extends Component {
  state = {
    products: [],
    productList: [{ mensagem: '' }],
    productTemp: [],
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
    const valueOfSelect = event.target.value.split(',');
    const price = valueOfSelect[0];
    const sabor = valueOfSelect[1];
    const quantidade = valueOfSelect[2];
    const setPrice = { price };
    const setProductTemp = {
      price,
      sabor,
      quantidade,
    };
    this.setState({ productTemp: setProductTemp });
    this.setState(setPrice);
  };

  handlerTotalPrice = () => {
    const { price } = this.state;
    const { productTemp } = this.state;
    const { amount } = this.refs;

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
      const quantidadeTotal = amount.value;
      const totalPrice = price * quantidadeTotal;
      if (totalPrice >= 0) {
        const setTotalPrice = { totalPrice };
        this.setState(setTotalPrice);
        Swal.fire(
          'Calculamos para você',
          `O valor total do(s) produto(s) é R$: ${totalPrice}`,
          'success'
        );
        const mensagem = `${productTemp.sabor}, ${productTemp.quantidade}, 1un = R$: ${price}, total: ${quantidadeTotal}un = R$: ${totalPrice}`;
        const setProductList = {
          id: Math.random(1000),
          mensagem,
        };
        this.setState({ productList: setProductList });
        console.log(setProductList);
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
                <span>{product.mensagem}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    );
  }
}
